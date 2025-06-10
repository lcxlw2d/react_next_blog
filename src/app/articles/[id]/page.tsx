'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getSupabaseClient } from '@/utils/supabase/client';
import { Typography, Spin, Alert, Card, Button, message, Popconfirm } from 'antd';

const { Title, Paragraph, Text } = Typography;
import { useRouter } from 'next/navigation';
import Link from 'next/link';
type PostDetail = {
  id: string;
  title: string;
  content: string;
  created_at: string;
  author_id: string;
  category: {
    name: string;
  } | null;
};

export default function PostDetailPage() {
  const { id } = useParams();
  const supabase = getSupabaseClient();

  const [post, setPost] = useState<PostDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    const fetchPost = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('id, title, content, created_at, author_id, category:category_id(id, name)')
        .eq('id', id)
        .single();

      if (error) {
        setError(error.message);
      } else {
        setPost(data);
      }
      setLoading(false);
    };

    fetchPost();
  }, [id]);

  const editButton = (
    <Button type="primary" style={{ marginRight: '10px' }} onClick={() => router.push(`/articles/${id}/edit`)}>
      编辑
    </Button>
  );
  const handleDelete = async () => {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id);

    if (error) {
      messageApi.error('删除失败：' + error.message);
    } else {
      messageApi.success('文章已删除');
      router.push('/'); // 删除后跳转到首页或文章列表页
    }
  };
  const delButton = (
    <Popconfirm
      title="确定要删除这篇文章吗？"
      description="此操作不可撤销，请谨慎操作。"
      onConfirm={handleDelete}
      okText="确认删除"
      cancelText="取消"
    >
      <Button danger type="primary">
        删除文章
      </Button>
    </Popconfirm>
  );

  if (loading) return <Spin tip="加载中..." />;
  if (error) return <Alert type="error" message="加载失败" description={error} />;
  if (!post) return <Alert type="warning" message="文章不存在" />;

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '2rem' }}>
      {contextHolder}
      <Card>
        <Title>{post.title}</Title>
        <div style={{ textAlign: 'right' }}>
          {editButton}
          {delButton}
        </div>
        <Text type="secondary">
          分类：
          <Link href="/category/[id]" as={`/category/${post.category?.id}`}>
            {post.category?.name || '未分类'}
          </Link>
          ｜ 创建时间：{new Date(post.created_at).toLocaleString()}
        </Text>
        <Paragraph style={{ marginTop: '1rem', whiteSpace: 'pre-wrap' }}>{post.content}</Paragraph>
      </Card>
    </div>
  );
}
