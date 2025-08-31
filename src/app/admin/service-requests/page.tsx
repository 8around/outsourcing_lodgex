'use client'

import React, { useState, useEffect } from 'react'
import { Plus, Search, Edit2, Trash2, Eye, Filter, Tag, Calendar, User, BarChart3, FolderOpen, Upload, X, Phone, Mail, Building, CheckCircle2 } from 'lucide-react'

interface ServiceRequest {
  id: string
  company_name: string
  company_type: string
  contact_person: string
  position?: string
  phone: string
  email: string
  service_type: string
  consulting_areas: string[]
  current_challenges?: string
  desired_outcomes?: string
  message?: string
  status: 'pending' | 'contacted' | 'in_progress' | 'completed'
  created_at: string
  updated_at: string
  admin_notes?: string
  processed_by?: string
  processed_at?: string
}

export default function ServiceRequestsPage() {
  const [requests, setRequests] = useState<ServiceRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [searchInput, setSearchInput] = useState('') // 검색 입력 필드용
  const [searchTerm, setSearchTerm] = useState('') // 실제 검색에 사용되는 값
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [serviceTypeFilter, setServiceTypeFilter] = useState<string>('')
  const [sortField, setSortField] = useState('created_at')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(20)
  const [modalTempStatus, setModalTempStatus] = useState<ServiceRequest['status'] | null>(null) // 모달용 임시 상태
  const [modalSaving, setModalSaving] = useState(false) // 모달 저장 중 상태

  // Fetch service requests from Supabase
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const { createClient } = await import('@/lib/supabase/client')
        const supabase = createClient()
        
        const { data, error } = await supabase
          .from('service_requests')
          .select('*')
          .order('created_at', { ascending: false })
        
        if (error) {
          throw error
        }
        
        setRequests(data || [])
      } catch (error) {
        console.error('Failed to fetch service requests:', error)
        setError('데이터를 불러오는데 실패했습니다.')
      } finally {
        setLoading(false)
      }
    }
    
    fetchRequests()
  }, [])


  const handleViewRequest = (request: ServiceRequest) => {
    setSelectedRequest(request)
    setIsViewModalOpen(true)
    setModalTempStatus(null) // 모달 열 때 임시 상태 초기화
  }

  // 모달에서 상태 저장
  const handleSaveModalStatus = async () => {
    if (!selectedRequest || !modalTempStatus) return

    setModalSaving(true)
    
    try {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()
      
      const { error } = await supabase
        .from('service_requests')
        .update({ 
          status: modalTempStatus, 
          updated_at: new Date().toISOString(),
          processed_at: modalTempStatus === 'completed' ? new Date().toISOString() : null
        })
        .eq('id', selectedRequest.id)
      
      if (error) {
        throw error
      }
      
      setRequests(prev => 
        prev.map(request => 
          request.id === selectedRequest.id 
            ? { ...request, status: modalTempStatus, updated_at: new Date().toISOString() }
            : request
        )
      )
      
      setSelectedRequest({ ...selectedRequest, status: modalTempStatus })
      setModalTempStatus(null)
    } catch (error) {
      console.error('Failed to update status:', error)
      setError('상태 변경에 실패했습니다.')
    } finally {
      setModalSaving(false)
    }
  }

  // 검색 실행 함수
  const handleSearch = () => {
    setSearchTerm(searchInput)
    setCurrentPage(1) // 검색 시 첫 페이지로 이동
  }

  // 검색 입력 필드에서 엔터 키 처리
  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  // Filter and sort data
  const filteredAndSortedRequests = requests
    .filter(request => {
      const matchesSearch = 
        request.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.contact_person?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.email?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = !statusFilter || request.status === statusFilter
      const matchesServiceType = !serviceTypeFilter || request.service_type === serviceTypeFilter
      
      return matchesSearch && matchesStatus && matchesServiceType
    })
    .sort((a, b) => {
      const aValue = a[sortField as keyof ServiceRequest]
      const bValue = b[sortField as keyof ServiceRequest]
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

  // Pagination
  const totalItems = filteredAndSortedRequests.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedRequests = filteredAndSortedRequests.slice(startIndex, endIndex)


  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-red-800">{error}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">서비스 신청 관리</h1>
          <p className="text-sm text-gray-600 mt-1">호텔 서비스 신청 현황을 관리합니다</p>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">신규 신청</p>
              <p className="text-2xl font-bold text-gray-900">{requests.filter(r => r.status === 'pending').length}</p>
            </div>
            <Plus className="w-8 h-8 text-blue-400" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">처리중</p>
              <p className="text-2xl font-bold text-yellow-600">{requests.filter(r => ['contacted', 'in_progress'].includes(r.status)).length}</p>
            </div>
            <Phone className="w-8 h-8 text-yellow-400" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">진행중</p>
              <p className="text-2xl font-bold text-green-600">{requests.filter(r => r.status === 'in_progress').length}</p>
            </div>
            <Building className="w-8 h-8 text-green-400" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">완료</p>
              <p className="text-2xl font-bold text-blue-600">{requests.filter(r => r.status === 'completed').length}</p>
            </div>
            <CheckCircle2 className="w-8 h-8 text-blue-400" />
          </div>
        </div>
      </div>

      {/* 필터 및 검색 */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="호텔명, 담당자, 이메일 검색..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyPress={handleSearchKeyPress}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={handleSearch}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Search className="w-4 h-4" />
                검색
              </button>
            </div>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value)
              setCurrentPage(1) // 필터 변경 시 첫 페이지로
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">모든 상태</option>
            <option value="pending">대기중</option>
            <option value="contacted">연락완료</option>
            <option value="in_progress">진행중</option>
            <option value="completed">완료</option>
          </select>
          <select
            value={serviceTypeFilter}
            onChange={(e) => {
              setServiceTypeFilter(e.target.value)
              setCurrentPage(1) // 필터 변경 시 첫 페이지로
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">모든 서비스</option>
            <option value="consulting">컨설팅</option>
            <option value="training">교육</option>
            <option value="system">시스템</option>
            <option value="marketing">마케팅</option>
          </select>
        </div>
      </div>

      {/* 서비스 신청 목록 테이블 */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                기업명
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                담당자
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                연락처
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                컨설팅 분야
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                요청사항
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                처리상태
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                접수일
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                작업
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                  로딩 중...
                </td>
              </tr>
            ) : paginatedRequests.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                  서비스 신청이 없습니다.
                </td>
              </tr>
            ) : (
              paginatedRequests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{request.company_name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{request.contact_person}</div>
                    {request.position && (
                      <div className="text-xs text-gray-500">{request.position}</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div className="text-gray-900">{request.phone}</div>
                      <div className="text-gray-500 text-xs">{request.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs">
                      {request.consulting_areas?.join(', ') || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500 truncate max-w-xs" title={request.message}>
                      {request.message || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      request.status === 'pending' 
                        ? 'bg-blue-100 text-blue-800'
                        : request.status === 'contacted'
                        ? 'bg-yellow-100 text-yellow-800'
                        : request.status === 'in_progress'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {request.status === 'pending' ? '대기중' : 
                       request.status === 'contacted' ? '연락완료' : 
                       request.status === 'in_progress' ? '진행중' : '완료'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(request.created_at).toLocaleDateString('ko-KR')}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <button
                      onClick={() => handleViewRequest(request)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                이전
              </button>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                다음
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  전체 <span className="font-medium">{totalItems}</span>개 중{' '}
                  <span className="font-medium">{totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</span> -{' '}
                  <span className="font-medium">{Math.min(currentPage * itemsPerPage, totalItems)}</span> 표시
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    이전
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === i + 1
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    다음
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 상세보기 모달 */}
      {isViewModalOpen && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
              <h2 className="text-xl font-bold text-gray-900">
                서비스 신청 상세
              </h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">기본 정보</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        기업명
                      </label>
                      <p className="text-gray-900">{selectedRequest.company_name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        담당자
                      </label>
                      <p className="text-gray-900">{selectedRequest.contact_person}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        연락처
                      </label>
                      <p className="text-gray-900">{selectedRequest.phone}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        이메일
                      </label>
                      <p className="text-gray-900">{selectedRequest.email}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">서비스 정보</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        서비스 유형
                      </label>
                      <p className="text-gray-900">
                        {selectedRequest.service_type === 'consulting' ? '컨설팅' :
                         selectedRequest.service_type === 'training' ? '교육' :
                         selectedRequest.service_type === 'system' ? '시스템' :
                         selectedRequest.service_type === 'marketing' ? '마케팅' : '컨설팅'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        처리상태
                      </label>
                      <select
                        value={modalTempStatus || selectedRequest.status}
                        onChange={(e) => setModalTempStatus(e.target.value as ServiceRequest['status'])}
                        className={`px-3 py-1.5 text-sm font-medium rounded border ${
                          modalTempStatus && modalTempStatus !== selectedRequest.status
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-300'
                        } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      >
                        <option value="pending">대기중</option>
                        <option value="contacted">연락완료</option>
                        <option value="in_progress">진행중</option>
                        <option value="completed">완료</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        신청일
                      </label>
                      <p className="text-gray-900">
                        {new Date(selectedRequest.created_at).toLocaleString('ko-KR')}
                      </p>
                    </div>
                    {selectedRequest.consulting_areas && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          컨설팅 분야
                        </label>
                        <p className="text-gray-900">
                          {selectedRequest.consulting_areas.join(', ')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {selectedRequest.current_challenges && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    현재 상황 (위치)
                  </label>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-900 whitespace-pre-wrap">
                      {selectedRequest.current_challenges}
                    </p>
                  </div>
                </div>
              )}
              
              {selectedRequest.desired_outcomes && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    희망 결과 (규모)
                  </label>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-900 whitespace-pre-wrap">
                      {selectedRequest.desired_outcomes}
                    </p>
                  </div>
                </div>
              )}
              
              {selectedRequest.message && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    추가 요청사항
                  </label>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-900 whitespace-pre-wrap">
                      {selectedRequest.message}
                    </p>
                  </div>
                </div>
              )}

              {selectedRequest.admin_notes && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    관리자 메모
                  </label>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-blue-900 whitespace-pre-wrap">
                      {selectedRequest.admin_notes}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  닫기
                </button>
                {modalTempStatus && modalTempStatus !== selectedRequest.status && (
                  <button
                    onClick={handleSaveModalStatus}
                    disabled={modalSaving}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {modalSaving ? '저장중...' : '상태 저장'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}