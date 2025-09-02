# LodgeX Hotel Consulting - 계층형 데이터베이스 스키마

## 📋 계층 구조
```
게시판 타입 (post_type)
  └── 카테고리 (categories)
      └── 게시글 (posts)
```

## 🗂️ 테이블 구조 (4개 테이블)

### 1. admins (관리자 테이블)
```sql
-- Supabase Auth와 연동된 관리자 테이블
CREATE TABLE admins (
  id SERIAL PRIMARY KEY,                    -- 관리자 고유 식별자 (자동 증가 정수)
  login_id TEXT NOT NULL UNIQUE,            -- 관리자 로그인 아이디 (이메일)
  password TEXT NOT NULL,                   -- 레거시 비밀번호 (사용 안 함)
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,  -- Supabase Auth 사용자 ID
  email TEXT UNIQUE,                        -- 관리자 이메일 주소
  last_login_at TIMESTAMPTZ,                -- 마지막 로그인 시간, 관리자 활동 추적용
  created_at TIMESTAMPTZ DEFAULT NOW()       -- 관리자 계정 생성 일시
);

-- 인덱스
CREATE INDEX idx_admins_auth_user_id ON admins(auth_user_id);
CREATE INDEX idx_admins_email ON admins(email);
```

### 2. categories (카테고리 테이블)
```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),  -- 카테고리 고유 식별자 (UUID)
  name TEXT NOT NULL,                             -- 카테고리 이름 (예: '시장 분석', '세미나' 등)
  post_type TEXT NOT NULL CHECK (post_type IN ('insights', 'events', 'testimonials')),  -- 게시판 타입, 카테고리가 속한 게시판 결정
  description TEXT,                               -- 카테고리에 대한 선택적 설명
  display_order INTEGER DEFAULT 0,                -- 카테고리 표시 순서를 결정하는 정렬값
  is_active BOOLEAN DEFAULT true,                 -- 카테고리 활성화 여부, false면 프론트엔드 미표시
  created_at TIMESTAMPTZ DEFAULT NOW(),           -- 카테고리 생성 일시
  updated_at TIMESTAMPTZ DEFAULT NOW(),           -- 카테고리 수정 일시
  
  -- 복합 유니크 제약 (같은 post_type 내에서 카테고리명 중복 방지)
  UNIQUE(post_type, name)
);

-- 인덱스
CREATE INDEX idx_categories_type ON categories(post_type);
CREATE INDEX idx_categories_order ON categories(display_order);
```

### 3. posts (게시글 테이블)
```sql
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),    -- 게시글 고유 식별자 (UUID)
  
  -- 기본 정보
  title TEXT NOT NULL,                              -- 게시글 제목
  content TEXT NOT NULL,                            -- 게시글 본문 내용 (HTML 포함 가능)
  excerpt TEXT,                                     -- 게시글 요약 또는 미리보기 텍스트
  image_url TEXT,                                   -- 대표 이미지 URL 경로 (featured_image -> image_url로 통일)
  
  -- 분류 (계층 구조)
  post_type TEXT NOT NULL CHECK (post_type IN ('insights', 'events', 'testimonials')),  -- 게시판 타입, 게시글이 속한 게시판 결정
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,                         -- 게시글이 속한 카테고리 참조 (categories 테이블과 연결)
  tags TEXT[],                                                                          -- 게시글 태그 배열, 자유로운 분류 가능
  
  -- 날짜
  date TIMESTAMPTZ NOT NULL DEFAULT NOW(),          -- 게시글 발행일, 프론트엔드 표시 기준일 (published_at -> date로 통일)
  
  -- 고객 후기 전용 필드
  client_name TEXT,                                 -- 고객 이름
  client_company TEXT,                              -- 고객 소속 회사명
  client_position TEXT,                             -- 고객 직책
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),  -- 만족도 평점 (1-5점)
  
  -- 상태 및 통계
  status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published')),  -- 게시글 상태, 공개 여부 결정
  views INTEGER DEFAULT 0,                          -- 게시글 조회수 카운터
  
  created_at TIMESTAMPTZ DEFAULT NOW(),             -- 게시글 생성 일시
  updated_at TIMESTAMPTZ DEFAULT NOW()              -- 게시글 수정 일시
);

-- 인덱스
CREATE INDEX idx_posts_type ON posts(post_type);
CREATE INDEX idx_posts_category ON posts(category_id);
CREATE INDEX idx_posts_tags ON posts USING gin(tags);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_date ON posts(date DESC);
CREATE INDEX idx_posts_views ON posts(views DESC);
```

