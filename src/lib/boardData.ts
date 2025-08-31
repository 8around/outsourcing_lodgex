import { BoardPost, BoardCategory } from '@/types';

// 인사이트 허브 더미 데이터
export const insightsData: BoardPost[] = [
  {
    id: '1',
    title: '2024년 호텔업계 트렌드: 지속가능성과 고객경험의 결합',
    content: '최근 호텔업계는 ESG 경영과 개인화된 고객 경험을 동시에 추구하는 방향으로 진화하고 있습니다...',
    excerpt: '지속가능성과 고객경험이 결합된 새로운 호텔업계 트렌드를 분석하고, 성공적인 적용 방안을 제시합니다.',
    author: '김호텔 컨설턴트',
    date: '2024-01-15',
    category: '시장 분석',
    imageUrl: '/images/insights/sustainability-trend.jpg',
    views: 1250,
    tags: ['지속가능성', 'ESG', '고객경험', '트렌드']
  },
  {
    id: '2',
    title: 'RevPAR 최적화 전략: 데이터 기반 수익관리의 핵심',
    content: 'RevPAR(Revenue Per Available Room) 최적화를 위한 실무적 접근법과 구체적인 실행 전략을 소개합니다...',
    excerpt: '호텔 수익성 향상의 핵심지표인 RevPAR을 데이터 기반으로 최적화하는 실무 전략을 상세히 설명합니다.',
    author: '이수익 전문가',
    date: '2024-01-10',
    category: '수익 관리',
    imageUrl: '/images/insights/revpar-optimization.jpg',
    views: 980,
    tags: ['RevPAR', '수익관리', '데이터분석', '최적화']
  },
  {
    id: '3',
    title: 'OTA 채널 관리의 새로운 패러다임: 직판 전환 전략',
    content: 'OTA 의존도를 줄이고 직접 예약을 늘리는 전략적 채널 관리 방법을 실제 사례와 함께 분석합니다...',
    excerpt: 'OTA 수수료 부담을 줄이면서도 객실 점유율을 유지하는 스마트한 채널 관리 전략을 제시합니다.',
    author: '박마케팅 이사',
    date: '2024-01-05',
    category: '마케팅',
    imageUrl: '/images/insights/ota-strategy.jpg',
    views: 1156,
    tags: ['OTA', '직판전환', '채널관리', '마케팅']
  },
  {
    id: '4',
    title: '포스트 팬데믹 시대의 호텔 운영 혁신',
    content: '코로나19 이후 변화된 고객 니즈와 운영 환경에 맞춘 혁신적인 호텔 운영 방안을 제시합니다...',
    excerpt: '팬데믹 이후 새롭게 대두된 위생, 안전, 유연성 중심의 호텔 운영 혁신 사례를 소개합니다.',
    author: '최운영 매니저',
    date: '2024-01-02',
    category: '운영 혁신',
    imageUrl: '/images/insights/post-pandemic.jpg',
    views: 1420,
    tags: ['팬데믹', '운영혁신', '위생관리', '안전']
  },
  {
    id: '5',
    title: 'AI 기술을 활용한 스마트 호텔 서비스 구현',
    content: '인공지능과 IoT 기술을 활용한 차세대 호텔 서비스 구현 방안과 투자 효과를 분석합니다...',
    excerpt: 'AI 챗봇, 스마트룸, 개인화 추천 등 최신 기술을 활용한 호텔 서비스 혁신 사례를 소개합니다.',
    author: '정기술 전문가',
    date: '2023-12-28',
    category: '기술 혁신',
    imageUrl: '/images/insights/ai-hotel.jpg',
    views: 890,
    tags: ['AI', '스마트호텔', 'IoT', '기술혁신']
  }
];

