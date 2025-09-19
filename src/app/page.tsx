import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ImageSlider } from '@/components/ui';
import { SkipLinks } from '@/components/common/SkipLinks';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { PartnersSection } from '@/components/home/PartnersSection';
import Link from 'next/link';

const heroSlides = [
  {
    id: 1,
    image: '/images/hero/hotel-lobby-1.png',
    alt: '전문적이고 럭셔리한 호텔 로비'
  },
  {
    id: 2,
    image: '/images/hero/hotel-restaurant-3.png',
    alt: '고급 호텔 파인다이닝 레스토랑',
  },
  {
    id: 3,
    image: '/images/hero/hotel-room-2.png',
    alt: '호텔 객실',
  }
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SkipLinks />
      <Header />

      <main id="main-content" className="flex-1" role="main">
        {/* LinkedIn-style Hero Section */}
        <section 
          className="bg-neutral-100 py-16 sm:py-20 lg:py-24"
          role="banner"
          aria-label="메인 헤더"
        >
          <div className="container-max section-padding">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              
              {/* Content Side */}
              <div className="order-2 lg:order-1">
                <h1 className="font-sans font-semibold text-neutral-800 mb-6 text-balance leading-tight">
                  숙박업 운영 전문가와&nbsp;<br className='hidden lg:block'/>
                  <span className="text-primary">직접 연결되는</span>&nbsp;<br className='hidden lg:block'/>
                  전문 플랫폼
                </h1>
                <p className="text-lg text-neutral-400 mb-8 leading-relaxed">
                  <strong>관광호텔, 중소형 호텔, 리조트, 일반호텔 등</strong> 검증된 숙박업 운영 전문가들과의 연결을 통해 최고 수준의 
                  컨설팅과 위탁운영 서비스를 제공합니다.
                </p>
                <div className="flex flex-col xs:flex-row gap-4">
                  <Link
                    href="/services#contact-form"
                    className="btn-primary text-xs sm:text-base font-medium px-4 sm:px-8 py-3"
                    aria-label="컨설팅 요청하기"
                  >
                    전문가와 연결하기
                  </Link>
                  <Link
                    href="/services"
                    className="btn-outline text-xs sm:text-base font-medium px-4 sm:px-8 py-3"
                    aria-label="서비스 상세 정보 보기"
                  >
                    서비스 둘러보기
                  </Link>
                </div>
              </div>

              {/* LinkedIn-style Image Slider */}
              <div className="order-1 lg:order-2">
                <div className="relative rounded-lg overflow-hidden bg-white shadow-soft border border-neutral-200">
                  <div className="aspect-video lg:aspect-[16/10]">
                    <ImageSlider
                      items={heroSlides}
                      autoPlay={true}
                      interval={5000}
                      showDots={true}
                      showArrows={false}
                      className="h-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* LinkedIn-style Features Section */}
        <section className="py-20 bg-white" aria-labelledby="features-title">
          <div className="container-max section-padding">
            <div className="text-center mb-16">
              <h2 
                id="features-title"
                className="font-sans font-semibold text-neutral-800 mb-6"
              >
                전문적인 숙박업 운영 솔루션
              </h2>
              <p className="text-lg text-neutral-400 max-w-3xl mx-auto leading-relaxed">
                검증된 전문가 네트워크와 데이터 기반 접근법으로 
                숙박업 운영의 새로운 기준을 제시합니다.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: '검증된 전문가 네트워크',
                  description:
                    '숙박업 운영 분야의 검증된 전문가들과 직접 연결하여 최고 수준의 컨설팅 서비스를 제공합니다.',
                  icon: (
                    <svg
                      className="w-6 h-6 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  ),
                },
                {
                  title: '맞춤형 운영 전략',
                  description:
                    '숙박업체의 특성과 목표에 맞춘 개별화된 운영 전략과 실행 계획을 수립합니다.',
                  icon: (
                    <svg
                      className="w-6 h-6 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                  ),
                },
                {
                  title: '데이터 기반 성과 관리',
                  description:
                    'KPI 중심의 체계적인 성과 측정과 지속적인 개선을 통해 맞춤형 개선전략으로 경쟁력을 강화하고 미래를 준비합니다.',
                  icon: (
                    <svg
                      className="w-6 h-6 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  ),
                },
              ].map((feature, index) => (
                <article
                  key={index}
                  className="linkedin-card card-hover p-8"
                  role="article"
                  aria-labelledby={`feature-title-${index}`}
                >
                  <div className="flex items-start space-x-4">
                    <div className="icon-container flex-shrink-0" aria-hidden="true">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 
                        id={`feature-title-${index}`}
                        className="text-lg font-semibold text-neutral-800 mb-3"
                      >
                        {feature.title}
                      </h3>
                      <p className="text-neutral-400 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* LinkedIn-style Professional CTA Section */}
        <section 
          className="py-20 bg-primary"
          aria-labelledby="cta-title"
        >
          <div className="container-max section-padding">
            <div className="text-center text-white max-w-4xl mx-auto">
              <h2 
                id="cta-title"
                className="font-sans font-semibold mb-6 text-white"
              >
                숙박업 운영 전문가와 연결해보세요
              </h2>
              <p className="text-xl mb-10 text-white/90 leading-relaxed">
                검증된 전문가와의 상담을 통해 귀하의 숙박업 운영 방식을 
                혁신해보세요. 전문적인 진단부터 실행까지 함께합니다.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  href="/services#contact-form"
                  className="bg-white text-primary hover:bg-neutral-50 px-10 py-4 rounded-full font-semibold text-lg transition-colors duration-200 shadow-sm hover:shadow-md"
                  aria-label="무료 컨설팅 신청하기"
                >
                  무료 상담 신청하기
                </Link>
                <Link
                  href="/services"
                  className="border-2 border-white text-white hover:bg-white hover:text-primary px-10 py-4 rounded-full font-semibold text-lg transition-all duration-200"
                  aria-label="서비스 더 알아보기"
                >
                  서비스 더 알아보기
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Partners Section */}
        <PartnersSection />
      </main>

      <Footer />
    </div>
  );
}
