// Application Constants

export const COMPANY_INFO = {
  name: 'Lodgex',
  fullName: 'Lodgex 호텔 위탁운영 & 컨설팅',
  description:
    '프리미엄 호텔 위탁운영 및 전문 컨설팅 서비스를 통해 호텔의 가치를 극대화합니다.',
  philosophy:
    '최고 수준의 호스피탈리티로 고객의 성공을 지원하며, 혁신적인 솔루션을 통해 숙박업의 새로운 기준을 제시합니다.',
  ceo: '이대성',
  businessNumber: '220-88-73309',
  mailOrderSalesNumber: '서울강남-00430',
  phone: '080-727-8899',
  email: 'sjds77@naver.com',
  address: '서울특별시 송파구 송파대로 28길 13, 거북이빌딩 3층',
  established: '2020',
} as const;

export const SOCIAL_LINKS = {
  linkedin: '#',
  instagram: '#',
  facebook: '#',
  youtube: '#',
} as const;

export const ROUTES = {
  HOME: '/',
  SERVICES: '/services',
  PORTFOLIO: '/portfolio',
  ABOUT: '/about',
  CONTACT: '/contact',
  FAQ: '/faq',
  NEWS: '/news',
  CAREERS: '/careers',
  PRIVACY: '/privacy',
  TERMS: '/terms',
} as const;

export const SERVICE_CATEGORY_IDS = {
  MANAGEMENT: 'management',
  CONSULTING: 'consulting',
  FNB: 'fnb',
  MARKETING: 'marketing',
} as const;

export const CONTACT_SUBJECTS = [
  '위탁운영 문의',
  '컨설팅 문의',
  'F&B 관리 문의',
  '마케팅 지원 문의',
  '기타 문의',
] as const;

export const BREAKPOINTS = {
  SM: '640px',
  MD: '768px',
  LG: '1024px',
  XL: '1280px',
  '2XL': '1536px',
} as const;

export const ANIMATION_DURATION = {
  FAST: '150ms',
  NORMAL: '200ms',
  SLOW: '300ms',
} as const;

export const API_ENDPOINTS = {
  CONTACT: '/api/contact',
  NEWSLETTER: '/api/newsletter',
  PORTFOLIO: '/api/portfolio',
} as const;

export const CONSULTING_STEPS = [
  {
    step: 1,
    title: '운영 진단 신청',
    description:
      '숙박업(관광호텔, 중소형호텔, 리조트, 일반호텔) 현황과 개선 요구사항을 파악하여 맞춤형 진단 계획을 수립합니다.',
    icon: '📋',
  },
  {
    step: 2,
    title: '전문가 매칭',
    description: '숙박업(관광호텔, 중소형호텔, 리조트, 일반호텔) 규모와 특성에 맞는 전문 컨설턴트를 배정합니다.',
    icon: '👥',
  },
  {
    step: 3,
    title: '분석 & 컨설팅 진행',
    description: '현장 방문을 통해 운영 실태를 분석하고 개선하여 체게적인 운영시스템을 도입하고 숙박업 전반의 손익구조를 개선합니다.',
    icon: '🔍',
  },
  {
    step: 4,
    title: '개선안 제시 및 성과 관리',
    description:
      '구체적인 실행 계획과 함께 지속적인 성과 모니터링을 제공합니다.',
    icon: '📈',
  },
] as const;