// 이벤트 & 교육 더미 데이터
export const eventsData: BoardPost[] = [
  {
    id: '101',
    title: '2024 호텔 경영 전략 세미나 - 디지털 전환의 핵심',
    content: '호텔업계의 디지털 전환을 위한 실무 전략과 성공 사례를 공유하는 전문 세미나입니다...',
    excerpt: '디지털 시대에 맞는 호텔 경영 전략과 실무 노하우를 전문가와 함께 학습하는 세미나입니다.',
    author: 'Lodgex 교육팀',
    date: '2024-02-15',
    category: '세미나',
    imageUrl: '/images/events/digital-strategy-seminar.jpg',
    views: 650,
    tags: ['세미나', '디지털전환', '경영전략', '교육']
  },
  {
    id: '102',
    title: '고객 서비스 향상을 위한 실무 워크샵',
    content: '최고 수준의 고객 서비스를 제공하기 위한 실무 기법과 커뮤니케이션 스킬을 배우는 워크샵...',
    excerpt: '고객 만족도 향상을 위한 서비스 기법과 실무 노하우를 체험형 워크샵으로 학습합니다.',
    author: 'Lodgex 교육팀',
    date: '2024-02-08',
    category: '워크샵',
    imageUrl: '/images/events/customer-service-workshop.jpg',
    views: 420,
    tags: ['워크샵', '고객서비스', '커뮤니케이션', '실무교육']
  },
  {
    id: '103',
    title: '호텔 수익 최적화 마스터클래스',
    content: 'Revenue Management의 핵심 원리부터 실제 적용까지, 수익 최적화의 모든 것을 배우는 집중 과정...',
    excerpt: 'RevPAR, ADR, 점유율 최적화를 통한 호텔 수익성 향상의 실무 전략을 마스터하는 과정입니다.',
    author: 'Lodgex 교육팀',
    date: '2024-01-25',
    category: '마스터클래스',
    imageUrl: '/images/events/revenue-masterclass.jpg',
    views: 780,
    tags: ['마스터클래스', '수익관리', 'RevPAR', '최적화']
  },
  {
    id: '104',
    title: '2024년 호텔업계 신년 네트워킹 이벤트',
    content: '호텔업계 전문가들과의 네트워킹을 통해 새로운 비즈니스 기회를 발견하는 신년 이벤트...',
    excerpt: '업계 전문가들과의 네트워킹을 통해 인사이트를 공유하고 비즈니스 기회를 모색하는 이벤트입니다.',
    author: 'Lodgex 기획팀',
    date: '2024-01-18',
    category: '네트워킹',
    imageUrl: '/images/events/networking-event.jpg',
    views: 590,
    tags: ['네트워킹', '신년이벤트', '비즈니스', '교류']
  },
  {
    id: '105',
    title: 'OTA 채널 관리 전문가 과정',
    content: '주요 OTA 플랫폼별 특성과 최적화 전략, 직판 전환 방법까지 OTA 관리의 A to Z를 학습...',
    excerpt: '부킹닷컴, 아고다 등 주요 OTA 플랫폼 관리와 직판 전환 전략을 전문적으로 학습하는 과정입니다.',
    author: 'Lodgex 교육팀',
    date: '2024-01-12',
    category: '전문과정',
    imageUrl: '/images/events/ota-course.jpg',
    views: 340,
    tags: ['전문과정', 'OTA', '채널관리', '직판전환']
  }
];

