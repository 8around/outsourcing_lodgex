import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function AdminDashboard() {
  // 통계 데이터 가져오기
  const supabase = await createClient()

  const [
    { count: insightsCount },
    { count: eventsCount }, 
    /* { count: testimonialsCount }, */
    { count: serviceRequestsCount }
  ] = await Promise.all([
    supabase
      .from('posts')
      .select('*', { count: 'exact', head: true })
      .eq('post_type', 'insights')
      .eq('is_published', true),
    supabase
      .from('posts')
      .select('*', { count: 'exact', head: true })
      .eq('post_type', 'events')
      .eq('is_published', true),
    /* supabase
      .from('posts')
      .select('*', { count: 'exact', head: true })
      .eq('post_type', 'testimonials')
      .eq('is_published', true), */
    supabase
      .from('service_requests')
      .select('*', { count: 'exact', head: true })
  ])

  // 최근 서비스 신청 데이터
  const { data: recentRequests } = await supabase
    .from('service_requests')
    .select('id, company_name, service_type, status, created_at')
    .order('created_at', { ascending: false })
    .limit(5)

  const stats = [
    {
      name: '인사이트',
      value: insightsCount || 0,
      href: '/admin/insights',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: 'bg-blue-500',
    },
    {
      name: '이벤트',
      value: eventsCount || 0,
      href: '/admin/events',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      color: 'bg-green-500',
    },
    /* {
      name: '고객 후기',
      value: testimonialsCount || 0,
      href: '/admin/testimonials',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
        </svg>
      ),
      color: 'bg-purple-500',
    }, */
    {
      name: '서비스 신청',
      value: serviceRequestsCount || 0,
      href: '/admin/service-requests',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
      color: 'bg-orange-500',
    },
  ]

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: '대기중', color: 'bg-yellow-100 text-yellow-800' },
      contacted: { label: '연락완료', color: 'bg-blue-100 text-blue-800' },
      in_progress: { label: '진행중', color: 'bg-purple-100 text-purple-800' },
      completed: { label: '완료', color: 'bg-green-100 text-green-800' },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending

    return (
      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
        {config.label}
      </span>
    )
  }

  return (
    <div className="space-y-8">
      {/* 환영 메시지 */}
      <div className="bg-gradient-to-r from-[#1C2A44] to-[#2563eb] rounded-lg p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">관리자 대시보드에 오신 것을 환영합니다!</h1>
        <p className="text-xl opacity-90">
          SoUHGM 숙박업 컨설팅 서비스를 효율적으로 관리하세요.
        </p>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Link
            key={stat.name}
            href={stat.href}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.name}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg text-white group-hover:scale-110 transition-transform`}>
                {stat.icon}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* 최근 활동 및 빠른 액션 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 최근 서비스 신청 */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">최근 서비스 신청</h3>
              <Link
                href="/admin/service-requests"
                className="text-sm text-[#1C2A44] hover:text-[#2563eb] font-medium"
              >
                전체 보기
              </Link>
            </div>
          </div>
          <div className="p-6">
            {recentRequests && recentRequests.length > 0 ? (
              <div className="space-y-4">
                {recentRequests.map((request: any) => (
                  <div key={request.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{request.company_name}</p>
                      <p className="text-sm text-gray-600">{request.service_type}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(request.created_at).toLocaleDateString('ko-KR')}
                      </p>
                    </div>
                    <div>
                      {getStatusBadge(request.status)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">최근 서비스 신청이 없습니다.</p>
            )}
          </div>
        </div>

        {/* 빠른 액션 */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">빠른 액션</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 gap-3">
              <Link
                href="/admin/insights/new"
                className="flex items-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors group"
              >
                <div className="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="font-medium text-gray-900">새 인사이트 작성</p>
                  <p className="text-sm text-gray-600">전문 지식을 공유하세요</p>
                </div>
              </Link>

              <Link
                href="/admin/events/new"
                className="flex items-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors group"
              >
                <div className="flex-shrink-0 w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="font-medium text-gray-900">새 이벤트 등록</p>
                  <p className="text-sm text-gray-600">교육 프로그램을 추가하세요</p>
                </div>
              </Link>

             {/*  <Link
                href="/admin/testimonials/new"
                className="flex items-center p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors group"
              >
                <div className="flex-shrink-0 w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="font-medium text-gray-900">새 고객 후기 추가</p>
                  <p className="text-sm text-gray-600">성공 사례를 소개하세요</p>
                </div>
              </Link> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}