import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SkipLinks } from '@/components/common/SkipLinks';
import { CeoMessage } from '../../components/about/CeoMessage';
import { OrganizationChart } from '../../components/about/OrganizationChart';

export const metadata: Metadata = {
  title: '회사 소개',
  description: 'SoUHGM은 숙박업·호텔 운영 전문성과 디지털 혁신을 바탕으로 차별화된 솔루션을 제공합니다. 대표자 인사말과 조직 구조를 통해 SoUHGM의 비전과 전문성을 확인하세요.',
  keywords: [
    'SoUHGM 회사소개',
    '소유HGM 회사소개',
    '숙박업 전문가',
    '호텔 운영 전문성',
    '디지털 혁신',
    'ESG 경영',
    '지역사회 상생',
    '숙박업 컨설팅',
    '대표자 인사말',
    '조직도'
  ],
  openGraph: {
    title: '회사 소개 | SoUHGM',
    description: 'SoUHGM은 숙박업·호텔 운영 전문성과 디지털 혁신을 바탕으로 차별화된 솔루션을 제공합니다.',
    url: 'https://souhgm.com/about',
    type: 'website',
    locale: 'ko_KR',
    siteName: 'SoUHGM',
  },
  twitter: {
    card: 'summary_large_image',
    title: '회사 소개 | SoUHGM',
    description: 'SoUHGM은 숙박업·호텔 운영 전문성과 디지털 혁신을 바탕으로 차별화된 솔루션을 제공합니다.',
  },
  alternates: {
    canonical: 'https://souhgm.com/about',
  },
};

export default function AboutPage() {
  // About page component
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <SkipLinks />
      <Header />
      
      <main id="main-content" className="flex-1">
        {/* Page Header */}
        <section className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white">
          <div className="absolute inset-0 bg-black/30"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-sans font-bold mb-6 drop-shadow-lg">
                회사 소개
              </h1>
              <p className="text-xl md:text-2xl text-white/95 mb-8 leading-relaxed drop-shadow">
                SoUHGM은 숙박업·호텔 운영 전문성과 디지털 혁신을 바탕으로 
                차별화된 솔루션을 제공합니다.
              </p>
            </div>
          </div>
        </section>

        {/* CEO Message Section */}
        <CeoMessage />

        {/* Organization Chart Section */}
        <OrganizationChart />
      </main>
      
      <Footer />
    </div>
  );
}