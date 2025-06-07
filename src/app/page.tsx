'use client';
import { Button, message, Card, List, Typography, Empty } from 'antd';
import styles from './index.module.scss';
const { Title, Paragraph, Text } = Typography;
import Link from 'next/link';
import dayjs from 'dayjs';

// 假设这是从 Supabase 获取到的文章数据
const articles = [
  {
    id: '1',
    title: '使用 Supabase 构建博客系统',
    author: '张三',
    created_at: '2025-06-07T10:12:00Z',
    content: 'Supabase 是一个开源的 Firebase 替代品，适合快速构建现代应用。它内置 Auth、数据库、存储和实时功能...',
  },
  {
    id: '2',
    title: 'React 与 Ant Design 快速入门',
    author: '李四',
    created_at: '2025-06-06T15:40:00Z',
    content: 'Ant Design 是阿里出品的一套企业级 UI 组件库，在 React 中使用极为流行，尤其适合后台系统和内容展示类项目...',
  },
];
export default function Home() {
  const [messageApi, contextHolder] = message.useMessage();

  const showMsg = () => {
    messageApi.open({
      type: 'success',
      content: 'This is a success message',
    });
  };

  return (
    <div>
      {contextHolder}
      <div className={styles.titleArea}>
        <h1>我的博客</h1>
        <p className={styles.description}>
          一个基于 Next.js 的博客系统
        </p>
        <Button type='primary' size='large' onClick={showMsg}>写文章</Button>
      </div>

      <div style={{ padding: '2rem' }}>
        <Title level={3}>博客文章</Title>
        {
          articles.length === 0 ? (
            <Empty description="暂无文章" />
          ) : (
            <List
              grid={{ gutter: 24, column: 3 }} // ✅ 每行 3 列
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
                  >
                    <Text type="secondary">
                      作者：{item.author} · {dayjs(item.created_at).format('YYYY-MM-DD')}
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
