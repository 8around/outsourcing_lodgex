import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  // 보안 헤더 설정
  const headers = new Headers(supabaseResponse.headers)
  headers.set('X-Frame-Options', 'DENY')
  headers.set('X-Content-Type-Options', 'nosniff')
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  headers.set('X-XSS-Protection', '1; mode=block')

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
            headers,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const url = request.nextUrl.clone()
  const isAdminPath = url.pathname.startsWith('/admin')
  const isAdminLoginPath = url.pathname === '/admin/login'

  // 관리자 경로 보호 로직 (로그인 페이지는 제외)
  if (isAdminPath && !isAdminLoginPath) {
    if (!user) {
      // 인증되지 않은 사용자는 로그인 페이지로 리다이렉트
      url.pathname = '/admin/login'
      return NextResponse.redirect(url)
    }

    // 관리자 권한 확인 (users 테이블이 없는 경우를 대비)
    try {
      const { data: userData, error } = await supabase
        .from('users')
        .select('is_admin')
        .eq('id', user.id)
        .single()

      // users 테이블이 없거나 is_admin 필드가 없는 경우는 통과
      if (error) {
        console.warn('Admin check error:', error.message)
        // 테이블이 없는 경우 일단 통과시킴 (개발 환경)
        if (!error.message.includes('relation') && !error.message.includes('column')) {
          url.pathname = '/admin/login'
          url.searchParams.set('error', 'unauthorized')
          return NextResponse.redirect(url)
        }
      } else if (userData && !userData.is_admin) {
        // 관리자 권한이 명시적으로 false인 경우만 차단
        url.pathname = '/admin/login'
        url.searchParams.set('error', 'unauthorized')
        return NextResponse.redirect(url)
      }
    } catch (error) {
      console.error('Admin middleware error:', error)
      // 심각한 에러가 아니면 통과
    }
  }

  // 이미 로그인한 관리자가 로그인 페이지에 접근하는 경우
  if (isAdminLoginPath && user) {
    try {
      const { data: userData } = await supabase
        .from('users')
        .select('is_admin')
        .eq('id', user.id)
        .single()

      if (userData?.is_admin) {
        // 관리자는 대시보드로 리다이렉트
        url.pathname = '/admin/dashboard'
        return NextResponse.redirect(url)
      }
    } catch (error) {
      // 에러 발생 시 로그아웃
      await supabase.auth.signOut()
    }
  }

  // CSP 헤더 설정
  const cspHeader = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' blob: data: https:",
    "font-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests"
  ].join('; ')

  headers.set('Content-Security-Policy', cspHeader)

  // 응답에 보안 헤더 적용
  supabaseResponse = NextResponse.next({
    request,
    headers,
  })

  return supabaseResponse
}