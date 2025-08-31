'use client'

interface StatusBadgeProps {
  status: string
  variant?: 'default' | 'post' | 'event' | 'testimonial' | 'service-request'
  size?: 'sm' | 'md'
  onClick?: () => void
}

export default function StatusBadge({ 
  status, 
  variant = 'default',
  size = 'sm',
  onClick
}: StatusBadgeProps) {
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm'
  }

  const getStatusConfig = () => {
    switch (variant) {
      case 'post':
        switch (status) {
          case 'published':
            return { 
              bg: 'bg-green-900/50 border-green-700', 
              text: 'text-green-300',
              label: '게시됨' 
            }
          case 'draft':
            return { 
              bg: 'bg-yellow-900/50 border-yellow-700', 
              text: 'text-yellow-300',
              label: '임시저장' 
            }
          default:
            return { 
              bg: 'bg-gray-700/50 border-gray-600', 
              text: 'text-gray-300',
              label: status 
            }
        }
      
      case 'event':
        switch (status) {
          case 'upcoming':
            return { 
              bg: 'bg-blue-900/50 border-blue-700', 
              text: 'text-blue-300',
              label: '예정' 
            }
          case 'ongoing':
            return { 
              bg: 'bg-green-900/50 border-green-700', 
              text: 'text-green-300',
              label: '진행중' 
            }
          case 'completed':
            return { 
              bg: 'bg-gray-700/50 border-gray-600', 
              text: 'text-gray-300',
              label: '완료' 
            }
          case 'cancelled':
            return { 
              bg: 'bg-red-900/50 border-red-700', 
              text: 'text-red-300',
              label: '취소' 
            }
          default:
            return { 
              bg: 'bg-gray-700/50 border-gray-600', 
              text: 'text-gray-300',
              label: status 
            }
        }
      
      case 'testimonial':
        switch (status) {
          case 'approved':
            return { 
              bg: 'bg-green-900/50 border-green-700', 
              text: 'text-green-300',
              label: '승인됨' 
            }
          case 'pending':
            return { 
              bg: 'bg-yellow-900/50 border-yellow-700', 
              text: 'text-yellow-300',
              label: '검토중' 
            }
          case 'rejected':
            return { 
              bg: 'bg-red-900/50 border-red-700', 
              text: 'text-red-300',
              label: '거부됨' 
            }
          default:
            return { 
              bg: 'bg-gray-700/50 border-gray-600', 
              text: 'text-gray-300',
              label: status 
            }
        }
      
      case 'service-request':
        switch (status) {
          case 'new':
            return { 
              bg: 'bg-blue-900/50 border-blue-700', 
              text: 'text-blue-300',
              label: '신규' 
            }
          case 'reviewing':
            return { 
              bg: 'bg-yellow-900/50 border-yellow-700', 
              text: 'text-yellow-300',
              label: '검토중' 
            }
          case 'quoted':
            return { 
              bg: 'bg-purple-900/50 border-purple-700', 
              text: 'text-purple-300',
              label: '견적발송' 
            }
          case 'accepted':
            return { 
              bg: 'bg-green-900/50 border-green-700', 
              text: 'text-green-300',
              label: '수락' 
            }
          case 'rejected':
            return { 
              bg: 'bg-red-900/50 border-red-700', 
              text: 'text-red-300',
              label: '거절' 
            }
          case 'completed':
            return { 
              bg: 'bg-gray-700/50 border-gray-600', 
              text: 'text-gray-300',
              label: '완료' 
            }
          default:
            return { 
              bg: 'bg-gray-700/50 border-gray-600', 
              text: 'text-gray-300',
              label: status 
            }
        }
      
      default:
        return { 
          bg: 'bg-gray-700/50 border-gray-600', 
          text: 'text-gray-300',
          label: status 
        }
    }
  }

  const config = getStatusConfig()

  const Component = onClick ? 'button' : 'span'

  return (
    <Component 
      onClick={onClick}
      className={`
        inline-flex items-center font-medium rounded-md border
        ${sizeClasses[size]} 
        ${config.bg} 
        ${config.text}
        ${onClick ? 'hover:opacity-80 cursor-pointer transition-opacity' : ''}
      `}
    >
      {config.label}
    </Component>
  )
}