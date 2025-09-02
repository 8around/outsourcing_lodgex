'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import AdminLayout from '@/components/admin/admin-layout';

export default function AdminClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);
  const [adminInfo, setAdminInfo] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    // 로그인 페이지는 체크 스킵
    if (pathname === '/admin/login') {
      setIsChecking(false);
      return;
    }

    // Supabase Auth 세션 체크
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/admin/login');
        return;
      }

      // 관리자 정보 조회
      const { data: adminData } = await supabase
        .from('admins')
        .select('id, email')
        .eq('auth_user_id', session.user.id)
        .single();

      if (!adminData) {
        router.push('/admin/login');
        return;
      }

      setAdminInfo({
        id: adminData.id,
        email: adminData.email,
        loginAt: new Date().toISOString()
      });
      setIsChecking(false);
    };

    checkSession();
  }, [pathname, router, supabase]);

  // 로그인 페이지는 레이아웃 없이 렌더링
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // 세션 체크 중
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  // 세션이 없으면 아무것도 렌더링하지 않음 (이미 리다이렉트 중)
  if (!adminInfo) {
    return null;
  }

  return <AdminLayout adminInfo={adminInfo}>{children}</AdminLayout>;
}