-- Storage 버킷 생성 스크립트
-- 생성일: 2025-10-21
--
-- 이 파일은 schema_dump.sql 실행 후에 실행해야 합니다.
--
-- 버킷 정보:
-- - images: 이미지 파일 저장 (최대 5MB, JPEG/PNG/GIF/WebP만 허용)
-- - documents: 문서 파일 저장 (최대 50MB, 모든 파일 타입 허용)

-- images 버킷 생성
INSERT INTO storage.buckets (id, name, owner, created_at, updated_at, public, avif_autodetection, file_size_limit, allowed_mime_types, owner_id, type)
VALUES (
    'images',
    'images',
    NULL,
    now(),
    now(),
    true,
    false,
    5242880,  -- 5MB
    '{image/jpeg,image/jpg,image/png,image/gif,image/webp}',
    NULL,
    'STANDARD'::storage.buckettype
);

-- documents 버킷 생성
INSERT INTO storage.buckets (id, name, owner, created_at, updated_at, public, avif_autodetection, file_size_limit, allowed_mime_types, owner_id, type)
VALUES (
    'documents',
    'documents',
    NULL,
    now(),
    now(),
    true,
    false,
    52428800,  -- 50MB
    NULL,  -- 모든 파일 타입 허용
    NULL,
    'STANDARD'::storage.buckettype
);

drop extension if exists "pg_net";


  create policy "Admin can manage documents"
  on "storage"."objects"
  as permissive
  for all
  to authenticated
using (((bucket_id = 'documents'::text) AND public.is_admin()))
with check (((bucket_id = 'documents'::text) AND public.is_admin()));



  create policy "Admin can manage images"
  on "storage"."objects"
  as permissive
  for all
  to authenticated
using (((bucket_id = 'images'::text) AND public.is_admin()))
with check (((bucket_id = 'images'::text) AND public.is_admin()));



  create policy "Public read access for documents"
  on "storage"."objects"
  as permissive
  for select
  to public
using ((bucket_id = 'documents'::text));



  create policy "Public read access for images"
  on "storage"."objects"
  as permissive
  for select
  to public
using ((bucket_id = 'images'::text));



