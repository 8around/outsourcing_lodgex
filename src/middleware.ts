import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // pathname을 헤더로 전달
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-pathname', pathname)
  
  // /admin 경로로 정확히 들어온 경우 /admin/dashboard로 리다이렉트
  if (pathname === '/admin' || pathname === '/admin/') {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url))
  }
  
  // 인증 체크 (로그인 페이지는 제외)
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    // Supabase 클라이언트 생성
    let response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            request.cookies.set({ name, value, ...options })
            response = NextResponse.next({
              request: {
                headers: requestHeaders,
              },
            })
            response.cookies.set({ name, value, ...options })
          },
          remove(name: string, options: any) {
            request.cookies.set({ name, value: '', ...options })
            response = NextResponse.next({
              request: {
                headers: requestHeaders,
              },
            })
            response.cookies.set({ name, value: '', ...options })
          },
        },
      }
    )

    // 세션 체크
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      // 로그인되지 않은 경우 로그인 페이지로 리다이렉트
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    // 관리자 권한 체크
    const { data: adminData } = await supabase
      .from('admins')
      .select('id')
      .eq('auth_user_id', session.user.id)
      .single()

    if (!adminData) {
      // 관리자가 아닌 경우 로그인 페이지로 리다이렉트
      await supabase.auth.signOut()
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    return response
  }
  
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

export const config = {
  matcher: ['/admin/:path*'],
}