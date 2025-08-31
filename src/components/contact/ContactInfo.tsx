'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { COMPANY_INFO } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface ContactInfoProps {
  className?: string;
}

export function ContactInfo({ className }: ContactInfoProps) {
  const contactMethods = [
    {
      icon: '📞',
      title: '전화 문의',
      content: COMPANY_INFO.phone,
      description: '평일 09:00 - 18:00',
      action: `tel:${COMPANY_INFO.phone}`,
      actionText: '전화걸기'
    },
    {
      icon: '✉️',
      title: '이메일 문의',
      content: COMPANY_INFO.email,
      description: '24시간 접수 가능',
      action: `mailto:${COMPANY_INFO.email}`,
      actionText: '이메일 보내기'
    },
    {
      icon: '📍',
      title: '본사 주소',
      content: COMPANY_INFO.address,
      description: '방문 상담 가능 (사전 예약)',
      action: `https://maps.google.com/?q=${encodeURIComponent(COMPANY_INFO.address)}`,
      actionText: '지도에서 보기'
    }
  ];

  return (
    <Card className={cn('bg-white border border-neutral-300 shadow-medium', className)} padding="lg">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-primary mb-2 flex items-center gap-2">
          <span>📋</span>
          연락처 정보
        </h2>
        <p className="text-neutral-600 text-sm">
          전문 컨설턴트가 직접 상담해드립니다
        </p>
      </div>

      <div className="space-y-6">
        {contactMethods.map((method, index) => (
          <div 
            key={index}
            className="group border-b border-neutral-100 last:border-b-0 pb-6 last:pb-0"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center text-xl group-hover:bg-primary-100 transition-colors duration-200">
                {method.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-neutral-800 text-sm mb-1">
                  {method.title}
                </h3>
                <p className="text-neutral-700 font-medium mb-1 break-all">
                  {method.content}
                </p>
                <p className="text-neutral-500 text-xs mb-3">
                  {method.description}
                </p>
                <a
                  href={method.action}
                  target={method.action.startsWith('http') ? '_blank' : undefined}
                  rel={method.action.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="inline-flex items-center text-primary hover:text-primary-700 text-sm font-medium transition-colors duration-200"
                >
                  {method.actionText}
                  <span className="ml-1">→</span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Contact CTA */}
      <div className="mt-6 pt-6 border-t border-neutral-200">
        <div className="bg-primary-50 rounded-lg p-4 text-center">
          <p className="text-primary-800 font-medium text-sm mb-2">
            🚀 급한 문의가 있으신가요?
          </p>
          <a
            href={`tel:${COMPANY_INFO.phone}`}
            className="inline-flex items-center justify-center w-full bg-primary text-white font-medium py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors duration-200"
          >
            <span className="mr-2">📞</span>
            지금 바로 전화하기
          </a>
        </div>
      </div>
    </Card>
  );
}