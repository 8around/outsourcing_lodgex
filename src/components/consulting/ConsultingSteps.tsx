import React from 'react';
import { Card } from '@/components/ui/Card';
import { ConsultingStep } from '@/types';
import { cn } from '@/lib/utils';

interface ConsultingStepsProps {
  steps: ConsultingStep[];
  className?: string;
}

export function ConsultingSteps({ steps, className }: ConsultingStepsProps) {
  return (
    <section className={cn('py-16 bg-neutral-50', className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-sans font-bold text-primary mb-4">
            컨설팅 프로세스
          </h2>
          <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
            체계적인 4단계 프로세스를 통해 호텔의 운영 효율성을 극대화하고
            지속적인 성과 개선을 지원합니다.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div key={step.step} className="relative">
              <Card
                className="h-full text-center bg-white hover:shadow-medium transition-shadow duration-300"
                padding="lg"
              >
                {/* Icon */}
                <div className="mb-6">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary-50 text-primary">
                    <span className="text-3xl">{step.icon}</span>
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-primary mb-3">
                  {step.title}
                </h3>
                <p className="text-neutral-600 text-sm leading-relaxed">
                  {step.description}
                </p>
              </Card>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-neutral-600 mb-6">
            전문 컨설턴트와 함께 호텔 운영의 새로운 전환점을 만들어보세요.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center px-8 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-800 transition-colors duration-200"
          >
            컨설팅 신청하기
            <svg
              className="ml-2 w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
