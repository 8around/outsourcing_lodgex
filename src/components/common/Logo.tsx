'use client';

import Image from 'next/image';

interface LogoProps {
  variant?: 'gradient' | 'accent' | 'default';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

interface ImageLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

// Image-based logo component with responsive sizing
export function ImageLogo({
  size = 'md',
  className = ''
}: ImageLogoProps) {
  const sizeConfig = {
    sm: { width: 100, height: 50 },
    md: { width: 120, height: 60 },
    lg: { width: 150, height: 75 }
  };

  const { width, height } = sizeConfig[size];

  return (
    <Image
      src="/images/logo/logo.png"
      alt="SoUHGM - Hospitality Global Management"
      width={width}
      height={height}
      className={`object-contain ${className}`}
      priority
    />
  );
}

// Text-based logo component with responsive sizing
export function TextLogo({
  variant = 'default',
  size = 'md',
  className = ''
}: LogoProps) {
  const textSizeClasses = {
    sm: 'text-xl sm:text-2xl',
    md: 'text-xl sm:text-2xl',
    lg: 'text-2xl sm:text-3xl'
  };

  return (
    <span className={`font-sans font-bold ${textSizeClasses[size]} ${className}`}>
      {variant === 'gradient' && (
        <>
          <span className="text-primary-900">SoU</span>
          <span className="text-gradient">HGM</span>
        </>
      )}
      {variant === 'accent' && (
        <>
          <span>SoU</span>
          <span className="text-accent-400">HGM</span>
        </>
      )}
      {variant === 'default' && (
        <span>SoUHGM</span>
      )}
    </span>
  );
}