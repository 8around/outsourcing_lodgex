'use client';

interface LogoProps {
  variant?: 'gradient' | 'accent' | 'default';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
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
          <span className="text-primary-900">Lodge</span>
          <span className="text-gradient">nse</span>
        </>
      )}
      {variant === 'accent' && (
        <>
          <span>Lodge</span>
          <span className="text-accent-400">nse</span>
        </>
      )}
      {variant === 'default' && (
        <span>Lodgense</span>
      )}
    </span>
  );
}