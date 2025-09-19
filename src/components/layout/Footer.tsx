'use client';

import Link from 'next/link';
import { CompanyDocumentDownload } from '@/components/ui';

const footerData = {
  quickLinks: [
    { name: '서비스', href: '/services' },
    { name: '인사이트', href: '/insights' },
    { name: '이벤트', href: '/events' },
    { name: '회사소개', href: '/about' },
    { name: '문의하기', href: '/contact' },
  ],
  contact: {
    phone: '080-727-8899',
    email: 'sjds77@naver.com',
  },
  philosophy: '최고 수준의 호스피탈리티로 고객의 성공을 지원하며, 혁신적인 솔루션을 통해 숙박업의 새로운 기준을 제시합니다.',
};

export function Footer() {
  return (
    <footer id="footer" className="bg-primary-950 text-white" role="contentinfo">
      <div className="container-max section-padding">
        {/* Main Footer Content */}
        <div className="py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Company Info */}
            <div className="lg:col-span-1">
              <Link href="/" className="inline-flex items-center mb-6">
                <span className="text-3xl font-sans font-bold">
                  Lodge<span className="text-accent-400">x</span>
                </span>
              </Link>
              
              <p className="text-primary-200 leading-relaxed mb-6">
                {footerData.philosophy}
              </p>

              {/* Contact Information */}
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3">
                  <svg className="h-5 w-5 text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <p className="text-sm text-primary-200">{footerData.contact.phone}</p>
                </div>

                <div className="flex items-center gap-3">
                  <svg className="h-5 w-5 text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm text-primary-200">{footerData.contact.email}</p>
                </div>
              </div>

              {/* 회사 소개서 다운로드 버튼 */}
              <CompanyDocumentDownload />

            </div>

            {/* Quick Links */}
            <div className="lg:col-span-1">
              <h3 className="text-lg font-sans font-semibold text-accent-400 mb-6">
                빠른 링크
              </h3>
              <ul className="space-y-4">
                {footerData.quickLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-primary-200 hover:text-white hover:translate-x-1 transition-all duration-200 inline-flex items-center group"
                    >
                      <span>{link.name}</span>
                      <svg 
                        className="h-4 w-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-800 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-primary-300 text-center md:text-left">
              <p>© 2025 Lodgex. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
