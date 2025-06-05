import React, { useState, useRef, forwardRef, useImperativeHandle, use } from "react";
import { Modal, Button, Form, Input, Select, Row, Col } from "antd";
const { Option } = Select;
import type { FormProps } from 'antd';
import styles from "./style.module.scss";
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

const LoginModal = forwardRef<ChildHandle>((props, ref) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("手机登录");

  useImperativeHandle(ref, () => ({
    showModal: () => {
      setIsModalOpen(true);
    },
  }));

  const handleOk = () => {
    props.onLogin("登录成功");
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select style={{ width: 70 }}>
        <Option value="86">+86</Option>
        <Option value="87">+87</Option>
      </Select>
    </Form.Item>
  );
  const captchaPrefix = (
    <div style={{ width: '48px' }}>验证码</div>
  );
  const [captchaText, setCaptchaText] = useState('获取验证码');
  const [isCaptchaDisabled, setIsCaptchaDisabled] = useState(false);
  const handleCaptcha = () => {
    let time = 3;
    setCaptchaText(`${time}s`);
    setIsCaptchaDisabled(true);

    const timer = setInterval(() => {
      time--;
      setCaptchaText(time + 's');
      if (time === 0) {
        clearInterval(timer);
        setCaptchaText('获取验证码');
        setIsCaptchaDisabled(false);
      }
    }, 1000);
  };
  const captchaAfter = (
    <Button type="link" disabled={isCaptchaDisabled} onClick={handleCaptcha}>{captchaText}</Button>
  );

  const [form] = Form.useForm();
  // 给form设定初始值
  form.setFieldsValue({
    prefix: '86',
    phone: '',
    password: '',
  });

  return (
    <Modal
      title={modalTitle}
      closable={true}
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <div className={styles.loginForm}>
        <Form
          form={form}
          name="basic"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 18 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item<FieldType>
            name="phone"
            label=""
            rules={[{ required: true, message: 'Please input your phone number!' }]}
          >
            <Input addonBefore={prefixSelector} placeholder="请输入手机号" />
          </Form.Item>
          <Form.Item label="">
            <Form.Item
              name="captcha"
              noStyle
              rules={[{ required: true, message: '请输入验证码' }]}
            >
              <Input addonBefore={captchaPrefix} addonAfter={captchaAfter} />
            </Form.Item>
          </Form.Item>

          {/* <Form.Item<FieldType>
            label=""
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password />
          </Form.Item> */}
        </Form>
      </div>
    </Modal>
  );
});

export default LoginModal;