import LoginForm from '@/components/admin/login-form';

export const metadata = {
  title: 'LODGEX - 관리자 로그인',
  description: 'LODGEX 숙박업 관리 시스템 관리자 로그인 페이지',
};

export default function AdminLoginPage() {
  return (
    <>
      {/* 로고 및 브랜딩 섹션 */}
      <div className="text-center mb-12">
        <div className="mb-8">
          {/* 메인 로고 */}
          <div className="relative mb-6">
            {/* 로고 배경 글로우 효과 */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#D4B98B]/30 to-[#C9A96E]/20 blur-3xl rounded-full scale-150"></div>
            
            {/* 로고 아이콘 컨테이너 */}
            <div className="relative w-20 h-20 mx-auto bg-gradient-to-br from-[#D4B98B] to-[#C9A96E] rounded-2xl 
                          flex items-center justify-center shadow-2xl shadow-[#D4B98B]/30 
                          transform hover:scale-105 transition-transform duration-300">
              {/* 호텔 아이콘 */}
              <svg className="w-10 h-10 text-[#1C2A44]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              
              {/* 내부 글로우 효과 */}
              <div className="absolute inset-2 bg-gradient-to-br from-white/20 to-transparent rounded-xl"></div>
            </div>
          </div>
          
          {/* 브랜드명 */}
          <div className="space-y-4">
            <h1 className="text-5xl font-bold text-white mb-3 tracking-tight font-serif">
              <span className="bg-gradient-to-r from-white via-[#F4F4F6] to-white bg-clip-text text-transparent">
                LODGEX
              </span>
            </h1>
            
            {/* 장식적 구분선 */}
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-8 h-0.5 bg-gradient-to-r from-transparent to-[#D4B98B]"></div>
              <div className="w-3 h-3 bg-[#D4B98B] rounded-full shadow-lg shadow-[#D4B98B]/50"></div>
              <div className="w-16 h-0.5 bg-gradient-to-r from-[#D4B98B] to-[#C9A96E]"></div>
              <div className="w-3 h-3 bg-[#C9A96E] rounded-full shadow-lg shadow-[#C9A96E]/50"></div>
              <div className="w-8 h-0.5 bg-gradient-to-r from-[#C9A96E] to-transparent"></div>
            </div>
            
            <div className="space-y-2">
              <p className="text-[#D4B98B] text-lg font-semibold tracking-wide">
                Lodgement Management System
              </p>
              <p className="text-white/70 text-sm font-medium">
                전문가와 함께하는 숙박업 운영 솔루션
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 로그인 카드 */}
      <div className="relative">
        {/* 카드 배경 글로우 */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#D4B98B]/10 to-[#C9A96E]/5 blur-3xl rounded-3xl scale-105"></div>
        
        {/* 메인 카드 */}
        <div className="relative bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl 
                      shadow-2xl shadow-black/30 p-8 md:p-12 overflow-hidden">
          
          {/* 카드 내부 글로우 효과 */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-gradient-to-b from-[#D4B98B]/10 to-transparent blur-2xl"></div>
          
          <div className="relative">
            {/* 헤더 */}
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-white mb-3 font-serif">
                관리자 로그인
              </h2>
              <p className="text-white/70 text-base">
                관리자 계정으로 시스템에 접속하세요
              </p>
            </div>

            {/* 로그인 폼 */}
            <LoginForm />

            {/* 추가 옵션들 */}
            <div className="mt-8">
              {/* 보안 안내 */}
              <div className="p-6 bg-gradient-to-r from-[#D4B98B]/10 via-[#D4B98B]/5 to-transparent 
                            border border-[#D4B98B]/20 rounded-2xl backdrop-blur-sm">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-8 h-8 bg-[#D4B98B]/20 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-[#D4B98B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-sm text-white/80 leading-relaxed">
                    <p className="font-semibold text-white mb-2 text-[#D4B98B]">보안 안내</p>
                    <p className="mb-2">
                      안전한 시스템 관리를 위해 다음 사항을 준수해 주세요:
                    </p>
                    <ul className="space-y-1 text-white/70">
                      <li>• 강력한 비밀번호 사용</li>
                      <li>• 공용 컴퓨터 사용 시 로그아웃 필수</li>
                      <li>• 의심스러운 접근 시도 즉시 신고</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 푸터 */}
      <div className="mt-12 text-center space-y-4">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-12 h-px bg-gradient-to-r from-transparent to-white/30"></div>
          <div className="w-1.5 h-1.5 bg-[#D4B98B] rounded-full"></div>
          <div className="w-12 h-px bg-gradient-to-r from-white/30 to-transparent"></div>
        </div>
        
        <p className="text-sm text-white/60 font-medium">
          © 2025 Lodgex. All rights reserved.
        </p>
      </div>
    </>
  );
}