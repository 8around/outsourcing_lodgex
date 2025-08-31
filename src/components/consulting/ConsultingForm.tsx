'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Checkbox } from '@/components/ui/Checkbox';
import { ConsultingForm as ConsultingFormType } from '@/types';
import { CONSULTING_SERVICE_OPTIONS } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface ConsultingFormProps {
  className?: string;
  onSubmit?: (data: ConsultingFormType) => void;
}

export function ConsultingForm({ className, onSubmit }: ConsultingFormProps) {
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
  const [errors, setErrors] = useState<
    Partial<Record<keyof ConsultingFormType, string>>
  >({});

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
    } else if (!/^[0-9-+().\s]+$/.test(formData.contactPhone)) {
      newErrors.contactPhone = '올바른 연락처 형식을 입력해주세요.';
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
        if (result.error === 'VALIDATION_ERROR') {
          alert(`입력값을 확인해주세요:\n${result.details?.join('\n')}`);
          return;
        } else if (result.error === 'RATE_LIMIT_EXCEEDED') {
          alert('잠시 후 다시 신청해주세요. (5분 후 재시도 가능)');
          return;
        } else {
          throw new Error(result.message || '서버 오류가 발생했습니다.');
        }
      }

      if (onSubmit) {
        onSubmit(formData);
      }

      // 성공 메시지
      const successMessage = result.emailStatus?.adminNotificationSent && result.emailStatus?.clientConfirmationSent
        ? '컨설팅 신청이 성공적으로 접수되었습니다.\n\n📧 접수 확인 이메일이 발송되었습니다.\n👥 담당자가 영업일 기준 1-2일 내에 연락드리겠습니다.'
        : '컨설팅 신청이 성공적으로 접수되었습니다.\n\n⚠️ 이메일 발송에 일부 문제가 있었지만, 신청은 정상 처리되었습니다.\n👥 담당자가 직접 연락드리겠습니다.';

      alert(successMessage);

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
    } catch (error) {
      console.error('Form submission error:', error);
      alert(
        error instanceof Error 
          ? error.message 
          : '신청 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    field: keyof ConsultingFormType,
    value: string
  ) => {
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

  return (
    <section
      id="consulting-form"
      className={cn('py-16 bg-neutral-50', className)}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-display font-bold text-primary mb-4">
            컨설팅 신청
          </h2>
          <p className="text-lg text-neutral-600">
            호텔 운영 개선을 위한 전문 컨설팅을 신청하세요. 담당 전문가가
            연락드려 상세한 상담을 진행해드립니다.
          </p>
        </div>

        <Card className="bg-white" padding="lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 기본 정보 섹션 */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-primary border-b border-neutral-200 pb-3">
                기본 정보
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

            {/* 필요 서비스 섹션 */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-primary border-b border-neutral-200 pb-3">
                필요 서비스 <span className="text-red-500">*</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {CONSULTING_SERVICE_OPTIONS.map(service => (
                  <Checkbox
                    key={service}
                    name="services"
                    value={service}
                    checked={formData.services.includes(service)}
                    onChange={checked => handleServiceToggle(service, checked)}
                    label={service}
                  />
                ))}
              </div>

              {errors.services && (
                <p className="text-red-500 text-sm">{errors.services}</p>
              )}
            </div>

            {/* 연락처 정보 섹션 */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-primary border-b border-neutral-200 pb-3">
                연락처 정보
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
                    placeholder="예) 02-1234-5678"
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
              <h3 className="text-xl font-bold text-primary border-b border-neutral-200 pb-3">
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
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
              />
            </div>

            {/* 제출 버튼 */}
            <div className="pt-6 border-t border-neutral-200">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-neutral-600">
                  * 필수 입력 항목입니다. 제출 후 영업일 기준 1-2일 내에
                  연락드립니다.
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
      </div>
    </section>
  );
}
