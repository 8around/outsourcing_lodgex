import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database.types'

// 서버 사이드 인증 함수들
export async function createServerSupabaseClient() {
  const cookieStore = cookies()
  
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // 서버 컴포넌트에서 쿠키를 설정할 수 없는 경우 무시
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // 서버 컴포넌트에서 쿠키를 삭제할 수 없는 경우 무시
          }
        },
      },
    }
  )
}

// 서버에서 현재 사용자 확인
export async function getServerUser() {
  const supabase = await createServerSupabaseClient()
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      return null
    }

    return user
  } catch {
    return null
  }
}

// 서버에서 관리자 권한 확인
export async function isServerAdmin() {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return false

    // admins 테이블에서 확인 (관리자만 있으므로 존재 여부만 체크)
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
}

// 세션 체크 (서버)
export async function getServerSession() {
  const supabase = await createServerSupabaseClient()
  
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      return null
    }

    return session
  } catch {
    return null
  }
}

// 관리자 정보 가져오기 (서버)
export async function getServerAdminInfo() {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return null

    // admins 테이블에서 관리자 정보 가져오기
    const { data: adminData, error } = await supabase
      .from('admins')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error || !adminData) return null

    return {
      ...adminData,
      auth_user: user
    }
  } catch {
    return null
  }
}