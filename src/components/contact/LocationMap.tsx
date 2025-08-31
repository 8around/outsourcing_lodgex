'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { COMPANY_INFO } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface LocationMapProps {
  className?: string;
}

export function LocationMap({ className }: LocationMapProps) {
  const handleDirections = () => {
    const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(COMPANY_INFO.address)}`;
    window.open(mapsUrl, '_blank');
  };

  const transportationInfo = [
    {
      type: '지하철',
      icon: '🚇',
      info: '2호선 강남역 3번 출구 도보 5분'
    },
    {
      type: '버스',
      icon: '🚌',
      info: '강남역 정류장 하차'
    },
    {
      type: '주차',
      icon: '🚗',
      info: '건물 지하 주차장 이용 가능'
    }
  ];

  return (
    <Card className={cn('bg-white border border-neutral-300 shadow-medium', className)} padding="lg">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-primary mb-2 flex items-center gap-2">
          <span>🗺️</span>
          오시는 길
        </h2>
        <p className="text-neutral-600 text-sm">
          방문 상담은 사전 예약 후 가능합니다
        </p>
      </div>

      {/* Map Placeholder */}
      <div className="mb-6">
        <div className="relative bg-neutral-100 border border-neutral-200 rounded-lg overflow-hidden aspect-[4/3]">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-2">🗺️</div>
              <p className="text-neutral-600 font-medium">지도 영역</p>
              <p className="text-neutral-500 text-sm">실제 구현 시 Google Maps API 연동</p>
            </div>
          </div>
          
          {/* Overlay with address */}
          <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-3">
            <p className="text-sm font-medium">{COMPANY_INFO.address}</p>
          </div>
        </div>
      </div>

      {/* Transportation Info */}
      <div className="space-y-4 mb-6">
        <h3 className="font-semibold text-neutral-800 text-sm">교통편</h3>
        {transportationInfo.map((transport, index) => (
          <div 
            key={index}
            className="flex items-start gap-3 p-3 bg-neutral-50 rounded-lg"
          >
            <span className="text-lg">{transport.icon}</span>
            <div className="flex-1">
              <p className="font-medium text-neutral-800 text-sm">
                {transport.type}
              </p>
              <p className="text-neutral-600 text-xs">
                {transport.info}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button
          variant="outline"
          size="md"
          onClick={handleDirections}
          className="w-full justify-center"
        >
          <span className="mr-2">🧭</span>
          길찾기
        </Button>
        
        <div className="bg-primary-50 rounded-lg p-4 text-center">
          <p className="text-primary-800 text-sm font-medium mb-2">
            방문 상담 예약
          </p>
          <p className="text-primary-700 text-xs mb-3">
            더욱 자세한 상담을 원하시면<br />
            사전 예약 후 방문해 주세요
          </p>
          <Button
            variant="primary"
            size="sm"
            onClick={() =>
              document
                .getElementById('contact-form')
                ?.scrollIntoView({ behavior: 'smooth' })
            }
            className="w-full"
          >
            방문 상담 예약하기
          </Button>
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-4 pt-4 border-t border-neutral-200">
        <div className="text-xs text-neutral-500 space-y-1">
          <p>• 평일 방문 상담: 09:00 - 17:00</p>
          <p>• 토요일 방문 상담: 09:00 - 12:00</p>
          <p>• 일요일 및 공휴일: 휴무</p>
        </div>
      </div>
    </Card>
  );
}