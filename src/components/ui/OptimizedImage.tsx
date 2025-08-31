'use client';

import Image from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  priority?: boolean;
  sizes?: string;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  loading?: 'eager' | 'lazy';
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  onLoadComplete?: () => void;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill = false,
  className,
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  quality = 85,
  placeholder = 'empty',
  blurDataURL,
  loading = 'lazy',
  objectFit = 'cover',
  onLoadComplete,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Generate blur placeholder based on image dimensions
  const generateBlurDataURL = (w: number, h: number) => {
    return `data:image/svg+xml;base64,${Buffer.from(`
      <svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
        <rect width="${w}" height="${h}" fill="#f3f4f6"/>
        <rect x="20%" y="20%" width="60%" height="60%" fill="#e5e7eb" rx="4"/>
      </svg>
    `).toString('base64')}`;
  };

  const handleLoadComplete = () => {
    setIsLoading(false);
    onLoadComplete?.();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  if (hasError) {
    return (
      <div 
        className={cn(
          'flex items-center justify-center bg-neutral-100 text-neutral-400',
          className
        )}
        style={{ width, height }}
        role="img"
        aria-label={`이미지 로드 실패: ${alt}`}
      >
        <svg 
          className="w-8 h-8" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
          />
        </svg>
        <span className="sr-only">이미지를 불러올 수 없습니다</span>
      </div>
    );
  }

  const imageProps = {
    src,
    alt,
    quality,
    priority,
    loading: priority ? 'eager' as const : loading,
    placeholder: placeholder === 'blur' ? 'blur' as const : 'empty' as const,
    blurDataURL: blurDataURL || (width && height ? generateBlurDataURL(width, height) : undefined),
    onLoad: handleLoadComplete,
    onError: handleError,
    sizes,
    className: cn(
      'transition-opacity duration-300',
      isLoading && 'opacity-0',
      !isLoading && 'opacity-100',
      className
    ),
    style: {
      objectFit,
    },
  };

  if (fill) {
    return (
      <div className={cn('relative overflow-hidden', className)}>
        {isLoading && (
          <div 
            className="absolute inset-0 bg-gradient-to-r from-neutral-100 via-neutral-50 to-neutral-100 animate-pulse"
            aria-hidden="true"
          />
        )}
        <Image
          fill
          {...imageProps}
          className={cn(
            'transition-opacity duration-300',
            isLoading && 'opacity-0',
            !isLoading && 'opacity-100'
          )}
        />
      </div>
    );
  }

  return (
    <div className="relative">
      {isLoading && width && height && (
        <div 
          className="absolute inset-0 bg-gradient-to-r from-neutral-100 via-neutral-50 to-neutral-100 animate-pulse rounded-lg"
          style={{ width, height }}
          aria-hidden="true"
        />
      )}
      <Image
        width={width}
        height={height}
        {...imageProps}
      />
    </div>
  );
}

// Common responsive image sizes for the website
export const imageSizes = {
  hero: '(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1200px',
  card: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px',
  thumbnail: '(max-width: 768px) 100px, 200px',
  gallery: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px',
} as const;