'use client';

import Link from 'next/link';

const skipLinks = [
  { href: '#main-content', label: '본문 내용으로 이동' },
  { href: '#navigation', label: '주 메뉴로 이동' },
  { href: '#footer', label: '하단 정보로 이동' },
];

export function SkipLinks() {
  return (
    <nav className="sr-only focus-within:not-sr-only" aria-label="건너뛰기 링크">
      <div className="fixed top-4 left-4 z-[9999] flex flex-col gap-2">
        {skipLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="
              inline-block px-4 py-2 
              bg-primary text-white 
              text-sm font-medium 
              rounded-lg shadow-strong
              focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2
              transform -translate-y-full focus:translate-y-0
              transition-transform duration-300
            "
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}