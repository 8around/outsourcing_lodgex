'use client';

export function CeoMessage() {
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container-max section-padding">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 
              id="ceo-message-title"
              className="text-3xl md:text-4xl font-bold text-primary-900 mb-4"
            >
              대표자 인사말
            </h2>
            <div className="w-24 h-1 bg-accent-500 mx-auto"></div>
          </div>

          {/* CEO Message Content */}
          <div className="prose prose-lg max-w-none">
            <div 
              className="text-neutral-700 leading-relaxed space-y-6"
              role="article"
              aria-labelledby="ceo-message-title"
            >
              <p className="text-lg font-medium text-primary-800 mb-8">
                Lodgex 호텔 운영 플랫폼은 숙박업·호텔 운영 전문성과 디지털 혁신을 바탕으로 변화하는 관광·레저 산업 환경 속에서 차별화된 솔루션을 제공하고자 합니다.
              </p>
              <p>
                단순한 위탁운영을 넘어 <strong>운영 효율성 제고</strong>,&nbsp;<strong>고객 경험 혁신</strong>, <strong>ESG 경영</strong>, <strong>지역사회 상생</strong>을 핵심 가치로 삼아 숙박업·호텔업이 지속 가능한 성장을 이룰 수 있도록 지원합니다.
              </p>
              <p>
                또한 데이터 분석과 스마트 경영 시스템을 통해 투명하고 체계적인 운영을 실현하며 필요에 따라 <strong>컨설팅</strong>, <strong>위탁운영</strong>, <strong>교육훈련</strong>, <strong>운영 매뉴얼 고도화</strong>까지 종합적인 사업 제공하는 것을 목표로
              </p>
              <p>
                로젝스는 축적된 호텔·리조트 운영 노하우와 성공 사례를 바탕으로 고객과 함께 성장하는 신뢰받는 파트너로 자리매김하고 있습니다.
              </p>
              <p className="text-lg font-semibold text-primary-800 mt-8 mb-4">
                앞으로도 <span className="text-accent-600 font-bold">"비즈니스 수익률 향상과 브랜드 가치 성장"</span>이라는 비전을 품고 대한민국 숙박산업의 경쟁력 강화와 지역 관광 활성화에 기여하는 선도 기업으로 나가겠습니다.
              </p>
              <p className="text-right text-neutral-600 font-medium mt-8">
                감사합니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}