export const SERVICE_CATEGORIES = {
  MANAGEMENT: {
    id: 'management',
    title: '숙박업 위탁 운영',
    description:
      '전문성과 경험을 바탕으로 숙박업 운영 전반을 체계적으로 관리합니다.',
    icon: '🏨',
    services: [
      {
        title: '객실 운영',
        description:
          '체크인/아웃 프로세스 최적화, 하우스키핑 품질 관리, 고객 만족도 향상',
      },
      {
        title: '식음 부문 운영 (F&B Management)',
        description:
          '레스토랑·바·연회 운영, 메뉴 개발, 원가 관리 및 수익성 개선',
      },
      {
        title: '인사관리 및 운영 인력 배치',
        description: '효율적인 인력 운영, 교육 훈련, 근무 스케줄 최적화',
      },
      {
        title: '예산 및 수익관리 (Finance & Profitability)',
        description: 'RevPAR 개선, 비용 통제, 수익성 분석 및 예산 관리',
      },
    ],
  },
  CONSULTING: {
    id: 'consulting',
    title: '숙박업 경영 컨설팅',
    description:
      '전략적 관점에서 숙박업의 경쟁력을 강화하고 브랜드 가치를 제고합니다.',
    icon: '💼',
    services: [
      {
        title: '브랜드 포지셔닝 전략 수립',
        description:
          '시장 분석, 타겟 고객 정의, 브랜드 개성 설정 및 포지셔닝 전략 개발',
      },
      {
        title: 'OTA(온라인 여행사) 성과 관리',
        description: '채널별 최적화, 가격 전략, 리뷰 관리 및 노출 순위 개선',
      },
      {
        title: '온·오프라인 통합 마케팅 기획',
        description:
          '고객 여정 기반 마케팅 전략, SNS 콘텐츠 기획, 데이터 기반 성과 관리',
      },
      {
        title: '고객 타겟 중심 캠페인 실행',
        description: '세분화된 고객 타겟별 맞춤 캠페인 기획 및 실행',
      },
    ],
  },
  ORGANIZATION: {
    id: 'organization',
    title: '직무 및 조직 컨설팅',
    description:
      '조직 효율성을 높이고 서비스 품질을 표준화하여 운영 역량을 강화합니다.',
    icon: '🏢',
    services: [
      {
        title: '부서별 조직 진단 및 재편',
        description: '인력 효율성 분석, 업무 프로세스 개선, 조직구조 최적화',
      },
      {
        title: '운영 매뉴얼 구축 및 표준화: NCS 활용',
        description: '국가직무능력표준 기반 매뉴얼 개발, 서비스 표준화',
      },
      {
        title: '서비스 프로세스 정비',
        description:
          '고객 여정 맵 작성, 서비스 병목 개선, 표준 응대 스크립트 구축',
      },
      {
        title: 'KPI 기반 직무 성과 설계',
        description: '직무별 핵심성과지표 설정, 성과 측정 시스템 구축',
      },
    ],
  },
  TRAINING: {
    id: 'training',
    title: '교육훈련 솔루션',
    description:
      '체계적인 교육 프로그램을 통해 서비스 품질과 직원 역량을 동시에 향상시킵니다.',
    icon: '🎓',
    services: [
      {
        title: '신입사원 온보딩교육',
        description: '기본 CS 교육, 직무별 실무 교육, 조직 적응 프로그램',
      },
      {
        title: '경력자 직무 전문교육',
        description: '부서별 심화 교육, 관리자 역량 강화, 리더십 개발',
      },
      {
        title: '고객응대 및 서비스 품질 향상 훈련',
        description: '서비스 매너, 불만 응대, 고객 만족도 개선 교육',
      },
      {
        title: '관리자 리더십 및 코칭 스킬 향상',
        description: '팀 리딩 스킬, 갈등 관리, 성과 코칭 교육',
      },
    ],
  },
  EVALUATION_CONSULTING: {
    id: 'evaluation_consulting',
    title: '호텔등급심사 준비 컨설팅',
    description:
      '호텔 등급심사 준비를 위한 전문 컨설팅으로 심사 기준 충족과 성공적인 등급 획득을 지원합니다.',
    icon: '⭐',
    services: [
      {
        title: '등급별 심사 기준 전문 컨설팅',
        description:
          '호텔 등급별 심사 기준에 따른 유경험 전문 컨설턴트 방문 컨설팅',
      },
      {
        title: '모의심사 시뮬레이션',
        description:
          '체크리스트 및 모의심사 시뮬레이션 기반 컨설팅',
      },
      {
        title: '심사 대응 매뉴얼 및 교육',
        description:
          '심사 대응 매뉴얼 및 현장 교육 프로그램 제공',
      },
    ],
  },
} as const;

export const CONSULTING_SERVICE_OPTIONS = [
  '숙박업 개발',
  '숙박업 오픈 준비 및 운영 마스터 플랜',
  '숙박업 위탁운영',
  '숙박업 경영컨설팅',
  '호텔등급심사 준비 컨설팅',
  '직무 운영 매뉴얼·조직 컨설팅',
  '교육훈련',
  '웨딩 개발',
] as const;
