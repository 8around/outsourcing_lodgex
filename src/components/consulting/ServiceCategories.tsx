'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { ServiceCategory } from '@/types';
import { cn } from '@/lib/utils';

interface ServiceCategoriesProps {
  categories: ServiceCategory[];
  className?: string;
}

export function ServiceCategories({
  categories,
  className,
}: ServiceCategoriesProps) {
  const [activeCategory, setActiveCategory] = useState<string>(
    categories[0]?.id || ''
  );

  const activeData = categories.find(cat => cat.id === activeCategory);

  return (
    <section className={cn('py-16 bg-white', className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-sans font-bold text-primary mb-4">
            사업 영역
          </h2>
          <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
            숙박업(관광호텔, 중소형호텔, 리조트, 일반호텔) 운영의 모든 영역에서<br />
            전문적이고 차별화된 서비스를 제공합니다.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={cn(
                'px-6 py-3 rounded-lg font-medium transition-all duration-200',
                'flex items-center gap-2',
                activeCategory === category.id
                  ? 'bg-primary text-white shadow-medium'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              )}
            >
              <span className="text-lg">{category.icon}</span>
              {category.title}
            </button>
          ))}
        </div>

        {/* Active Category Content */}
        {activeData && (
          <div id={activeData.id} className="space-y-8">
            {/* Category Description */}
            <div className="text-center">
              <h3 className="text-2xl font-bold text-primary mb-3">
                {activeData.title}
              </h3>
              <p className="text-neutral-600 max-w-4xl mx-auto text-lg">
                {activeData.description}
              </p>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activeData.services.map((service, index) => (
                <Card
                  key={index}
                  className="bg-white border border-neutral-200 hover:shadow-medium hover:border-accent-200 transition-all duration-300"
                  padding="lg"
                >
                  <div className="flex items-start gap-4">
                    {/* Icon/Number */}
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
                        <span className="text-primary font-bold text-lg">
                          {index + 1}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-primary mb-2">
                        {service.title}
                      </h4>
                      <p className="text-neutral-600 text-sm leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Category CTA */}
            <div className="text-center pt-8">
              <p className="text-neutral-600 mb-4">
                <strong>{activeData.title}</strong> 서비스에 대해 더 자세히
                알아보고 싶으신가요?
              </p>
              <a
                href="/contact"
                className="inline-flex items-center px-6 py-2 bg-accent text-white font-medium rounded-lg hover:bg-accent-600 transition-colors duration-200"
              >
                상담 신청하기
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
