"use client";

import Image from "next/image";
import { useState } from "react";

export function OrganizationChart() {
  const [imageError, setImageError] = useState(false);

  const organizationImageUrl = `/images/organization-chart/organization-chart.jpg`;

  return (
    <section className="py-16 lg:py-24 bg-gray-50">
      <div className="container-max section-padding">
        <div className="max-w-6xl mx-auto">
          {/* Decorative Elements */}
          <div className="mb-12 flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-br from-accent-400 to-accent-600 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
          </div>

          {/* Section Header */}
          <div className="text-center mb-12">
            <h2
              id="organization-chart-title"
              className="text-3xl md:text-4xl font-bold text-primary-900 mb-4"
            >
              조직도
            </h2>
            <div className="w-24 h-1 bg-accent-500 mx-auto mb-6"></div>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Lodgense의 전문적이고 체계적인 조직 구조를 통해 최고의 서비스를
              제공합니다.
            </p>
          </div>

          {/* Organization Chart Image */}
          <div
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
            role="img"
            aria-labelledby="organization-chart-title"
          >
            {!imageError ? (
              <div className="relative w-full">
                <Image
                  src={organizationImageUrl}
                  alt="Lodgense 조직도 - 회사의 체계적인 조직 구조를 보여주는 차트"
                  width={1200}
                  height={800}
                  className="w-full h-auto"
                  style={{
                    maxWidth: "100%",
                    height: "auto",
                  }}
                  priority={false}
                  quality={90}
                  onError={() => setImageError(true)}
                />
              </div>
            ) : (
              /* Fallback UI when image fails to load */
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-6">
                  <svg
                    className="w-12 h-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  조직도 준비 중
                </h3>
                <p className="text-gray-500">
                  조직도 이미지를 불러오는 중 문제가 발생했습니다. 잠시 후 다시
                  시도해 주세요.
                </p>
              </div>
            )}
          </div>

          {/* Additional Information */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-accent-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-primary-900 mb-2">
                전문 인력
              </h3>
              <p className="text-neutral-600">
                숙박업 전문가들로 구성된 체계적인 조직
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-accent-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-primary-900 mb-2">
                체계적 운영
              </h3>
              <p className="text-neutral-600">
                명확한 역할 분담과 효율적인 업무 프로세스
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-accent-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-primary-900 mb-2">
                신속한 대응
              </h3>
              <p className="text-neutral-600">
                고객 요구사항에 빠르고 정확한 대응 체계
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
