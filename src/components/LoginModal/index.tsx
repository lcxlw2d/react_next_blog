import React, { useState, useRef, forwardRef, useImperativeHandle, use } from "react";
import { Modal, Button, Form, Input, Select, Typography, Space, Checkbox, message } from "antd";
const { Option } = Select;
import type { FormProps } from 'antd';
import { useRouter } from "next/navigation";
import styles from "./style.module.scss";
const { Title, Text, Link } = Typography;
import {
  MailOutlined,
  LockOutlined,
  GithubOutlined
} from '@ant-design/icons';
import { getSupabaseClient } from '@/utils/supabase/client'
import { css } from '@emotion/css';
const hideAsterisk = css`
  .ant-form-item-required::before {
    display: none !important;
  }
`;
const githubButton = css`
  color: #24292e !important;
  border-color: #24292e !important;
  
  &:hover {
    background-color: #24292e !important;
    color: #fff !important;
    border-color: #2f363d !important;
  }
`;
type ChildHandle = {
  showModal: () => void;
};
type Props = {
  onLogin: (message: string) => void;
};

type FieldType = {
  username?: string;
  password?: string;
  phone?: string;
  captcha?: string;
};

const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
  console.log('Success:', values);
};

const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
  console.log('Failed:', errorInfo);
};
const onFieldsChange = (changedFields: any, allFields: any) => {

};

// 邮箱正则表达式
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const supabase = getSupabaseClient();

const LoginModal = forwardRef<ChildHandle>((props, ref) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("登录");
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const router = useRouter();

  useImperativeHandle(ref, () => ({
    showModal: () => {
      setIsModalOpen(true);
      form.resetFields();
      form.setFieldsValue({
        prefix: '86',
        phone: '',
        password: '',
        email: '',
      });
    },
  }));


  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const registerView = () => {
    const handleSignUp = async () => {
      setLoading(true);
      try {
        const values = await form.validateFields();
        console.log('Success:', values);
        const { email, password } = form.getFieldsValue();

        const res = await supabase.auth.signUp({
          email,
          password,
        });
        console.log(res, '????')

        if (res.error) {
          messageApi.error(`注册失败: ${res.error.message}`);
        } else {
          setIsRegister(false);
          setModalTitle('登录');
          form.setFieldValue('password', '');
          messageApi.success('注册成功，请检查邮箱确认链接。');
        }

      } catch (errorInfo) {
        console.log('Failed:', errorInfo);
        return;
      }
      setLoading(false);
    };
    const validatePassword = () => ({
      validator(_: any, value: any) {
        if (!value || form.getFieldValue('password') === value) {
          return Promise.resolve();
        }
        return Promise.reject(new Error('两次输入的密码不一致！'));
      },
    });
    return (
      <div className={styles.loginForm}>
        <Form
          className={hideAsterisk}
          form={form}
          name="basic"
          layout="vertical"
          onFieldsChange={onFieldsChange}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >

          <Form.Item
            name="email"
            label="邮箱地址"
            rules={[
              { required: true, message: '请输入您的邮箱地址' },
              {
                pattern: emailRegex,
                message: '请输入有效的邮箱地址'
              }
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="example@domain.com"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="密码"
            rules={[
              { required: true, message: '请输入您的密码' },
              { min: 6, message: '密码至少6个字符' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="请输入密码"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="确认密码"
            dependencies={['password']}
            rules={[
              { required: true, message: '请再次输入密码！' },
              validatePassword
            ]}
            hasFeedback
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="请再次输入密码"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              size="large"
              onClick={handleSignUp}
            >
              {loading ? '处理中' : '注册'}
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center' }}>
            <Text>已有账号? </Text>
            <Button type="link" onClick={() => {
              setModalTitle('登录')
              setIsRegister(false)
            }}>去登录</Button>
          </div>
        </Form>
      </div>
    );
  };

  const handleSignIn = async () => {
    const { email, password } = form.getFieldsValue();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      messageApi.error(`登录失败: ${error.message}`);
    } else {
      messageApi.success('登录成功');
      setIsModalOpen(false);
      props.onLogin("登录成功");
    }
  };
  const handleGitHubLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  };

  return (
    <Modal
      title={modalTitle}
      closable={true}
      open={isModalOpen}
      onCancel={handleCancel}
      footer={null}
      width='400px'
      centered
    >
      {contextHolder}
      {
        isRegister ? (
          registerView()
        ) : (
          <div className={styles.loginForm}>
            <div className={styles.thirdPartyLogin}>
              <Button
                ghost
                block
                icon={<GithubOutlined />}
                className={githubButton}
                onClick={handleGitHubLogin}
              >
                使用Github登录
              </Button>
              <div className={styles.divider}>或使用邮箱登录</div>
            </div>
            <Form
              className={hideAsterisk}
              form={form}
              name="basic"
              layout="vertical"
              onFieldsChange={onFieldsChange}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
            >

              <Form.Item
                name="email"
                label="邮箱地址"
                rules={[
                  { required: true, message: '请输入您的邮箱地址' },
                  {
                    pattern: emailRegex,
                    message: '请输入有效的邮箱地址'
                  }
                ]}
              >
                <Input
                  prefix={<MailOutlined />}
                  placeholder="example@domain.com"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                name="password"
                label="密码"
                rules={[
                  { required: true, message: '请输入您的密码' },
                  { min: 6, message: '密码至少6个字符' }
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="请输入密码"
                  size="large"
                />
              </Form.Item>

              <Form.Item>
                <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                  <Form.Item name="remember" valuePropName="checked" noStyle>
                    <Checkbox>记住我</Checkbox>
                  </Form.Item>
                  <Link href="/forgot-password">忘记密码?</Link>
                </Space>
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                  size="large"
                  onClick={handleSignIn}
                >
                  {loading ? '登录中...' : '登录'}
                </Button>
              </Form.Item>

              <div style={{ textAlign: 'center' }}>
                <Text>还没有账号? </Text>
                <Button type="link" onClick={() => {
                  setModalTitle('注册')
                  setIsRegister(true)
                }}>立即注册</Button>
              </div>
            </Form>
          </div>
        )
      }

    </Modal>
  );
});

export default LoginModal;