### 4. service_requests (서비스 신청 테이블)
```sql
CREATE TABLE service_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),    -- 신청 고유 식별자 (UUID)
  
  -- 신청자 정보
  company_name TEXT NOT NULL,                       -- 신청 기업명
  company_type TEXT NOT NULL,                       -- 기업 유형 (호텔, 리조트 등)
  contact_person TEXT NOT NULL,                     -- 담당자 이름
  position TEXT,                                    -- 담당자 직책
  email TEXT NOT NULL,                              -- 연락용 이메일 주소
  phone TEXT NOT NULL,                              -- 연락용 전화번호
  
  -- 서비스 정보
  service_type TEXT NOT NULL,                       -- 신청한 서비스 종류
  consulting_areas TEXT[],                          -- 컨설팅 희망 분야 배열
  
  -- 상세 내용
  current_challenges TEXT,                          -- 현재 겪고 있는 문제점이나 도전과제
  desired_outcomes TEXT,                            -- 컨설팅을 통해 달성하고자 하는 목표
  message TEXT,                                     -- 추가 메시지나 요청사항
  
  -- 상태 관리
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'in_progress', 'completed')),  -- 처리 상태
  
  -- 처리 정보 (외래키 제약 없음 - admins 테이블 구조가 다름)
  processed_by UUID,                                -- 처리한 관리자 ID (참조)
  processed_at TIMESTAMPTZ,                         -- 처리 완료 시간
  admin_notes TEXT,                                 -- 관리자가 작성한 내부 메모
  
  created_at TIMESTAMPTZ DEFAULT NOW(),             -- 신청 생성 일시
  updated_at TIMESTAMPTZ DEFAULT NOW()              -- 신청 수정 일시
);

-- 인덱스
CREATE INDEX idx_service_requests_status ON service_requests(status);
CREATE INDEX idx_service_requests_created ON service_requests(created_at DESC);
```

## 🔐 Row Level Security (RLS) 정책

### admins 테이블
```sql
-- RLS 활성화
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- 관리자만 admins 테이블 조회 가능
CREATE POLICY "Admins can view admin users" 
  ON admins FOR SELECT 
  TO authenticated
  USING (public.is_admin());

-- 관리자만 admins 테이블 수정 가능
CREATE POLICY "Admins can update admin users" 
  ON admins FOR UPDATE 
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());
```

### categories 테이블
```sql
-- 모든 사용자가 활성 카테고리 조회 가능
CREATE POLICY "Anyone can view active categories" 
  ON categories FOR SELECT 
  USING (is_active = true);

-- 관리자만 카테고리 생성/수정/삭제 가능
CREATE POLICY "Admins can insert categories" 
  ON categories FOR INSERT 
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update categories" 
  ON categories FOR UPDATE 
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete categories" 
  ON categories FOR DELETE 
  TO authenticated
  USING (public.is_admin());
```

### posts 테이블
```sql
-- 모든 사용자가 게시된 포스트 조회 가능
CREATE POLICY "Anyone can view published posts" 
  ON posts FOR SELECT 
  USING (status = 'published');

-- 관리자는 모든 포스트 조회 가능 (draft 포함)
CREATE POLICY "Admins can view all posts" 
  ON posts FOR SELECT 
  TO authenticated
  USING (public.is_admin());

-- 관리자만 포스트 생성/수정/삭제 가능
CREATE POLICY "Admins can insert posts" 
  ON posts FOR INSERT 
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update posts" 
  ON posts FOR UPDATE 
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete posts" 
  ON posts FOR DELETE 
  TO authenticated
  USING (public.is_admin());
```

