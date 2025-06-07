"use client"

import Link from "next/link";
import { navs } from "./config";
import styles from "./style.module.scss";
import { Button, Divider, Dropdown } from "antd";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import LoginModal from "components/LoginModal";
import { getSupabaseClient } from "@/utils/supabase/client";
import type { MenuProps } from 'antd';
const NavBar = () => {
  const pathname = usePathname();
  const [isLogin, setIsLogin] = useState(false);
  const supabase = getSupabaseClient();
  const [user, setUser] = useState<any>(null);

  const handleLogin = () => {
    loginModalRef.current?.showModal();
  };
  const onLogin = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;
    console.log(user, '---')
    setUser(user);
    if (user) {
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }
  };
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLogin(false);
  };
  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <Button type="link" danger onClick={handleLogout}>
          退出登录
        </Button>
      ),
    },
  ];
  const loginModalRef = useRef(null);

  useEffect(() => {
    onLogin();
  }, [])

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
          {isLogin ?
            <Dropdown menu={{ items }} placement="bottomLeft">
              <Button>{user.email}</Button>
            </Dropdown> : <Button type="primary" onClick={handleLogin}>登录</Button>}
        </div>
        <LoginModal ref={loginModalRef} onLogin={onLogin} />
      </header>
      <Divider />
    </section>

  );
};

export default NavBar;