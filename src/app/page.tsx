'use client';
import { Button, message } from 'antd';

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
      <Button onClick={showMsg}>show msg</Button>
    </div>
  );
}
