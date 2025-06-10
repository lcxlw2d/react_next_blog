'use client';
import { useEffect, useState } from 'react';
import { Button, message, Card, List, Typography, Empty } from 'antd';
import styles from './index.module.scss';
const { Title, Paragraph, Text } = Typography;
import Link from 'next/link';
import dayjs from 'dayjs';
import { useRouter } from "next/navigation";
import { getSupabaseClient } from '@/utils/supabase/client'
export default function Home() {
  const [messageApi, contextHolder] = message.useMessage();
  const router = useRouter();
  const supabase = getSupabaseClient();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setArticles(data);
      } else {
        messageApi.error('加载文章失败');
      }
    }
    fetchArticles();
  }, [])
  const handleCreateArticle = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;
    if (!user) {
      messageApi.success('请先登录');
      return;
    }
    router.push('/articles/create');
  };
  const goToDetailPage = (articleId: string) => {
    router.push(`/articles/${articleId}`);
  };
  return (
    <div>
      {contextHolder}
      <div className={styles.titleArea}>
        <h1>我的博客</h1>
        <p className={styles.description}>
          一个基于 Next.js、Antd、Supabase 的博客
        </p>
        <Button type='primary' size='large' onClick={handleCreateArticle}>写文章</Button>
      </div>

      <div style={{ padding: '2rem' }}>
        <Title level={3}>博客文章</Title>
        {
          articles.length === 0 ? (
            <Empty description="暂无文章" />
          ) : (
            <List
              grid={{ gutter: 24, column: 3 }}
              dataSource={articles}
              renderItem={(item) => (
                <List.Item>
                  <Card
                    hoverable
                    title={
                      <Link href={`/post/${item.id}`}>
                        <Text strong>{item.title}</Text>
                      </Link>
                    }
                    bordered
                    style={{ borderRadius: '12px', height: '100%' }}
                    onClick={() => {
                      goToDetailPage(item.id);
                    }}
                  >
                    <Text type="secondary">
                      作者：{item.author_id} · {dayjs(item.created_at).format('YYYY-MM-DD')}
                    </Text>
                    <Paragraph ellipsis={{ rows: 3 }} style={{ marginTop: 8 }}>
                      {item.content}
                    </Paragraph>
                  </Card>
                </List.Item>
              )}
            />
          )
        }

      </div>

    </div>
  );
}
