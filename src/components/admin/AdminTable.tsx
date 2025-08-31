'use client'

import { useState } from 'react'
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline'

interface Column {
  key: string
  label: string
  sortable?: boolean
  width?: string
  render?: (value: any, row: any) => React.ReactNode
}

interface AdminTableProps {
  columns: Column[]
  data: any[]
  loading?: boolean
  onSort?: (key: string, direction: 'asc' | 'desc') => void
  sortKey?: string
  sortDirection?: 'asc' | 'desc'
  emptyMessage?: string
}

export default function AdminTable({
  columns,
  data,
  loading = false,
  onSort,
  sortKey,
  sortDirection,
  emptyMessage = "데이터가 없습니다."
}: AdminTableProps) {
  const [internalSortKey, setInternalSortKey] = useState<string>('')
  const [internalSortDirection, setInternalSortDirection] = useState<'asc' | 'desc'>('asc')

  const currentSortKey = sortKey || internalSortKey
  const currentSortDirection = sortDirection || internalSortDirection

  const handleSort = (key: string) => {
    const newDirection = 
      currentSortKey === key && currentSortDirection === 'asc' ? 'desc' : 'asc'
    
    if (onSort) {
      onSort(key, newDirection)
    } else {
      setInternalSortKey(key)
      setInternalSortDirection(newDirection)
    }
  }

  const sortedData = !onSort && data ? [...data].sort((a, b) => {
    if (!currentSortKey) return 0
    
    const aVal = a[currentSortKey]
    const bVal = b[currentSortKey]
    
    if (aVal === null || aVal === undefined) return 1
    if (bVal === null || bVal === undefined) return -1
    
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return currentSortDirection === 'asc' 
        ? aVal.localeCompare(bVal) 
        : bVal.localeCompare(aVal)
    }
    
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return currentSortDirection === 'asc' ? aVal - bVal : bVal - aVal
    }
    
    return currentSortDirection === 'asc' 
      ? String(aVal).localeCompare(String(bVal))
      : String(bVal).localeCompare(String(aVal))
  }) : data

  if (loading) {
    return (
      <div className="bg-[#0f0f23] border border-gray-800 rounded-lg overflow-hidden">
        <div className="animate-pulse">
          {/* Header skeleton */}
          <div className="bg-gray-800/50 p-4 border-b border-gray-700">
            <div className="grid grid-cols-6 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-4 bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
          
          {/* Rows skeleton */}
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="p-4 border-b border-gray-800/50">
              <div className="grid grid-cols-6 gap-4">
                {Array.from({ length: 6 }).map((_, j) => (
                  <div key={j} className="h-4 bg-gray-800/50 rounded"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#0f0f23] border border-gray-800 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-800/50 border-b border-gray-700">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider ${
                    column.width || ''
                  }`}
                >
                  {column.sortable ? (
                    <button
                      onClick={() => handleSort(column.key)}
                      className="flex items-center space-x-1 hover:text-white transition-colors group"
                    >
                      <span>{column.label}</span>
                      <div className="flex flex-col">
                        <ChevronUpIcon 
                          className={`w-3 h-3 ${
                            currentSortKey === column.key && currentSortDirection === 'asc'
                              ? 'text-[#D4B98B]'
                              : 'text-gray-500 group-hover:text-gray-300'
                          }`}
                        />
                        <ChevronDownIcon 
                          className={`w-3 h-3 -mt-1 ${
                            currentSortKey === column.key && currentSortDirection === 'desc'
                              ? 'text-[#D4B98B]'
                              : 'text-gray-500 group-hover:text-gray-300'
                          }`}
                        />
                      </div>
                    </button>
                  ) : (
                    <span>{column.label}</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/50">
            {sortedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center">
                  <div className="text-gray-500">
                    <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-lg font-medium text-gray-400">{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              sortedData.map((row, index) => (
                <tr key={index} className="hover:bg-gray-800/30 transition-colors">
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={`px-6 py-4 whitespace-nowrap text-sm text-gray-300 ${
                        column.width || ''
                      }`}
                    >
                      {column.render 
                        ? column.render(row[column.key], row)
                        : row[column.key] || '-'
                      }
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}