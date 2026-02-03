"use client";

import { useState, useEffect } from "react";
import { publicPartnersService } from "@/services/partners";
import { Partner } from "@/types";

export function PartnersSection() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const partnersData = await publicPartnersService.getActivePartners();
        setPartners(partnersData);
      } catch (error) {
        console.error("파트너사 목록 조회 중 오류:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, []);

  // 파트너사가 없으면 섹션을 렌더링하지 않음
  if (loading || partners.length === 0) {
    return null;
  }

  return (
    !loading &&
    partners.length > 0 ? (
      <section className="py-16 bg-neutral-50" aria-labelledby="partners-title">
        <div className="container-max section-padding">
          <div className="text-center mb-12">
            <h3
              id="partners-title"
              className="font-sans font-semibold text-neutral-800 mb-4"
            >
              파트너사
            </h3>
            <p className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed">
              SoUHGM과 협력하고 있는 파트너사를 소개합니다.
            </p>
          </div>

          {/* 파트너사 로고 목록 */}
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-10 lg:gap-12">
            {partners.map((partner) => (
              <div
                key={partner.id}
                className="flex items-center justify-center max-w-32 md:max-w-40"
                role="img"
                aria-label={`${partner.name} 로고`}
              >
                {partner.image_url ? (
                  <img
                    src={partner.image_url}
                    alt={`${partner.name} 로고`}
                    className="h-12 md:h-16 w-auto max-w-full object-contain transition-transform duration-300 hover:scale-105" // opacity-60 hover:opacity-100 filter grayscale hover:grayscale-0"
                    loading="lazy"
                  />
                ) : (
                  <div className="h-12 md:h-16 w-full max-w-32 md:max-w-40 bg-neutral-200 rounded-lg flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity duration-300">
                    <span className="text-sm md:text-base font-medium text-neutral-600 text-center px-2 break-words">
                      {partner.name}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    ) : null
  );
}
