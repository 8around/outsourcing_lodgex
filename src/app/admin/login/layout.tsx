import React from 'react'

interface AdminLoginLayoutProps {
  children: React.ReactNode
}

export default function AdminLoginLayout({ children }: AdminLoginLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1C2A44] via-[#2A3A5E] to-[#1C2A44] relative overflow-hidden">
      {/* 배경 장식 요소들 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* 메인 그라디언트 오버레이 */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1C2A44]/90 via-[#2A3A5E]/95 to-[#1C2A44]/90"></div>
        
        {/* 장식적 원형 요소들 */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#D4B98B]/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-[#C9A96E]/8 rounded-full blur-2xl"></div>
        <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-[#D4B98B]/3 rounded-full blur-xl"></div>
        
        {/* 패턴 오버레이 */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(212, 185, 139, 0.5) 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }}></div>
      </div>
      
      {/* 메인 컨텐츠 컨테이너 */}
      <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
      
      {/* 하단 장식적 요소 */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#D4B98B]/30 to-transparent"></div>
    </div>
  )
}