'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Typography, List, Card, message } from 'antd';
import { getSupabaseClient } from '@/utils/supabase/client';

const { Title } = Typography;
import { useRouter } from 'next/navigation';
export default function CategoryArticlesPage() {
  const { id } = useParams(); // 分类 ID
  const supabase = getSupabaseClient();

  const [articles, setArticles] = useState<any[]>([]);
  const [categoryName, setCategoryName] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    const load = async () => {
      setLoading(true);

      const [{ data: posts, error: postErr }, { data: category, error: catErr }] = await Promise.all([
        supabase
          .from('posts')
          .select('id, title, content, created_at, author_id')
          .eq('category_id', id)
          .order('created_at', { ascending: false }),

        supabase
          .from('categories')
          .select('name')
          .eq('id', id)
          .single(),
      ]);

      if (postErr || catErr) {
        message.error('加载失败');
        return;
      }

      setCategoryName(category?.name || '');
      setArticles(posts || []);
      setLoading(false);
    };

    if (id) load();
  }, [id]);

  const goToArticleDetailPage = (id: string) => {
    router.push(`/articles/${id}`);
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
      <Title level={3}>分类：{categoryName}</Title>

      <List
        loading={loading}
        grid={{ gutter: 16, column: 3 }}
        dataSource={articles}
        renderItem={(item) => (
          <List.Item>
            <Card
              title={item.title}
              extra={new Date(item.created_at).toLocaleDateString()}
              hoverable
              style={{ height: '100%' }}
              onClick={() => goToArticleDetailPage(item.id)}
            >
              <div>{item.content.slice(0, 80)}...</div>
            </Card>
          </List.Item>
        )}
        locale={{ emptyText: '暂无文章' }}
      />
    </div>
  );
}
