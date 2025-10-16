import type { Metadata } from 'next';
import { ConsultingService } from '@/components/consulting';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: '서비스 - 호텔 위탁운영 & 컨설팅',
  description:
    '전문적인 호텔 위탁운영 서비스와 맞춤형 컨설팅으로 호텔의 가치를 극대화합니다. 4단계 체계적 프로세스를 통한 운영 효율성 향상과 지속 가능한 성장을 지원합니다.',
  keywords: [
    '호텔 위탁운영',
    '호텔 컨설팅',
    '호텔 경영 컨설팅',
    '직무 조직 컨설팅',
    '교육훈련 솔루션',
    'F&B 관리',
    '호텔 매니지먼트',
    'RevPAR 개선',
    'OTA 관리',
    '브랜드 포지셔닝',
  ],
  openGraph: {
    title: '서비스 - Lodgense 호텔 위탁운영 & 컨설팅',
    description:
      '전문적인 호텔 위탁운영 서비스와 맞춤형 컨설팅으로 호텔의 가치를 극대화합니다.',
  },
};

export default function ServicesPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <ConsultingService />
      <Footer />
    </main>
  );
}
