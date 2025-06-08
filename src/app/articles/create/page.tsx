'use client';

import { useEffect, useState } from 'react';
import { Form, Input, Button, Select, message, Typography } from 'antd';
import { getSupabaseClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

const { TextArea } = Input;
const { Title } = Typography;

type Category = {
  id: string;
  name: string;
};

export default function CreatePostPage() {
  const supabase = getSupabaseClient();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name')
        .order('name', { ascending: true });

      if (!error && data) {
        setCategories(data);
      } else {
        messageApi.error('加载分类失败');
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase.from('posts').insert({
      title: values.title,
      content: values.content,
      category_id: values.category_id,
      author_id: user?.id,
    });

    setLoading(false);

    if (error) {
      messageApi.error('发布失败：' + error.message);
    } else {
      messageApi.success('文章发布成功');
      router.push('/');
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '2rem' }}>
      {contextHolder}
      <Title level={3}>创建新文章</Title>
      <Form layout="vertical" onFinish={handleSubmit}>
        <Form.Item label="文章标题" name="title" rules={[{ required: true, message: '请输入标题' }]}>
          <Input />
        </Form.Item>

        <Form.Item label="文章内容" name="content" rules={[{ required: true, message: '请输入内容' }]}>
          <TextArea rows={6} />
        </Form.Item>

        <Form.Item label="分类" name="category_id" rules={[{ required: true, message: '请选择分类' }]}>
          <Select placeholder="请选择分类">
            {categories.map((cat) => (
              <Select.Option key={cat.id} value={cat.id}>
                {cat.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            发布文章
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
