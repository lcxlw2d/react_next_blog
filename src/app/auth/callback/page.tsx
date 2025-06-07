// app/auth/callback/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseClient } from '@/utils/supabase/client';

export default function AuthCallback() {
  const router = useRouter();
  const supabase = getSupabaseClient();
  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (data.session) {
        const user = data.session.user;

        // 🚀 插入/同步到 profiles 表
        const { error } = await supabase.from('profiles').upsert({
          id: user.id,
          username: user.user_metadata?.user_name || user.email,
          avatar_url: user.user_metadata?.avatar_url || '',
        });

        if (error) {
          console.error('写入 profile 失败：', error.message);
        }
        router.push('/');
      } else {
        router.push('/login');
      }
    };

    checkSession();
  }, [router]);

  return <p>登录中，请稍候...</p>;
}
