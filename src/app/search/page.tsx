'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { List, Card, Typography, Empty, message, Spin } from 'antd';
import { getSupabaseClient } from '@/utils/supabase/client';

const { Title } = Typography;
import { useRouter } from 'next/navigation';

type Post = {
  id: string;
  title: string;
  content: string;
  created_at: string;
};

export default function SearchPage() {
  const searchParams = useSearchParams();
  const keyword = searchParams.get('keyword') || '';
  const supabase = getSupabaseClient();

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      let res;
      if (!keyword) {
        res = await supabase
          .from('posts')
          .select('id, title, content, created_at')
          .order('created_at', { ascending: false });
      } else {
        res = await supabase
          .from('posts')
          .select('id, title, content, created_at')
          .ilike('title', `%${keyword}%`) // 模糊查询（不区分大小写）
          .order('created_at', { ascending: false });
      }
      const { data, error } = res;

      if (error) {
        messageApi.error('搜索失败: ' + error.message);
      } else {
        setPosts(data || []);
      }

      setLoading(false);
    };

    fetchPosts();
  }, [keyword]);

  const goToArticleDetailPage = (id: string) => {
    router.push(`/articles/${id}`);
  };


  return (
    <div style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>
      {contextHolder}
      <Title level={3}>搜索结果：{keyword}</Title>

      {loading ? (
        <Spin tip="加载中..." />
      ) : posts.length ? (
        <List
          grid={{ gutter: 16, column: 3 }}
          dataSource={posts}
          renderItem={(item) => (
            <List.Item>
              <Card
                title={item.title}
                hoverable
                style={{ borderRadius: 12 }}
                onClick={() => goToArticleDetailPage(item.id)}
              >
                <div>{item.content.slice(0, 80)}...</div>
                <div style={{ marginTop: 10, fontSize: 12, color: '#999' }}>
                  {new Date(item.created_at).toLocaleDateString()}
                </div>
              </Card>
            </List.Item>
          )}
        />
      ) : (
        <Empty description="没有找到匹配的文章" />
      )}
    </div>
  );
}
