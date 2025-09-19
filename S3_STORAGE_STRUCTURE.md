# LodgeX Hotel Consulting - Supabase Storage 구조

## 📋 개요

Supabase Storage를 활용한 파일 관리 시스템으로, 이미지와 문서 파일을 안전하게 저장하고 관리합니다.

## 🗂️ Storage 버킷 구조

### 1. images 버킷
```yaml
버킷 ID: images
이름: images
공개 설정: true (공개 읽기 가능)
파일 크기 제한: 5,242,880 bytes (5MB)
허용 MIME 타입:
  - image/jpeg
  - image/png
  - image/gif
  - image/webp
생성일: 2025-09-19 08:27:29 UTC
```

**용도**: 게시글 이미지, 파트너사 로고 등 웹사이트에서 사용되는 모든 이미지 파일

**폴더 구조**:
```
images/
├── posts/                    # 게시글 관련 이미지
│   ├── {timestamp}.png
│   └── {timestamp}.jpg
└── partners/                 # 파트너사 로고
    ├── {timestamp}.png
    ├── {timestamp}.jpg
    └── {timestamp}.webp
```

### 2. documents 버킷
```yaml
버킷 ID: documents
이름: documents
공개 설정: true (공개 읽기 가능)
파일 크기 제한: 52,428,800 bytes (50MB)
허용 MIME 타입: 무제한 (null)
생성일: 2025-09-19 09:08:05 UTC
```

**용도**: 회사 소개서 및 기타 문서 파일 저장

**폴더 구조**:
```
documents/
└── introduction/             # 회사 소개서 폴더
    ├── {originalname}_{timestamp}.pdf
    ├── {originalname}_{timestamp}.docx
    └── {originalname}_{timestamp}.pptx
```

## 🔐 Row Level Security (RLS) 정책

### Storage Objects 테이블 RLS 활성화
```sql
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
```

### 1. images 버킷 정책

#### 공개 읽기 정책
```sql
CREATE POLICY "Public read access for images" 
  ON storage.objects FOR SELECT 
  TO public
  USING (bucket_id = 'images');
```
- **대상**: 모든 사용자 (public 역할)
- **권한**: SELECT (읽기)
- **조건**: images 버킷의 파일만

#### 관리자 관리 정책
```sql
CREATE POLICY "Admin can manage images" 
  ON storage.objects FOR ALL 
  TO authenticated
  USING (bucket_id = 'images' AND is_admin())
  WITH CHECK (bucket_id = 'images' AND is_admin());
```
- **대상**: 인증된 사용자 (authenticated 역할)
- **권한**: ALL (생성, 읽기, 수정, 삭제)
- **조건**: images 버킷 + 관리자 권한 확인

### 2. documents 버킷 정책

#### 공개 읽기 정책
```sql
CREATE POLICY "Public read access for documents" 
  ON storage.objects FOR SELECT 
  TO public
  USING (bucket_id = 'documents');
```
- **대상**: 모든 사용자 (public 역할)
- **권한**: SELECT (읽기)
- **조건**: documents 버킷의 파일만

#### 관리자 관리 정책
```sql
CREATE POLICY "Admin can manage documents" 
  ON storage.objects FOR ALL 
  TO authenticated
  USING (bucket_id = 'documents' AND is_admin())
  WITH CHECK (bucket_id = 'documents' AND is_admin());
```
- **대상**: 인증된 사용자 (authenticated 역할)
- **권한**: ALL (생성, 읽기, 수정, 삭제)
- **조건**: documents 버킷 + 관리자 권한 확인

## 🚦 접근 권한 매트릭스

| 역할 | images 읽기 | images 쓰기 | documents 읽기 | documents 쓰기 |
|------|-------------|-------------|----------------|----------------|
| **public** (비로그인) | ✅ | ❌ | ✅ | ❌ |
| **authenticated** (일반 사용자) | ✅ | ❌ | ✅ | ❌ |
| **authenticated + admin** (관리자) | ✅ | ✅ | ✅ | ✅ |
