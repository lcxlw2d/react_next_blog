'use client';

import { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Modal,
  Input,
  message,
  Popconfirm,
  Space,
  Typography,
  Form,
} from 'antd';
import { PlusOutlined, EditOutlined } from '@ant-design/icons';
import { getSupabaseClient } from '@/utils/supabase/client';

const { Title } = Typography;

export default function CategoryManagementPage() {
  const supabase = getSupabaseClient();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any | null>(null);
  const [form] = Form.useForm();

  const [messageApi, contextHolder] = message.useMessage();
  const fetchCategories = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) messageApi.error('加载分类失败');
    else setCategories(data || []);
    setLoading(false);
  };

  const handleOpenModal = (category: any = null) => {
    setEditMode(!!category);
    setEditingCategory(category);
    form.setFieldsValue({
      name: category?.name || '',
      description: category?.description || '',
    });
    setModalVisible(true);
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();

    if (editMode && editingCategory) {
      // 修改
      const { error } = await supabase
        .from('categories')
        .update({
          name: values.name.trim(),
          description: values.description?.trim() || '',
        })
        .eq('id', editingCategory.id);

      if (error) return messageApi.error('更新失败：' + error.message);
      messageApi.success('更新成功');
    } else {
      // 新增
      const { error } = await supabase.from('categories').insert({
        name: values.name.trim(),
        description: values.description?.trim() || '',
      });

      if (error) return messageApi.error('添加失败：' + error.message);
      messageApi.success('添加成功');
    }

    setModalVisible(false);
    fetchCategories();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) messageApi.error('删除失败：' + error.message);
    else {
      messageApi.success('删除成功');
      fetchCategories();
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
      {contextHolder}
      <Title level={3}>分类管理</Title>

      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => handleOpenModal()}
        style={{ marginBottom: 16 }}
      >
        添加分类
      </Button>

      <Table
        dataSource={categories}
        rowKey="id"
        loading={loading}
        pagination={false}
        columns={[
          {
            title: '分类名称',
            dataIndex: 'name',
            key: 'name',
          },
          {
            title: '描述',
            dataIndex: 'description',
            key: 'description',
            render: (text: string) => text || '--',
          },
          {
            title: '操作',
            key: 'actions',
            render: (_, record) => (
              <Space>
                <Button
                  icon={<EditOutlined />}
                  type="link"
                  onClick={() => handleOpenModal(record)}
                >
                  编辑
                </Button>
                <Popconfirm
                  title="确认删除此分类？"
                  onConfirm={() => handleDelete(record.id)}
                  okText="删除"
                  cancelText="取消"
                >
                  <Button danger type="link">
                    删除
                  </Button>
                </Popconfirm>
              </Space>
            ),
          },
        ]}
      />

      <Modal
        open={modalVisible}
        title={editMode ? '编辑分类' : '添加分类'}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        okText={editMode ? '保存修改' : '添加'}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="分类名称"
            name="name"
            rules={[{ required: true, message: '请输入分类名称' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="分类描述" name="description">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
