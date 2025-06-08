'use client';

import { useEffect, useState } from 'react';
import { List, Card, Spin, Alert, Typography, Empty, Button } from 'antd';
import { getSupabaseClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
const { Title } = Typography;

type Category = {
  id: string;
  name: string;
  created_at: string;
  description: string;
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = getSupabaseClient();

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        setError(error.message);
      } else {
        setCategories(data || []);
      }
      setLoading(false);
    };

    fetchCategories();
  }, []);

  const goToManageCategories = () => {
    router.push('/categories/manage');
  };

  if (loading) return <Spin tip="加载中..." />;
  if (error) return <Alert type="error" message="加载失败" description={error} />;

  return (
    <div style={{ padding: '24px' }}>
      <Title level={3}>分类</Title>
      <div style={{ textAlign: 'right', margin: '10px 0' }}>
        <Button type="primary" onClick={goToManageCategories}>管理分类</Button>
      </div>
      {
        categories.length ? (
          <List
            grid={{ gutter: 16, column: 3 }}
            dataSource={categories}
            renderItem={(item) => (
              <List.Item>
                <Card
                  title={item.name}
                  hoverable
                  style={{ borderRadius: 12 }}
                  onClick={() => {
                    // 后续可跳转到分类详情页
                    console.log('点击分类:', item.name);
                  }}
                >
                  {item.description}
                </Card>
              </List.Item>
            )}
          />
        ) : <Empty description="暂无分类" />
      }

    </div>
  );
}
