import { Divider } from 'antd';
import styles from './style.module.scss'
const Footer = () => {
  return (
    <div>
      <Divider />
      <footer className={styles.footer}>
        <p>© 2025 博客系统. 保留所有权利.</p>
      </footer>
    </div>
  );
};

export default Footer;