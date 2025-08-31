'use client';

import React from 'react';
import { ConsultingSteps } from './ConsultingSteps';
import { ServiceCategories } from './ServiceCategories';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CONSULTING_STEPS, SERVICE_CATEGORIES } from '@/lib/constants';
import type { ConsultingStep, ServiceCategory } from '@/types';
import { cn } from '@/lib/utils';

interface ConsultingServiceProps {
  className?: string;
}

export function ConsultingService({ className }: ConsultingServiceProps) {

  const serviceCategories: ServiceCategory[] = [
    SERVICE_CATEGORIES.MANAGEMENT,
    SERVICE_CATEGORIES.CONSULTING,
    SERVICE_CATEGORIES.ORGANIZATION,
    SERVICE_CATEGORIES.TRAINING,
  ].map(category => ({
    ...category,
    services: [...category.services],
  }));

  return (
    <div className={cn('', className)}>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 drop-shadow-lg">
              호텔 위탁운영 &<br />
              전문 컨설팅
            </h1>
            <p className="text-xl md:text-2xl text-white/95 mb-8 leading-relaxed drop-shadow">
              체계적인 운영 시스템과 전문적인 컨설팅으로
              <br />
              호텔의 가치를 극대화하고 지속 가능한 성장을 실현합니다
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="secondary"
                size="lg"
                onClick={() => window.location.href = '/contact'}
              >
                무료 상담 신청
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() =>
                  document
                    .getElementById('services')
                    ?.scrollIntoView({ behavior: 'smooth' })
                }
                className="border-white text-white hover:bg-white hover:text-primary"
              >
                서비스 둘러보기
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-primary mb-4">
              왜 Lodgex를 선택해야 할까요?
            </h2>
            <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
              호텔업계 전문가들의 풍부한 경험과 체계적인 접근법으로 귀하의
              호텔이 지속적으로 성장할 수 있도록 지원합니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card
              className="text-center bg-white border border-neutral-200 hover:shadow-medium transition-all duration-300"
              padding="lg"
            >
              <div className="w-16 h-16 mx-auto mb-6 bg-primary-50 rounded-full flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-bold text-primary mb-4">
                데이터 기반 분석
              </h3>
              <p className="text-neutral-600">
                정확한 데이터 분석을 바탕으로 객관적이고 실용적인 개선안을
                제시합니다.
              </p>
            </Card>

            <Card
              className="text-center bg-white border border-neutral-200 hover:shadow-medium transition-all duration-300"
              padding="lg"
            >
              <div className="w-16 h-16 mx-auto mb-6 bg-primary-50 rounded-full flex items-center justify-center">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-bold text-primary mb-4">
                맞춤형 솔루션
              </h3>
              <p className="text-neutral-600">
                각 호텔의 특성과 목표에 맞춘 최적화된 솔루션을 제공합니다.
              </p>
            </Card>

            <Card
              className="text-center bg-white border border-neutral-200 hover:shadow-medium transition-all duration-300"
              padding="lg"
            >
              <div className="w-16 h-16 mx-auto mb-6 bg-primary-50 rounded-full flex items-center justify-center">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="text-xl font-bold text-primary mb-4">
                지속적 성장
              </h3>
              <p className="text-neutral-600">
                일회성 컨설팅이 아닌 장기적 파트너십을 통해 지속 가능한 성장을
                지원합니다.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Consulting Steps */}
      <ConsultingSteps steps={[...CONSULTING_STEPS] as ConsultingStep[]} />

      {/* Service Categories */}
      <div id="services">
        <ServiceCategories categories={serviceCategories} />
      </div>

      {/* Statistics Section */}
      <section className="py-16 bg-primary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-primary mb-4">
              검증된 성과
            </h2>
            <p className="text-lg text-neutral-600">
              Lodgex와 함께한 호텔들의 실제 성과를 확인해보세요.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-display font-bold text-primary mb-2">
                50+
              </div>
              <div className="text-neutral-600">컨설팅 완료</div>
            </div>
            <div>
              <div className="text-4xl font-display font-bold text-primary mb-2">
                25%
              </div>
              <div className="text-neutral-600">평균 수익 개선</div>
            </div>
            <div>
              <div className="text-4xl font-display font-bold text-primary mb-2">
                98%
              </div>
              <div className="text-neutral-600">고객 만족도</div>
            </div>
            <div>
              <div className="text-4xl font-display font-bold text-primary mb-2">
                15%
              </div>
              <div className="text-neutral-600">운영비 절감</div>
            </div>
          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section className="py-16 bg-primary-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-display font-bold mb-4">
            지금 바로 시작하세요
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            전문 컨설턴트와의 무료 상담을 통해 호텔의 새로운 가능성을
            발견해보세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="secondary"
              size="lg"
              onClick={() => window.location.href = '/contact'}
            >
              무료 상담 신청하기
            </Button>

          </div>
        </div>
      </section>
    </div>
  );
}
