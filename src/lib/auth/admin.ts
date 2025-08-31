import { createClient } from '@/lib/supabase/client'
import { createClient as createServerClient } from '@/lib/supabase/server'

// 서버 사이드 Supabase 클라이언트 생성
export async function getServerSupabaseClient() {
  return createServerClient()
}

// 클라이언트 사이드 인증 함수들
export const adminAuth = {
  // 로그인
  async signIn(email: string, password: string) {
    const supabase = createClient()
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      throw new Error(error.message)
    }

    // 관리자 권한 확인
    if (data?.user) {
      const { data: adminData, error: adminError } = await supabase
        .from('admins')
        .select('id')
        .eq('id', data.user.id)
        .single()

      if (adminError || !adminData) {
        // 관리자가 아니면 로그아웃
        await supabase.auth.signOut()
        throw new Error('관리자 권한이 없습니다.')
      }
    }

    return data
  },

  // 로그아웃
  async signOut() {
    const supabase = createClient()
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      throw new Error(error.message)
    }

    return { success: true }
  },

  // 현재 세션 확인
  async getSession() {
    const supabase = createClient()
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      throw new Error(error.message)
    }

    return session
  },

  // 현재 사용자 정보 가져오기
  async getCurrentUser() {
    const supabase = createClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) {
      throw new Error(error.message)
    }

    return user
  },

  // 관리자 권한 확인
  async isAdmin() {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) return false

      const { data: adminData, error } = await supabase
        .from('admins')
        .select('id')
        .eq('id', user.id)
        .single()

      if (error || !adminData) return false

      return true
    } catch {
      return false
    }
  },

  // 인증 상태 변경 리스너
  onAuthStateChange(callback: (event: string, session: any) => void) {
    const supabase = createClient()
    return supabase.auth.onAuthStateChange(callback)
  }
}

