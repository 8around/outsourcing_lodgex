'use client';

import React from 'react';
import { ContactHero } from './ContactHero';
import { ContactForm } from './ContactForm';
import { ConsultingForm as ConsultingFormType } from '@/types';
import { cn } from '@/lib/utils';

interface ContactPageProps {
  className?: string;
}

export function ContactPage({ className }: ContactPageProps) {
  const handleFormSubmit = (data: ConsultingFormType) => {
    // TODO: API 호출 로직 구현
    console.log('Consulting form submitted:', data);
  };

  return (
    <div className={cn('', className)}>
      {/* Hero Section */}
      <ContactHero />

      {/* Consulting Form Section */}
      <div className="bg-neutral-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ContactForm onSubmit={handleFormSubmit} />
        </div>
      </div>
    </div>
  );
}