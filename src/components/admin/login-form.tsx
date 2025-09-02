'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Supabase Auth로 로그인
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) {
        setError('이메일 또는 비밀번호가 올바르지 않습니다.');
        setIsLoading(false);
        return;
      }

      if (!authData?.user) {
        setError('로그인에 실패했습니다.');
        setIsLoading(false);
        return;
      }

      // 관리자 권한 확인
      const { data: adminData, error: adminError } = await supabase
        .from('admins')
        .select('id, email, auth_user_id')
        .eq('auth_user_id', authData.user.id)
        .single();

      if (adminError || !adminData) {
        // 관리자가 아니면 로그아웃
        await supabase.auth.signOut();
        setError('관리자 권한이 없습니다.');
        setIsLoading(false);
        return;
      }

      // 마지막 로그인 시간 업데이트
      await supabase
        .from('admins')
        .update({ last_login_at: new Date().toISOString() })
        .eq('id', adminData.id);

      // 로딩 상태 해제
      setIsLoading(false);

      // 대시보드로 이동
      router.push('/admin/dashboard');
      router.refresh();
    } catch (err) {
      setError('로그인 중 오류가 발생했습니다.');
      // Login error
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 이메일 입력 */}
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-semibold text-white/90">
          관리자 이메일
        </label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-white/40 group-focus-within:text-[#D4B98B] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full pl-12 pr-4 py-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl 
                     text-white placeholder-white/40 text-lg font-medium
                     focus:outline-none focus:ring-2 focus:ring-[#D4B98B]/50 focus:border-[#D4B98B]/50
                     hover:border-white/20 hover:bg-white/10
                     disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-white/10 disabled:hover:bg-white/5
                     transition-all duration-300"
            placeholder="관리자 이메일을 입력하세요"
            required
            disabled={isLoading}
            autoComplete="email"
          />
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#D4B98B]/5 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none"></div>
        </div>
      </div>

      {/* 비밀번호 입력 */}
      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-semibold text-white/90">
          비밀번호
        </label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-white/40 group-focus-within:text-[#D4B98B] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block w-full pl-12 pr-16 py-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl 
                     text-white placeholder-white/40 text-lg font-medium
                     focus:outline-none focus:ring-2 focus:ring-[#D4B98B]/50 focus:border-[#D4B98B]/50
                     hover:border-white/20 hover:bg-white/10
                     disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-white/10 disabled:hover:bg-white/5
                     transition-all duration-300"
            placeholder="비밀번호를 입력하세요"
            required
            disabled={isLoading}
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/40 hover:text-[#D4B98B] transition-colors focus:outline-none disabled:cursor-not-allowed"
            disabled={isLoading}
            aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
          >
            {showPassword ? (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#D4B98B]/5 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none"></div>
        </div>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="relative">
          <div className="absolute inset-0 bg-red-500/10 backdrop-blur-sm rounded-xl"></div>
          <div className="relative p-4 border border-red-400/30 rounded-xl bg-red-500/5">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-red-300 text-sm font-medium">
                {error}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 로그인 버튼 */}
      <button
        type="submit"
        disabled={isLoading}
        className="group relative w-full bg-gradient-to-r from-[#D4B98B] to-[#C9A96E] hover:from-[#C9A96E] hover:to-[#D4B98B]
                 text-[#1C2A44] font-bold py-4 px-6 rounded-xl text-lg
                 focus:outline-none focus:ring-4 focus:ring-[#D4B98B]/30
                 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200
                 shadow-lg shadow-[#D4B98B]/20 hover:shadow-xl hover:shadow-[#D4B98B]/30
                 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div className="relative flex items-center justify-center">
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-[#1C2A44]" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              로그인 중...
            </>
          ) : (
            <>
              관리자 로그인
              <svg className="ml-2 -mr-1 h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </>
          )}
        </div>
      </button>

      {/* 접근성 안내 */}
      <div className="mt-6 text-center">
        <p className="text-xs text-white/60">
          키보드로 탭(Tab)을 눌러 필드 간 이동이 가능합니다
        </p>
      </div>
    </form>
  );
}