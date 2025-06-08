'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Form, Input, Button, Select, message, Typography, Spin } from 'antd';
import { getSupabaseClient } from '@/utils/supabase/client';

const { Title } = Typography;
const { TextArea } = Input;

export default function EditPostPage() {
  const supabase = getSupabaseClient();
  const { id } = useParams();
  const router = useRouter();

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      // 获取分类
      const { data: categoryData } = await supabase
        .from('categories')
        .select('id, name')
        .order('name', { ascending: true });

      setCategories(categoryData || []);

      // 获取文章详情
      const { data: post, error } = await supabase
        .from('posts')
        .select('title, content, category_id')
        .eq('id', id)
        .single();

      if (error) {
        message.error('加载文章失败');
      } else {
        form.setFieldsValue(post);
      }

      setLoading(false);
    };

    fetchData();
  }, [id, supabase, form]);

  const handleSubmit = async (values: any) => {
    setLoading(true);

    const { error } = await supabase
      .from('posts')
      .update({
        title: values.title,
        content: values.content,
        category_id: values.category_id,
      })
      .eq('id', id);

    setLoading(false);

    if (error) {
      message.error('更新失败：' + error.message);
    } else {
      message.success('文章更新成功');
      router.push(`/articles/${id}`); // 跳转回详情页
    }
  };

  if (loading) return <Spin tip="加载中..." />;

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '2rem' }}>
      <Title level={3}>编辑文章</Title>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item label="标题" name="title" rules={[{ required: true, message: '请输入标题' }]}>
          <Input />
        </Form.Item>

        <Form.Item label="内容" name="content" rules={[{ required: true, message: '请输入内容' }]}>
          <TextArea rows={6} />
        </Form.Item>

        <Form.Item label="分类" name="category_id" rules={[{ required: true, message: '请选择分类' }]}>
          <Select placeholder="选择分类">
            {categories.map((cat) => (
              <Select.Option key={cat.id} value={cat.id}>
                {cat.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            保存修改
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
