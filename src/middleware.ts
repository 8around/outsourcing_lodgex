import { type NextRequest, NextResponse } from 'next/server'

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
    const adminSession = request.cookies.get('adminSession')
    
    if (!adminSession) {
      // 로그인되지 않은 경우 로그인 페이지로 리다이렉트
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
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