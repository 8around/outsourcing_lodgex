'use client'

import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

interface AdminPaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  onPageChange: (page: number) => void
  showSizeChanger?: boolean
  pageSizeOptions?: number[]
  onPageSizeChange?: (size: number) => void
  className?: string
}

export default function AdminPagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  showSizeChanger = true,
  pageSizeOptions = [10, 20, 50, 100],
  onPageSizeChange,
  className = ""
}: AdminPaginationProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  const getVisiblePages = () => {
    const visiblePages: (number | string)[] = []
    
    if (totalPages <= 7) {
      // 7페이지 이하면 모든 페이지 표시
      for (let i = 1; i <= totalPages; i++) {
        visiblePages.push(i)
      }
    } else {
      // 더 많은 페이지가 있을 때
      if (currentPage <= 3) {
        // 처음 부분에 있을 때
        for (let i = 1; i <= 4; i++) {
          visiblePages.push(i)
        }
        visiblePages.push('...')
        visiblePages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        // 끝 부분에 있을 때
        visiblePages.push(1)
        visiblePages.push('...')
        for (let i = totalPages - 3; i <= totalPages; i++) {
          visiblePages.push(i)
        }
      } else {
        // 중간 부분에 있을 때
        visiblePages.push(1)
        visiblePages.push('...')
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          visiblePages.push(i)
        }
        visiblePages.push('...')
        visiblePages.push(totalPages)
      }
    }
    
    return visiblePages
  }

  const visiblePages = getVisiblePages()

  if (totalPages <= 1) {
    return null
  }

  return (
    <div className={`flex items-center justify-between ${className}`}>
      {/* 정보 표시 */}
      <div className="flex items-center space-x-6">
        <p className="text-sm text-gray-400">
          <span className="font-medium text-white">{startItem}</span>
          -
          <span className="font-medium text-white">{endItem}</span>
          개, 총 
          <span className="font-medium text-white">{totalItems}</span>
          개
        </p>

        {/* 페이지 크기 선택 */}
        {showSizeChanger && onPageSizeChange && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-400">페이지당:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="px-3 py-1 text-sm bg-[#0f0f23] text-white border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-[#D4B98B] focus:border-transparent"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}개
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* 페이지네이션 컨트롤 */}
      <div className="flex items-center space-x-2">
        {/* 이전 페이지 버튼 */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-300 bg-[#0f0f23] border border-gray-700 rounded-l-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-[#D4B98B] focus:z-10 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#0f0f23]"
        >
          <ChevronLeftIcon className="w-5 h-5" />
        </button>

        {/* 페이지 번호들 */}
        <div className="flex">
          {visiblePages.map((page, index) => (
            <span key={index}>
              {page === '...' ? (
                <span className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500 bg-[#0f0f23] border border-gray-700">
                  ...
                </span>
              ) : (
                <button
                  onClick={() => onPageChange(page as number)}
                  className={`
                    relative inline-flex items-center px-4 py-2 text-sm font-medium border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#D4B98B] focus:z-10
                    ${currentPage === page
                      ? 'z-10 bg-[#D4B98B] text-black border-[#D4B98B]'
                      : 'text-gray-300 bg-[#0f0f23] hover:bg-gray-800'
                    }
                  `}
                >
                  {page}
                </button>
              )}
            </span>
          ))}
        </div>

        {/* 다음 페이지 버튼 */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-300 bg-[#0f0f23] border border-gray-700 rounded-r-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-[#D4B98B] focus:z-10 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#0f0f23]"
        >
          <ChevronRightIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}