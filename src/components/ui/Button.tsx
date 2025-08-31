import React from 'react';
import { cn } from '@/lib/utils';
import { ButtonProps } from '@/types';

const buttonVariants = {
  primary: 'bg-primary text-white hover:bg-primary-800 focus-visible:ring-primary-500 shadow-soft hover:shadow-medium',
  secondary: 'bg-accent text-white hover:bg-accent-600 focus-visible:ring-accent-500 shadow-soft hover:shadow-medium',
  outline:
    'border-2 border-primary text-primary hover:bg-primary hover:text-white focus-visible:ring-primary-500 shadow-soft hover:shadow-medium',
  ghost: 'text-primary hover:bg-primary-50 focus-visible:ring-primary-500',
};

const buttonSizes = {
  sm: 'px-3 py-1.5 text-sm min-h-[36px]',
  md: 'px-4 py-2 text-sm min-h-touch',
  lg: 'px-6 py-3 text-base min-h-[52px]',
};

export function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  children,
  onClick,
  type = 'button',
  className,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  ...props
}: ButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (loading || disabled) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={handleClick}
      aria-label={loading ? `로딩 중... ${ariaLabel || ''}` : ariaLabel}
      aria-describedby={ariaDescribedBy}
      aria-busy={loading}
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-medium',
        'transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'transform hover:scale-105 active:scale-95',
        // Reduced motion support
        'motion-reduce:transform-none motion-reduce:hover:scale-100 motion-reduce:active:scale-100',
        // Touch target optimization
        '-webkit-tap-highlight-color: transparent',
        buttonVariants[variant],
        buttonSizes[size],
        className
      )}
      style={{
        // Improve touch response
        touchAction: 'manipulation',
      }}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      <span className={loading ? 'opacity-75' : ''}>{children}</span>
      {loading && <span className="sr-only">처리 중입니다. 잠시만 기다려 주세요.</span>}
    </button>
  );
}
