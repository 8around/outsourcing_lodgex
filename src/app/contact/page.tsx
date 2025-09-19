import type { Metadata } from 'next';
import { ContactPage } from '@/components/contact';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: '문의 - 숙박업 위탁운영 & 컨설팅',
  description:
    '숙박업 위탁운영 및 컨설팅 서비스에 대한 문의와 상담 신청을 위한 연락처 정보입니다. 전문 컨설턴트가 직접 상담해드립니다.',
  keywords: [
    '숙박업 컨설팅 문의',
    '위탁운영 상담',
    '숙박업 전문가 연락처',
    '무료 상담',
    '컨설팅 신청',
    'Lodgex 연락처',
    '숙박업 경영 상담',
    '서비스 문의',
  ],
  openGraph: {
    title: '문의 - Lodgex 숙박업 위탁운영 & 컨설팅',
    description:
      '숙박업 위탁운영 및 컨설팅 서비스에 대한 문의와 상담 신청을 위한 연락처 정보입니다.',
  },
};

export default function ContactPageWrapper() {
  return (
    <main className="min-h-screen">
      <Header />
      <ContactPage />
      <Footer />
    </main>
  );
}