### service_requests 테이블
```sql
-- 누구나 서비스 요청 생성 가능
CREATE POLICY "Anyone can create service requests" 
  ON service_requests FOR INSERT 
  WITH CHECK (true);

-- 관리자만 서비스 요청 조회/수정/삭제 가능
CREATE POLICY "Admins can view service requests" 
  ON service_requests FOR SELECT 
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admins can update service requests" 
  ON service_requests FOR UPDATE 
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete service requests" 
  ON service_requests FOR DELETE 
  TO authenticated
  USING (public.is_admin());
```

## 🔄 트리거 및 함수

### 자동 업데이트 타임스탬프
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 트리거 적용 (admins 테이블 제외 - updated_at 컬럼 없음)
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_service_requests_updated_at BEFORE UPDATE ON service_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 관리자 확인 함수
```sql
-- Supabase Auth 사용자가 관리자인지 확인하는 함수
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admins 
    WHERE auth_user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 조회수 증가 함수
```sql
CREATE OR REPLACE FUNCTION increment_view_count(post_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE posts 
  SET views = views + 1 
  WHERE id = post_id;
END;
$$ language 'plpgsql' SECURITY DEFINER;
```

### 카테고리 유효성 검증 트리거
```sql
CREATE OR REPLACE FUNCTION validate_post_category()
RETURNS TRIGGER AS $$
BEGIN
  -- 게시글의 post_type과 카테고리의 post_type이 일치하는지 확인
  IF NEW.category_id IS NOT NULL THEN
    IF NOT EXISTS (
      SELECT 1 FROM categories 
      WHERE id = NEW.category_id 
      AND post_type = NEW.post_type
    ) THEN
      RAISE EXCEPTION 'Category post_type must match post post_type';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER validate_post_category_trigger
BEFORE INSERT OR UPDATE ON posts
FOR EACH ROW EXECUTE FUNCTION validate_post_category();
```

## 💾 초기 데이터

### 관리자 계정 생성
```sql
-- 자체 인증 시스템으로 관리자 생성 (bcrypt 해시 사용)
-- 예시: 비밀번호 'admin123'을 bcrypt로 해시화
INSERT INTO admins (login_id, password) VALUES
  ('admin', crypt('admin123', gen_salt('bf')));
```

### 기본 카테고리
```sql
-- 인사이트 카테고리
INSERT INTO categories (name, post_type, display_order) VALUES
  ('시장 분석', 'insights', 1),
  ('수익 관리', 'insights', 2),
  ('마케팅', 'insights', 3),
  ('운영 혁신', 'insights', 4),
  ('기술 혁신', 'insights', 5);

-- 이벤트 카테고리
INSERT INTO categories (name, post_type, display_order) VALUES
  ('세미나', 'events', 1),
  ('워크샵', 'events', 2),
  ('마스터클래스', 'events', 3),
  ('네트워킹', 'events', 4),
  ('전문과정', 'events', 5);

-- 고객 후기 카테고리
INSERT INTO categories (name, post_type, display_order) VALUES
  ('리뉴얼', 'testimonials', 1),
  ('운영 개선', 'testimonials', 2),
  ('마케팅', 'testimonials', 3),
  ('브랜딩', 'testimonials', 4),
  ('수익 개선', 'testimonials', 5),
  ('디지털 전환', 'testimonials', 6);
```

### 샘플 게시글
```sql
-- 인사이트 게시글
INSERT INTO posts (
  title, 
  content,
  excerpt,
  post_type,
  category_id,
  tags,
  image_url,
  status,
  date
) VALUES (
  '2024년 호텔업계 트렌드: 지속가능성과 고객경험의 결합',
  '콘텐츠 내용...',
  '지속가능성과 고객경험이 결합된 새로운 호텔업계 트렌드를 분석합니다.',
  'insights',
  (SELECT id FROM categories WHERE name = '시장 분석' AND post_type = 'insights'),
  ARRAY['지속가능성', 'ESG', '고객경험'],
  '/images/insights/sustainability-trend.jpg',
  'published',
  NOW()
);

-- 이벤트 게시글
INSERT INTO posts (
  title,
  content,
  excerpt,
  post_type,
  category_id,
  tags,
  status,
  date
) VALUES (
  '2024 호텔 경영 전략 세미나',
  '세미나 상세 내용...',
  '디지털 시대에 맞는 호텔 경영 전략을 배우는 세미나입니다.',
  'events',
  (SELECT id FROM categories WHERE name = '세미나' AND post_type = 'events'),
  ARRAY['세미나', '디지털전환', '경영전략'],
  'published',
  NOW()
);

-- 고객 후기 게시글
INSERT INTO posts (
  title,
  content,
  excerpt,
  post_type,
  category_id,
  tags,
  client_name,
  client_company,
  rating,
  status,
  date
) VALUES (
  '부산 해운대 호텔 리뉴얼 프로젝트 성공 사례',
  '성공 사례 상세 내용...',
  'RevPAR 35% 향상, 고객 만족도 4.2점으로 상승한 성공 스토리입니다.',
  'testimonials',
  (SELECT id FROM categories WHERE name = '리뉴얼' AND post_type = 'testimonials'),
  ARRAY['리뉴얼', 'RevPAR향상', '성공사례'],
  '김철수',
  '해운대 오션뷰 호텔',
  5,
  'published',
  NOW()
);
```

## 🔍 주요 쿼리 예시

### 특정 타입의 게시글 조회 (카테고리 포함)
```sql
SELECT 
  p.*,
  c.name as category_name
FROM posts p
LEFT JOIN categories c ON p.category_id = c.id
WHERE p.post_type = 'insights'
  AND p.status = 'published'
ORDER BY p.date DESC;
```

### 카테고리별 게시글 수 조회
```sql
SELECT 
  c.id,
  c.name,
  c.post_type,
  COUNT(p.id) as post_count
FROM categories c
LEFT JOIN posts p ON c.id = p.category_id AND p.status = 'published'
WHERE c.is_active = true
GROUP BY c.id, c.name, c.post_type
ORDER BY c.post_type, c.display_order;
```

### 인기 태그 조회
```sql
SELECT 
  unnest(tags) as tag,
  COUNT(*) as usage_count
FROM posts
WHERE status = 'published'
GROUP BY tag
ORDER BY usage_count DESC
LIMIT 20;
```

## 📊 계층 구조 설명

### 1. **게시판 타입 (post_type)**
- `insights` - 인사이트 허브
- `events` - 이벤트 & 교육
- `testimonials` - 고객 후기

### 2. **카테고리 (categories)**
각 post_type별로 고유한 카테고리 세트:
- **insights**: 시장 분석, 수익 관리, 마케팅, 운영 혁신, 기술 혁신
- **events**: 세미나, 워크샵, 마스터클래스, 네트워킹, 전문과정
- **testimonials**: 리뉴얼, 운영 개선, 마케팅, 브랜딩, 수익 개선, 디지털 전환

### 3. **게시글 (posts)**
- 각 게시글은 하나의 post_type에 속함
- 해당 post_type의 카테고리 중 하나를 선택
- 자유로운 태그 추가 가능

## ⚠️ 중요 사항

1. **인증 시스템**: 
   - Supabase Auth를 사용하지 않고 자체 토큰 시스템 사용
   - admins 테이블과 verify_admin_password() 함수로 인증
   - localStorage에 adminSession 저장 (24시간 만료)

2. **보안 이슈 (검토 필요)**:
   - categories/posts 테이블의 RLS 정책이 anon 역할에도 INSERT/UPDATE/DELETE 허용
   - 관리자 전용 기능에 대한 추가 보안 검증 필요

3. **카테고리 무결성**: 게시글의 post_type과 카테고리의 post_type이 일치해야 함

4. **필드명 통일**: 프론트엔드 코드와 일치하도록 필드명 조정
   - `featured_image` → `image_url`
   - `published_at` → `date`

5. **조회수 관리**: views 필드 추가 및 increment_view_count() 함수 제공

6. **계층 구조**: post_type → categories → posts의 명확한 계층 관계

7. **이벤트 필드 제거**: 이벤트 전용 필드(event_date, event_location 등)는 제거되었으며, events 게시판도 일반 게시물처럼 관리