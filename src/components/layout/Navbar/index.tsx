"use client"

import Link from "next/link";
import { navs } from "./config";
import styles from "./style.module.scss";
import { Button, Divider } from "antd";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import LoginModal from "components/LoginModal";
const NavBar = () => {
  const pathname = usePathname();
  const [isLogin, setIsLogin] = useState(false);
  const handleLogin = () => {
    loginModalRef.current?.showModal();
  };
  const onLogin = () => {
    setIsLogin(true);
  };
  const handleLogout = () => {
    setIsLogin(false);
  };
  const loginModalRef = useRef(null);

  return (
    <section>
      <header className={styles.navbar}>
        <div className={styles.logoArea}>我的博客</div>
        <div className={styles.linkArea}>
          {
            navs?.map(nav => (
              <Link key={nav.path} href={nav.path}>
                <span className={`${styles.link} ${pathname === nav.path ? styles.active : ""}`}>{nav.name}</span>
              </Link>
            ))
          }
        </div>
        <div className={styles.operationArea}>
          {isLogin ? <Button type="primary" danger onClick={handleLogout}>退出登录</Button> : <Button type="primary" onClick={handleLogin}>登录</Button>}
        </div>
        <LoginModal ref={loginModalRef} onLogin={onLogin} />
      </header>
      <Divider />
    </section>

  );
};

export default NavBar;