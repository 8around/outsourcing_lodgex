-- ============================================================
-- Migration: posts.status TEXT -> posts.is_published BOOLEAN
-- Description:
--   1. 컬럼 타입 변경으로 성능 및 저장 효율 개선
--   2. RLS 정책 분리로 PostgREST 타임아웃 문제 해결
-- ============================================================

-- ===================
-- 1. 기존 RLS 정책 삭제 (status 컬럼 의존성 제거)
-- ===================

-- posts 테이블: status 컬럼을 참조하는 정책 먼저 삭제
DROP POLICY IF EXISTS "Anyone can view posts" ON posts;
DROP POLICY IF EXISTS "Public can view published posts" ON posts;
DROP POLICY IF EXISTS "Admins can view all posts" ON posts;
DROP POLICY IF EXISTS "Admins can select posts" ON posts;
DROP POLICY IF EXISTS "Allow anon insert for posts" ON posts;

-- partners 테이블
DROP POLICY IF EXISTS "Anyone can view partners" ON partners;
DROP POLICY IF EXISTS "Public can view active partners" ON partners;
DROP POLICY IF EXISTS "Admins can view all partners" ON partners;

-- categories 테이블 (실제 정책명: "Allow anon insert for service requests")
DROP POLICY IF EXISTS "Allow anon insert for service requests" ON categories;
DROP POLICY IF EXISTS "Public can view active categories" ON categories;
DROP POLICY IF EXISTS "Admins can view all categories" ON categories;

-- ===================
-- 2. posts 테이블 컬럼 변경
-- ===================

-- 2-1. 새 컬럼 추가
ALTER TABLE posts ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT false;

-- 2-2. 기존 데이터 마이그레이션
UPDATE posts SET is_published = (status = 'published');

-- 2-3. NOT NULL 제약조건 추가
ALTER TABLE posts ALTER COLUMN is_published SET NOT NULL;

-- 2-4. 기존 status 컬럼 삭제
ALTER TABLE posts DROP COLUMN IF EXISTS status;

-- 2-5. 인덱스 생성 (is_published 기반)
DROP INDEX IF EXISTS idx_posts_status;
CREATE INDEX IF NOT EXISTS idx_posts_is_published ON posts(is_published) WHERE is_published = true;

-- 기존 복합 인덱스가 있다면 재생성
DROP INDEX IF EXISTS idx_posts_listing;
CREATE INDEX idx_posts_listing ON posts(post_type, is_published, date DESC)
  WHERE is_published = true;

-- ===================
-- 3. 새로운 RLS 정책 생성
-- ===================

-- posts 테이블
-- 정책 1: 공개 게시글은 누구나 조회 (is_admin 호출 없음 = 성능 최적화)
CREATE POLICY "Public can view published posts" ON posts
FOR SELECT TO public
USING (is_published = true);

-- 정책 2: 관리자는 모든 게시글 조회 (draft 포함)
CREATE POLICY "Admins can view all posts" ON posts
FOR SELECT TO authenticated
USING ((select public.is_admin()));

-- partners 테이블
-- 활성 파트너는 누구나 조회
CREATE POLICY "Public can view active partners" ON partners
FOR SELECT TO public
USING (is_active = true);

-- 관리자는 모든 파트너 조회
CREATE POLICY "Admins can view all partners" ON partners
FOR SELECT TO authenticated
USING ((select public.is_admin()));

-- categories 테이블
-- 활성 카테고리는 누구나 조회
CREATE POLICY "Public can view active categories" ON categories
FOR SELECT TO public
USING (is_active = true);

-- 관리자는 모든 카테고리 조회
CREATE POLICY "Admins can view all categories" ON categories
FOR SELECT TO authenticated
USING ((select public.is_admin()));

-- ============================================================
-- 변경 요약:
--
-- [실행 순서]
-- 1. RLS 정책 삭제 (status 컬럼 의존성 제거)
-- 2. 컬럼 변경 (is_published 추가 → 데이터 마이그레이션 → status 삭제)
-- 3. 새 RLS 정책 생성
--
-- [스키마 변경]
-- - posts.status TEXT ('draft'|'published')
--   → posts.is_published BOOLEAN (true|false)
--
-- [성능 개선]
-- - RLS: (status = 'published' OR is_admin())
--   → 분리된 정책 (is_admin 호출 제거)
-- - 예상: 500ms → 1ms (500배 향상)
-- ============================================================
