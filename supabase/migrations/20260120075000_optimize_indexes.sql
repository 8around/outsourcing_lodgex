-- ============================================================
-- Migration: 인덱스 최적화
-- Description: 게시글 목록 조회 성능 개선 및 미사용 인덱스 정리
-- ============================================================

-- 1. 미사용 인덱스 제거
-- Supabase Advisor에서 미사용으로 보고됨
DROP INDEX IF EXISTS idx_posts_tags;
DROP INDEX IF EXISTS idx_posts_views;

-- 2. 게시글 목록 조회용 복합 인덱스 추가
-- 사용 케이스:
--   SELECT * FROM posts
--   WHERE post_type = 'insights' AND status = 'published'
--   ORDER BY date DESC
CREATE INDEX IF NOT EXISTS idx_posts_listing
ON posts(post_type, status, date DESC);

-- ============================================================
-- 변경 요약:
-- 1. idx_posts_tags 제거 (태그 검색 기능 미사용)
-- 2. idx_posts_views 제거 (views 정렬 쿼리 미사용)
-- 3. idx_posts_listing 복합 인덱스 추가 (목록 조회 최적화)
-- ============================================================
