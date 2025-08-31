'use client'

import { useState } from 'react'
import { MagnifyingGlassIcon, FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline'

interface FilterOption {
  key: string
  label: string
  options: { value: string; label: string }[]
}

interface SearchAndFilterProps {
  searchPlaceholder?: string
  searchValue?: string
  onSearchChange?: (value: string) => void
  filters?: FilterOption[]
  onFilterChange?: (filterKey: string, value: string) => void
  activeFilters?: Record<string, string>
  onClearFilters?: () => void
  className?: string
}

export default function SearchAndFilter({
  searchPlaceholder = "검색...",
  searchValue = "",
  onSearchChange,
  filters = [],
  onFilterChange,
  activeFilters = {},
  onClearFilters,
  className = ""
}: SearchAndFilterProps) {
  const [showFilters, setShowFilters] = useState(false)

  const activeFilterCount = Object.values(activeFilters).filter(Boolean).length

  const handleFilterChange = (filterKey: string, value: string) => {
    if (onFilterChange) {
      onFilterChange(filterKey, value)
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* 검색 바 */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-lg bg-[#0f0f23] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4B98B] focus:border-transparent"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange?.(e.target.value)}
          />
        </div>
        
        {/* 필터 토글 버튼 */}
        {filters.length > 0 && (
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`
              inline-flex items-center px-4 py-2 border border-gray-700 rounded-lg text-sm font-medium transition-colors
              ${showFilters 
                ? 'bg-[#D4B98B] text-black border-[#D4B98B]' 
                : 'bg-[#0f0f23] text-gray-300 hover:bg-gray-800'
              }
            `}
          >
            <FunnelIcon className="w-4 h-4 mr-2" />
            필터
            {activeFilterCount > 0 && (
              <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                {activeFilterCount}
              </span>
            )}
          </button>
        )}
      </div>

      {/* 필터 섹션 */}
      {showFilters && filters.length > 0 && (
        <div className="bg-[#0f0f23] border border-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-white">필터 옵션</h3>
            {activeFilterCount > 0 && (
              <button
                onClick={onClearFilters}
                className="text-sm text-red-400 hover:text-red-300 transition-colors flex items-center"
              >
                <XMarkIcon className="w-4 h-4 mr-1" />
                모든 필터 초기화
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filters.map((filter) => (
              <div key={filter.key}>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {filter.label}
                </label>
                <select
                  value={activeFilters[filter.key] || ''}
                  onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-700 rounded-lg bg-[#0f0f23] text-white focus:outline-none focus:ring-2 focus:ring-[#D4B98B] focus:border-transparent"
                >
                  <option value="">전체</option>
                  {filter.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 활성 필터 태그 */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-400">활성 필터:</span>
          {Object.entries(activeFilters).map(([key, value]) => {
            if (!value) return null
            
            const filter = filters.find(f => f.key === key)
            const option = filter?.options.find(o => o.value === value)
            
            return (
              <span
                key={key}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#D4B98B]/20 text-[#D4B98B] border border-[#D4B98B]/30"
              >
                {filter?.label}: {option?.label || value}
                <button
                  onClick={() => handleFilterChange(key, '')}
                  className="ml-2 inline-flex items-center justify-center w-4 h-4 text-[#D4B98B] hover:text-white"
                >
                  <XMarkIcon className="w-3 h-3" />
                </button>
              </span>
            )
          })}
        </div>
      )}
    </div>
  )
}