// 고객 후기 더미 데이터
export const testimonialsData: BoardPost[] = [
  {
    id: '201',
    title: '부산 해운대 호텔 리뉴얼 프로젝트 성공 사례',
    content: 'Lodgex의 컨설팅을 통해 20년된 호텔을 현대적이고 경쟁력 있는 호텔로 완전히 변모시켰습니다...',
    excerpt: 'RevPAR 35% 향상, 고객 만족도 4.2점으로 상승한 부산 해운대 호텔의 성공적인 리뉴얼 스토리입니다.',
    author: '해운대 오션뷰 호텔 김대표',
    date: '2024-01-20',
    category: '리뉴얼',
    imageUrl: '/images/testimonials/busan-hotel-renewal.jpg',
    views: 820,
    tags: ['리뉴얼', 'RevPAR향상', '성공사례', '부산']
  },
  {
    id: '202',
    title: '서울 강남 비즈니스호텔 운영 효율화 성과',
    content: 'Lodgex의 운영 컨설팅을 통해 인력 효율성 25% 향상과 고객 서비스 품질 개선을 동시에 달성...',
    excerpt: '운영비 절감과 서비스 품질 향상을 동시에 달성한 강남 비즈니스호텔의 운영 효율화 성공 사례입니다.',
    author: '강남 비즈니스호텔 박사장',
    date: '2024-01-15',
    category: '운영 개선',
    imageUrl: '/images/testimonials/gangnam-business-hotel.jpg',
    views: 640,
    tags: ['운영효율화', '비용절감', '서비스품질', '강남']
  },
  {
    id: '203',
    title: '제주 리조트 마케팅 전략 수립 성과',
    content: '온오프라인 통합 마케팅 전략을 통해 객실 점유율 15% 증가와 브랜드 인지도 향상을 달성했습니다...',
    excerpt: 'SNS 마케팅과 OTA 최적화를 통해 젊은 고객층 유입을 크게 늘린 제주 리조트의 마케팅 성공 사례입니다.',
    author: '제주 선셋리조트 최지배인',
    date: '2024-01-10',
    category: '마케팅',
    imageUrl: '/images/testimonials/jeju-resort-marketing.jpg',
    views: 750,
    tags: ['마케팅전략', '점유율증가', 'SNS마케팅', '제주']
  },
  {
    id: '204',
    title: '경주 한옥호텔 브랜드 포지셔닝 성공 스토리',
    content: '전통과 현대의 조화를 통한 독특한 브랜드 포지셔닝으로 외국인 관광객 증가 40%를 달성...',
    excerpt: '한국 전통 문화를 현대적으로 재해석한 브랜드 전략으로 외국인 고객들에게 큰 호응을 얻은 성공 사례입니다.',
    author: '경주 한옥스테이 정대표',
    date: '2024-01-05',
    category: '브랜딩',
    imageUrl: '/images/testimonials/gyeongju-hanok-hotel.jpg',
    views: 920,
    tags: ['브랜드포지셔닝', '외국인고객', '전통문화', '경주']
  },
  {
    id: '205',
    title: '인천공항 근처 호텔 수익성 개선 프로젝트',
    content: 'Lodgex의 수익관리 컨설팅을 통해 GOP 마진 12% 개선과 운영 효율성을 크게 향상시켰습니다...',
    excerpt: '공항 호텔의 특성을 활용한 맞춤형 수익관리 전략으로 수익성을 크게 개선한 성공 사례입니다.',
    author: '인천에어포트호텔 이사장',
    date: '2023-12-30',
    category: '수익 개선',
    imageUrl: '/images/testimonials/incheon-airport-hotel.jpg',
    views: 560,
    tags: ['수익개선', 'GOP향상', '공항호텔', '인천']
  },
  {
    id: '206',
    title: '대구 도심호텔 디지털 전환 프로젝트 후기',
    content: '모바일 체크인, AI 챗봇 도입 등 디지털 전환을 통해 고객 만족도와 운영 효율성을 동시에 향상...',
    excerpt: '디지털 기술 도입으로 고객 경험을 혁신하고 운영 효율성을 크게 개선한 대구 도심호텔의 성공 사례입니다.',
    author: '대구센트럴호텔 윤부사장',
    date: '2023-12-25',
    category: '디지털 전환',
    imageUrl: '/images/testimonials/daegu-digital-hotel.jpg',
    views: 480,
    tags: ['디지털전환', 'AI챗봇', '모바일체크인', '대구']
  }
];

// 카테고리 데이터
export const insightsCategories: BoardCategory[] = [
  { id: 'all', name: '전체', postCount: insightsData.length },
  { id: 'market-analysis', name: '시장 분석', postCount: 1 },
  { id: 'revenue-management', name: '수익 관리', postCount: 1 },
  { id: 'marketing', name: '마케팅', postCount: 1 },
  { id: 'operation-innovation', name: '운영 혁신', postCount: 1 },
  { id: 'tech-innovation', name: '기술 혁신', postCount: 1 }
];

export const eventsCategories: BoardCategory[] = [
  { id: 'all', name: '전체', postCount: eventsData.length },
  { id: 'seminar', name: '세미나', postCount: 1 },
  { id: 'workshop', name: '워크샵', postCount: 1 },
  { id: 'masterclass', name: '마스터클래스', postCount: 1 },
  { id: 'networking', name: '네트워킹', postCount: 1 },
  { id: 'course', name: '전문과정', postCount: 1 }
];

export const testimonialsCategories: BoardCategory[] = [
  { id: 'all', name: '전체', postCount: testimonialsData.length },
  { id: 'renewal', name: '리뉴얼', postCount: 1 },
  { id: 'operation', name: '운영 개선', postCount: 1 },
  { id: 'marketing', name: '마케팅', postCount: 1 },
  { id: 'branding', name: '브랜딩', postCount: 1 },
  { id: 'revenue', name: '수익 개선', postCount: 1 },
  { id: 'digital', name: '디지털 전환', postCount: 1 }
];

// 게시판 타입별 데이터 매핑
export const getBoardData = (boardType: 'insights' | 'events' | 'testimonials') => {
  switch (boardType) {
    case 'insights':
      return { posts: insightsData, categories: insightsCategories };
    case 'events':
      return { posts: eventsData, categories: eventsCategories };
    case 'testimonials':
      return { posts: testimonialsData, categories: testimonialsCategories };
    default:
      return { posts: [], categories: [] };
  }
};