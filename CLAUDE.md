## 대화
- 사용자와 대화할떄는 무조건 한국말로

## 수정하면 안되는 파일
- .env
- .mcp.json
- PRD.md

## 작업 방식
- 기능 개발, 수정, 버그 픽스를 한 후에 PlayWright MCP를 통해서 완벽하게 하였는지 체크하세요.

## 문제 해결 방식
- 근본적인 문제를 해결하세요.
 - ex: 로그인 후 데이터가 추가되어야하는 테이블에 추가가안되어서 INSERT 문으로 문제를 해결하는 방식은 하면 안됩니다.
- 로그를 우선적으로 보고 문제를 해결하세요.
- 라이브러리, 프레임워크, 언어 버전을 낮추거나 올려서 해결하는 문제는 작업을 멈추고 왜 그렇게 해야하는지 자세하게 설명하세요.

## 기능 개발 & 수정 & DB 설계시
- PRD.md 파일을 읽어야함

## 인증 시스템 (중요)

### 인증 방식
- **Supabase Auth 사용**
  - Supabase Auth의 이메일/비밀번호 인증 사용
  - admins 테이블의 auth_user_id로 Supabase Auth 사용자와 연결
  - 세션은 Supabase Auth가 자동 관리

### Supabase 클라이언트 설정
- **인증 기반 접근 제어**
  - createClient()는 NEXT_PUBLIC_SUPABASE_ANON_KEY를 사용
  - RLS 정책은 'authenticated' 역할 기준으로 설정
  - public.is_admin() 함수로 관리자 권한 확인

### RLS 정책
- **읽기 권한**
  - categories: 활성 카테고리는 모두 조회 가능
  - posts: 게시된 포스트는 모두 조회 가능, 관리자는 draft도 조회 가능
  - service_requests: 관리자만 조회 가능
  - admins: 관리자만 조회 가능

- **쓰기 권한 (INSERT/UPDATE/DELETE)**
  - categories: 관리자만 가능
  - posts: 관리자만 가능
  - service_requests: INSERT는 모두 가능, UPDATE/DELETE는 관리자만
  - admins: 관리자만 UPDATE 가능

### Storage RLS 정책
- **images 버킷**
  - SELECT: 모든 사용자 허용 (공개 버킷)
  - INSERT/UPDATE/DELETE: authenticated 역할 + is_admin() 확인 필요
  - auth.uid()와 auth.role() 함수 사용 가능

## 데이터베이스 관리 규칙

### 스키마 동기화 요구사항
- **schema.sql과 Supabase 일치성**
  - DATABASE_SCHEMA.md 파일과 실제 Supabase 데이터베이스는 항상 동기화되어야 함
  - 모든 테이블, 컬럼, 타입, 제약조건이 정확히 일치해야 함
  - RLS 정책, 인덱스, 트리거도 동일하게 유지되어야 함

### 데이터베이스 변경 프로세스
- **컬럼 추가/수정 시 필수 절차**
  1. **개발자 승인 필수**: DB 컬럼을 추가하거나 수정하기 전에 반드시 개발자에게 문의하고 승인받아야 함
  2. **영향도 분석**: 변경사항이 기존 기능에 미치는 영향을 사전에 분석
  3. **schema.sql 업데이트**: 승인된 변경사항을 schema.sql 파일에 먼저 반영
  4. **Supabase 적용**: schema.sql의 변경사항을 Supabase에 마이그레이션
  5. **코드 수정**: 관련된 TypeScript 타입 정의 및 서비스 로직 업데이트
  6. **테스트**: 변경사항이 정상 작동하는지 확인

### 주의사항
- **무단 변경 금지**: 개발자 승인 없이 데이터베이스를 직접 수정하지 말 것
- **동기화 검증**: 정기적으로 schema.sql과 Supabase의 일치 여부를 확인
- **문서화**: 모든 DB 변경사항은 변경 사유와 함께 문서화되어야 함
- **백업**: 중요한 변경 전에는 반드시 데이터베이스 백업 수행