-- ============================================================
-- Migration: RLS 정책 최적화
-- Description: 성능 개선을 위한 RLS 정책 통합 및 auth.uid() 최적화
-- ============================================================

-- 1. is_admin() 함수 최적화
-- auth.uid()를 (select auth.uid())로 변경하여 행별 재평가 방지
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- (select auth.uid())로 감싸서 한 번만 평가되도록 함
  IF (select auth.uid()) IS NULL THEN
    RETURN false;
  END IF;

  RETURN EXISTS (
    SELECT 1 FROM public.admins
    WHERE auth_user_id = (select auth.uid())
  );
END;
$$;

-- 2. posts 테이블 SELECT 정책 통합
-- 기존: 2개의 정책 (Admins can select posts, Allow anon insert for posts)
-- 변경: 1개의 통합 정책

-- 기존 SELECT 정책 삭제
DROP POLICY IF EXISTS "Admins can select posts" ON posts;
DROP POLICY IF EXISTS "Allow anon insert for posts" ON posts;

-- 통합된 단일 SELECT 정책 생성
-- public 역할로 설정하여 모든 사용자(익명 포함)에게 적용
CREATE POLICY "Anyone can view posts" ON posts
FOR SELECT TO public
USING (
  status = 'published'              -- 공개 게시물: 누구나 조회 가능
  OR (select public.is_admin())     -- 관리자: 모든 게시물 조회 가능 (draft 포함)
);

-- 3. posts 테이블 INSERT 정책 최적화
DROP POLICY IF EXISTS "Admins can insert posts" ON posts;

CREATE POLICY "Admins can insert posts" ON posts
FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM admins
    WHERE auth_user_id = (select auth.uid())
  )
);

-- 4. posts 테이블 UPDATE 정책 최적화
DROP POLICY IF EXISTS "Admins can update posts" ON posts;

CREATE POLICY "Admins can update posts" ON posts
FOR UPDATE TO authenticated
USING ((select public.is_admin()))
WITH CHECK ((select public.is_admin()));

-- 5. posts 테이블 DELETE 정책 최적화
DROP POLICY IF EXISTS "Admins can delete posts" ON posts;

CREATE POLICY "Admins can delete posts" ON posts
FOR DELETE TO authenticated
USING ((select public.is_admin()));

-- 6. partners 테이블 다중 SELECT 정책 통합
DROP POLICY IF EXISTS "Admins can view all partners" ON partners;
DROP POLICY IF EXISTS "Anyone can view active partners" ON partners;

CREATE POLICY "Anyone can view partners" ON partners
FOR SELECT TO public
USING (
  is_active = true                  -- 활성 파트너: 누구나 조회 가능
  OR (select public.is_admin())     -- 관리자: 모든 파트너 조회 가능
);

-- ============================================================
-- 변경 요약:
-- 1. is_admin() 함수: auth.uid() 호출 최적화 (N회 → 1회/쿼리)
-- 2. posts SELECT: 2개 정책 → 1개 통합 정책
-- 3. posts INSERT/UPDATE/DELETE: auth.uid() 최적화
-- 4. partners SELECT: 2개 정책 → 1개 통합 정책
-- ============================================================
