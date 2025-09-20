'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface ContactHeroProps {
  className?: string;
}

export function ContactHero({ className }: ContactHeroProps) {
  return (
    <section className={cn('relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white', className)}>
      <div className="absolute inset-0 bg-black/30"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-sans font-bold mb-6 drop-shadow-lg">
            컨설팅 신청
          </h1>
          <p className="text-xl lg:text-2xl text-white/95 mb-8 leading-relaxed drop-shadow">
            숙박업(관광호텔, 중소형호텔, 리조트, 일반호텔) 운영 개선을 위한 전문 컨설팅을 신청하세요.
          </p>
        </div>
      </div>
    </section>
  );
}