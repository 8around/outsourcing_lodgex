'use client'

import { ReactNode } from 'react'

interface AdminCardProps {
  children: ReactNode
  title?: string
  subtitle?: string
  className?: string
  padding?: 'none' | 'sm' | 'md' | 'lg'
  actions?: ReactNode
}

export default function AdminCard({
  children,
  title,
  subtitle,
  className = '',
  padding = 'md',
  actions
}: AdminCardProps) {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  }

  return (
    <div className={`bg-[#0f0f23] border border-gray-800 rounded-lg shadow-sm ${className}`}>
      {(title || actions) && (
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <div>
            {title && (
              <h3 className="text-lg font-semibold text-white">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-sm text-gray-400 mt-1">
                {subtitle}
              </p>
            )}
          </div>
          {actions && (
            <div className="flex items-center space-x-3">
              {actions}
            </div>
          )}
        </div>
      )}
      <div className={paddingClasses[padding]}>
        {children}
      </div>
    </div>
  )
}