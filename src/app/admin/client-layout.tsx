'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { checkAdminSession, getAdminSession } from '@/lib/auth/check-admin';
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

  useEffect(() => {
    // 로그인 페이지는 체크 스킵
    if (pathname === '/admin/login') {
      setIsChecking(false);
      return;
    }

    // 세션 체크
    const isValid = checkAdminSession();
    if (!isValid) {
      router.push('/admin/login');
      return;
    }

    // 세션 정보 가져오기
    const session = getAdminSession();
    setAdminInfo(session);
    setIsChecking(false);
  }, [pathname, router]);

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