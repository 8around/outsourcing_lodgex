'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

interface BusinessHoursProps {
  className?: string;
}

export function BusinessHours({ className }: BusinessHoursProps) {
  const businessHours = [
    {
      day: '월요일 - 금요일',
      hours: '09:00 - 18:00',
      type: 'regular'
    },
    {
      day: '토요일',
      hours: '09:00 - 13:00',
      type: 'weekend'
    },
    {
      day: '일요일 & 공휴일',
      hours: '휴무',
      type: 'closed'
    }
  ];

  const getCurrentStatus = () => {
    const now = new Date();
    const currentDay = now.getDay(); // 0: Sunday, 1: Monday, ..., 6: Saturday
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = currentHour * 60 + currentMinute;

    // Check if it's a weekend or weekday
    if (currentDay === 0) { // Sunday
      return { status: 'closed', message: '오늘은 휴무일입니다' };
    } else if (currentDay === 6) { // Saturday
      if (currentTime >= 9 * 60 && currentTime < 13 * 60) {
        return { status: 'open', message: '상담 가능' };
      } else {
        return { status: 'closed', message: '오늘 상담시간이 종료되었습니다' };
      }
    } else { // Weekdays (Monday-Friday)
      if (currentTime >= 9 * 60 && currentTime < 18 * 60) {
        return { status: 'open', message: '상담 가능' };
      } else {
        return { status: 'closed', message: '상담시간 외입니다' };
      }
    }
  };

  const currentStatus = getCurrentStatus();

  return (
    <Card className={cn('bg-white border border-neutral-300 shadow-medium', className)} padding="lg">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-primary mb-2 flex items-center gap-2">
          <span>🕒</span>
          운영 시간
        </h2>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${
            currentStatus.status === 'open' ? 'bg-accent-500' : 'bg-red-500'
          }`}></div>
          <span className={`text-sm font-medium ${
            currentStatus.status === 'open' ? 'text-accent-700' : 'text-red-600'
          }`}>
            {currentStatus.message}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {businessHours.map((schedule, index) => (
          <div 
            key={index}
            className="flex items-center justify-between py-2 border-b border-neutral-100 last:border-b-0"
          >
            <span className="text-neutral-700 font-medium text-sm">
              {schedule.day}
            </span>
            <span className={`font-semibold text-sm ${
              schedule.type === 'closed' 
                ? 'text-red-600' 
                : schedule.type === 'weekend'
                ? 'text-orange-600'
                : 'text-accent-600'
            }`}>
              {schedule.hours}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-neutral-200">
        <div className="bg-neutral-50 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <span className="text-lg">ℹ️</span>
            <div className="flex-1">
              <p className="text-neutral-700 text-sm leading-relaxed">
                <span className="font-medium">24시간 이메일 접수</span><br />
                운영시간 외에도 이메일로 문의하시면<br />
                다음 영업일에 빠르게 답변드립니다.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Contact Notice */}
      <div className="mt-4">
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <span className="text-orange-600">⚡</span>
            <div className="flex-1">
              <p className="text-orange-800 text-xs font-medium">
                긴급 문의의 경우
              </p>
              <p className="text-orange-700 text-xs">
                이메일에 [긴급]을 제목에 포함해 주세요
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}