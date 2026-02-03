'use client';

import Link from 'next/link';
import { IntroductionDownloadBtn } from '@/components/common/IntroductionDownloadBtn';
import { COMPANY_INFO } from '@/lib/constants';
import { TextLogo } from '@/components/common/Logo';

const footerData = {
  quickLinks: [
    { name: '사업분야', href: '/services' },
    { name: '인사이트', href: '/insights' },
    { name: '교육·숙박업 운영정보', href: '/events' },
    { name: '회사소개', href: '/about' },
    { name: '컨설팅 신청', href: '/contact' },
  ],
};

export function Footer() {
  return (
    <footer id="footer" className="bg-primary-950 text-white" role="contentinfo">
      <div className="container-max section-padding">
        {/* Main Footer Content */}
        <div className="pt-16 pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Company Info */}
            <div className="lg:col-span-1">
              <Link href="/" className="inline-flex items-center mb-6">
                <TextLogo variant="accent" size="lg" />
              </Link>
              
              <p className="text-primary-200 leading-relaxed mb-6">
                {COMPANY_INFO.philosophy}
              </p>

              {/* Company Information */}
              <div className="space-y-2 mb-6 text-sm text-primary-200">
                <p>
                  <span className="font-semibold text-white">대표</span> {COMPANY_INFO.ceo}
                </p>
                <p>
                  <span className="font-semibold text-white">사업자등록증</span> {COMPANY_INFO.businessNumber} | <span className="font-semibold text-white">통신판매업신고</span> {COMPANY_INFO.mailOrderSalesNumber}
                </p>
                <p>
                  <span className="font-semibold text-white">주소</span> {COMPANY_INFO.address}
                </p>
                <p>
                  <span className="font-semibold text-white">전화</span> {COMPANY_INFO.phone}
                </p>
                <p>
                  <span className="font-semibold text-white">이메일</span> {COMPANY_INFO.email}
                </p>
              </div>

              {/* 회사 소개서 다운로드 버튼 */}
              <IntroductionDownloadBtn />

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
              <p>© 2025 SoUHGM. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
