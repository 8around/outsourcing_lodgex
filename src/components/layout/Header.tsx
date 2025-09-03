'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navigation = [
  { name: '서비스', href: '/services' },
  { name: '인사이트', href: '/insights' },
  { name: '이벤트', href: '/events' },
  { name: '고객후기', href: '/testimonials' },
  { name: '문의', href: '/contact' },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsMenuOpen(false);
    }
  };

  return (
    <header 
      className="bg-white/95 backdrop-blur-md border-b border-neutral-200/50 sticky top-0 z-50 shadow-soft safe-top"
      onKeyDown={handleKeyDown}
    >
      <nav 
        className="container-max section-padding" 
        role="navigation" 
        aria-label="주 내비게이션"
      >
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link 
              href="/" 
              className="flex items-center group min-h-touch min-w-touch rounded-lg p-1 -m-1 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
              aria-label="Lodgex 홈으로 이동"
            >
              <span className="text-xl sm:text-2xl font-sans font-bold text-primary-900 group-hover:text-primary-800 transition-colors">
                Lodge<span className="text-gradient">x</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-2 lg:space-x-4">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`px-3 py-2 min-h-touch rounded-lg text-sm lg:text-base font-medium transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 ${
                      isActive
                        ? 'text-primary-900 bg-primary-50 border-b-2 border-accent-500'
                        : 'text-neutral-600 hover:text-primary-900 hover:bg-neutral-50'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Link
              href="/contact"
              className="btn-primary text-sm lg:text-base font-semibold"
              aria-label="컨설팅 요청하기"
            >
              컨설팅 요청
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center min-h-touch min-w-touch rounded-lg text-neutral-600 hover:text-primary-900 hover:bg-neutral-100 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 transition-colors"
              aria-expanded={isMenuOpen}
              aria-label={isMenuOpen ? '메뉴 닫기' : '메뉴 열기'}
              aria-controls="mobile-menu"
            >
              <span className="sr-only">{isMenuOpen ? '메뉴 닫기' : '메뉴 열기'}</span>
              {!isMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          ref={menuRef}
          id="mobile-menu"
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isMenuOpen 
              ? 'max-h-screen opacity-100' 
              : 'max-h-0 opacity-0 overflow-hidden'
          }`}
          aria-hidden={!isMenuOpen}
        >
          <div className="px-4 pt-4 pb-6 space-y-2 border-t border-neutral-200 mt-4 bg-white/95 backdrop-blur-md">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-4 py-3 min-h-touch rounded-lg text-base font-medium transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 ${
                    isActive
                      ? 'text-primary-900 bg-primary-50 border-l-4 border-accent-500'
                      : 'text-neutral-600 hover:text-primary-900 hover:bg-neutral-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {item.name}
                </Link>
              );
            })}
            <div className="mt-6 px-4">
              <Link
                href="/contact"
                className="btn-primary w-full text-center font-semibold"
                onClick={() => setIsMenuOpen(false)}
                aria-label="컨설팅 요청하기"
              >
                컨설팅 요청
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
