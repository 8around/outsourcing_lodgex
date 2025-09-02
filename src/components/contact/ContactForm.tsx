'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Checkbox } from '@/components/ui/Checkbox';
import { ConsultingForm as ConsultingFormType } from '@/types';
import { CONSULTING_SERVICE_OPTIONS } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface ContactFormProps {
  className?: string;
  onSubmit?: (data: ConsultingFormType) => void;
}

export function ContactForm({ className, onSubmit }: ContactFormProps) {
  const [formData, setFormData] = useState<ConsultingFormType>({
    companyName: '',
    location: '',
    scale: '',
    services: [],
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    additionalRequests: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<
    Partial<Record<keyof ConsultingFormType, string>>
  >({});

  const formatPhoneNumber = (value: string): string => {
    // 숫자만 추출
    const numbers = value.replace(/[^0-9]/g, '');
    
    // 숫자가 없으면 빈 문자열 반환
    if (numbers.length === 0) return '';
    
    // 전화번호 포맷팅
    if (numbers.startsWith('02')) {
      // 서울 지역번호
      if (numbers.length <= 2) return numbers;
      if (numbers.length <= 5) return `${numbers.slice(0, 2)}-${numbers.slice(2)}`;
      if (numbers.length <= 9) return `${numbers.slice(0, 2)}-${numbers.slice(2, 5)}-${numbers.slice(5)}`;
      return `${numbers.slice(0, 2)}-${numbers.slice(2, 6)}-${numbers.slice(6, 10)}`;
    } else if (numbers.startsWith('01')) {
      // 휴대폰 번호
      if (numbers.length <= 3) return numbers;
      if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
      if (numbers.length <= 10) return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7)}`;
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
    } else if (numbers.startsWith('0')) {
      // 기타 지역번호 (031, 032, 033 등)
      if (numbers.length <= 3) return numbers;
      if (numbers.length <= 6) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
      if (numbers.length <= 10) return `${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(6)}`;
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
    } else {
      // 일반 전화번호 (1588, 1577 등)
      if (numbers.length <= 4) return numbers;
      return `${numbers.slice(0, 4)}-${numbers.slice(4, 8)}`;
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ConsultingFormType, string>> = {};

    if (!formData.companyName.trim()) {
      newErrors.companyName = '기업명/호텔명을 입력해주세요.';
    }

    if (!formData.location.trim()) {
      newErrors.location = '위치를 입력해주세요.';
    }

    if (!formData.scale.trim()) {
      newErrors.scale = '규모를 입력해주세요.';
    }

    if (formData.services.length === 0) {
      newErrors.services = '필요 서비스를 하나 이상 선택해주세요.';
    }

    if (!formData.contactName.trim()) {
      newErrors.contactName = '담당자명을 입력해주세요.';
    }

    if (!formData.contactPhone.trim()) {
      newErrors.contactPhone = '연락처를 입력해주세요.';
    } else {
      // 숫자만 추출하여 검증
      const phoneNumbers = formData.contactPhone.replace(/[^0-9]/g, '');
      if (phoneNumbers.length < 9 || phoneNumbers.length > 11) {
        newErrors.contactPhone = '올바른 연락처를 입력해주세요.';
      }
    }

    if (!formData.contactEmail.trim()) {
      newErrors.contactEmail = '이메일을 입력해주세요.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
      newErrors.contactEmail = '올바른 이메일 형식을 입력해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // API 호출
      const response = await fetch('/api/service-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          companyName: formData.companyName,
          location: formData.location,
          scale: formData.scale,
          services: formData.services,
          contactName: formData.contactName,
          contactPhone: formData.contactPhone,
          contactEmail: formData.contactEmail,
          additionalRequests: formData.additionalRequests,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || '신청 중 오류가 발생했습니다.');
      }

      if (onSubmit) {
        onSubmit(formData);
      }

      // 성공 메시지
      alert(
        result.message || '컨설팅 신청이 성공적으로 접수되었습니다. 담당자가 영업일 기준 1-2일 내에 연락드리겠습니다.'
      );

      // 폼 초기화
      setFormData({
        companyName: '',
        location: '',
        scale: '',
        services: [],
        contactName: '',
        contactPhone: '',
        contactEmail: '',
        additionalRequests: '',
      });
      setUploadedFile(null);
    } catch (error) {
      alert(error instanceof Error ? error.message : '신청 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    field: keyof ConsultingFormType,
    value: string
  ) => {
    // 연락처 필드의 경우 자동 포맷팅 적용
    if (field === 'contactPhone') {
      value = formatPhoneNumber(value);
    }
    
    setFormData(prev => ({ ...prev, [field]: value }));
    // 에러가 있다면 입력 시 제거
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleServiceToggle = (service: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      services: checked
        ? [...prev.services, service]
        : prev.services.filter(s => s !== service),
    }));

    if (errors.services) {
      setErrors(prev => ({ ...prev, services: undefined }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 파일 크기 제한 (10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('파일 크기는 10MB 이하로 제한됩니다.');
        return;
      }
      setUploadedFile(file);
    }
  };

  return (
    <section
      id="contact-form"
      className={cn('', className)}
    >
      <Card className="bg-white border border-neutral-300 shadow-medium" padding="lg">
        <div className="mb-8">
          <h2 className="text-2xl font-display font-bold text-primary mb-3">
            컨설팅 신청
          </h2>
          <p className="text-neutral-600">
            호텔 운영 개선을 위한 전문 컨설팅을 신청하세요. 
            담당 전문가가 연락드려 상세한 상담을 진행해드립니다.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 기업 정보 섹션 */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-neutral-800 border-b border-neutral-200 pb-3 flex items-center gap-2">
              <span className="text-primary">🏢</span>
              기업 정보
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Input
                  label="기업명/호텔명"
                  name="companyName"
                  value={formData.companyName}
                  onChange={e =>
                    handleInputChange('companyName', e.target.value)
                  }
                  placeholder="예) 서울호텔"
                  required
                  error={errors.companyName}
                />
              </div>

              <div>
                <Input
                  label="위치"
                  name="location"
                  value={formData.location}
                  onChange={e =>
                    handleInputChange('location', e.target.value)
                  }
                  placeholder="예) 서울특별시 강남구"
                  required
                  error={errors.location}
                />
              </div>
            </div>

            <div>
              <Input
                label="규모"
                name="scale"
                value={formData.scale}
                onChange={e => handleInputChange('scale', e.target.value)}
                placeholder="예) 객실 100실, 직원 50명"
                required
                error={errors.scale}
              />
            </div>
          </div>

          {/* 서비스 요청 섹션 */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-neutral-800 border-b border-neutral-200 pb-3 flex items-center gap-2">
              <span className="text-primary">🎯</span>
              서비스 요청사항 <span className="text-red-500">*</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {CONSULTING_SERVICE_OPTIONS.map(service => (
                <div 
                  key={service}
                  className="bg-neutral-50 border border-neutral-200 rounded-lg p-4 hover:bg-primary-50 hover:border-primary-200 transition-colors duration-200"
                >
                  <Checkbox
                    name="services"
                    value={service}
                    checked={formData.services.includes(service)}
                    onChange={checked => handleServiceToggle(service, checked)}
                    label={service}
                  />
                </div>
              ))}
            </div>

            {errors.services && (
              <p className="text-red-500 text-sm flex items-center gap-2">
                <span>⚠️</span>
                {errors.services}
              </p>
            )}
          </div>

          {/* 담당자 정보 섹션 */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-neutral-800 border-b border-neutral-200 pb-3 flex items-center gap-2">
              <span className="text-primary">👤</span>
              담당자 정보
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Input
                  label="담당자명"
                  name="contactName"
                  value={formData.contactName}
                  onChange={e =>
                    handleInputChange('contactName', e.target.value)
                  }
                  placeholder="예) 홍길동"
                  required
                  error={errors.contactName}
                />
              </div>

              <div>
                <Input
                  label="연락처"
                  name="contactPhone"
                  type="tel"
                  value={formData.contactPhone}
                  onChange={e =>
                    handleInputChange('contactPhone', e.target.value)
                  }
                  placeholder="예) 010-1234-5678"
                  maxLength={13}
                  required
                  error={errors.contactPhone}
                />
              </div>
            </div>

            <div>
              <Input
                label="이메일"
                name="contactEmail"
                type="email"
                value={formData.contactEmail}
                onChange={e =>
                  handleInputChange('contactEmail', e.target.value)
                }
                placeholder="예) contact@example.com"
                required
                error={errors.contactEmail}
              />
            </div>
          </div>

          {/* 추가 요청사항 섹션 */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-neutral-800 border-b border-neutral-200 pb-3 flex items-center gap-2">
              <span className="text-primary">💬</span>
              추가 요청사항 (선택)
            </h3>

            <textarea
              name="additionalRequests"
              value={formData.additionalRequests}
              onChange={e =>
                handleInputChange('additionalRequests', e.target.value)
              }
              rows={4}
              placeholder="추가로 문의하고 싶은 내용이나 특별한 요구사항을 입력해주세요."
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
            />
          </div>

          {/* 제출 버튼 */}
          <div className="pt-6 border-t border-neutral-200">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-neutral-600 flex items-center gap-2">
                <span>ℹ️</span>
                영업일 기준 1-2일 내에 담당자가 연락드립니다.
              </p>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={isSubmitting}
                disabled={isSubmitting}
                className="w-full sm:w-auto"
              >
                {isSubmitting ? '신청 중...' : '컨설팅 신청하기'}
              </Button>
            </div>
          </div>
        </form>
      </Card>
    </section>
  );
}