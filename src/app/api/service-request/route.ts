import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";
import {
  sendServiceRequestEmails,
  checkRateLimit,
  isValidEmail,
  ServiceRequestData,
} from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    // Request body 파싱
    const body = await request.json();
    const {
      companyName,
      location,
      scale,
      services,
      contactName,
      contactPhone,
      contactEmail,
      additionalRequests,
    } = body as ServiceRequestData;

    // 입력 데이터 유효성 검사
    const validationErrors: string[] = [];

    if (!companyName?.trim()) {
      validationErrors.push("기업명/호텔명은 필수입니다.");
    }

    if (!location?.trim()) {
      validationErrors.push("위치는 필수입니다.");
    }

    if (!scale?.trim()) {
      validationErrors.push("규모는 필수입니다.");
    }

    if (!Array.isArray(services) || services.length === 0) {
      validationErrors.push("필요 서비스를 하나 이상 선택해주세요.");
    }

    if (!contactName?.trim()) {
      validationErrors.push("담당자명은 필수입니다.");
    }

    if (!contactPhone?.trim()) {
      validationErrors.push("연락처는 필수입니다.");
    } else if (!/^[0-9-+().\s]+$/.test(contactPhone)) {
      validationErrors.push("올바른 연락처 형식을 입력해주세요.");
    }

    if (!contactEmail?.trim()) {
      validationErrors.push("이메일은 필수입니다.");
    } else if (!isValidEmail(contactEmail)) {
      validationErrors.push("올바른 이메일 형식을 입력해주세요.");
    }

    if (validationErrors.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "VALIDATION_ERROR",
          message: "입력값을 확인해주세요.",
          details: validationErrors,
        },
        { status: 400 }
      );
    }

    // Rate limiting 체크 (5분 내 같은 이메일로 중복 신청 방지)
    // 임시로 비활성화 - 테스트용
    // if (!checkRateLimit(contactEmail)) {
    //   return NextResponse.json(
    //     {
    //       success: false,
    //       error: 'RATE_LIMIT_EXCEEDED',
    //       message: '잠시 후 다시 신청해주세요.'
    //     },
    //     { status: 429 }
    //   );
    // }

    // Supabase 클라이언트 생성 - anon key 사용
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // 데이터베이스에 서비스 신청 정보 저장
    const requestId = randomUUID();
    const serviceRequestData = {
      id: requestId,
      company_name: companyName,
      company_type: "hotel", // 기본값 설정
      contact_person: contactName,
      position: null, // 현재 폼에서는 수집하지 않음
      email: contactEmail,
      phone: contactPhone,
      service_type: "consulting", // 기본값 설정
      consulting_areas: services,
      current_challenges: location, // 임시로 위치를 현재 도전과제 필드에 저장
      desired_outcomes: scale, // 임시로 규모를 원하는 결과 필드에 저장
      message: additionalRequests || null,
      status: "pending",
    };

    const { error: insertError } = await supabase
      .from("service_requests")
      .insert([serviceRequestData]);

    if (insertError) {
      // Database insert error
      return NextResponse.json(
        {
          success: false,
          error: "DATABASE_ERROR",
          message: "데이터 저장 중 오류가 발생했습니다.",
        },
        { status: 500 }
      );
    }

    // 이메일 발송 (관리자 알림 + 신청자 확인)
    const emailData: ServiceRequestData = {
      companyName,
      location,
      scale,
      services,
      contactName,
      contactPhone,
      contactEmail,
      additionalRequests,
    };

    const { adminResult, clientResult } =
      await sendServiceRequestEmails(emailData);

    // 이메일 발송 결과 로깅
    // Email sending results

    // 응답 데이터 준비
    const response = {
      success: true,
      message: "컨설팅 신청이 성공적으로 접수되었습니다.",
      data: {
        requestId,
        submittedAt: new Date().toISOString(),
      },
      emailStatus: {
        adminNotificationSent: adminResult.success,
        clientConfirmationSent: clientResult.success,
      },
    };

    // 이메일 발송이 실패해도 DB 저장은 성공했으므로 200으로 응답
    // 하지만 경고 메시지 포함
    if (!adminResult.success || !clientResult.success) {
      response.message =
        "신청은 접수되었지만 일부 이메일 발송에 실패했습니다. 담당자가 직접 연락드리겠습니다.";
      // Some emails failed to send
    }

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    // Service request API error

    return NextResponse.json(
      {
        success: false,
        error: "INTERNAL_ERROR",
        message: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
      },
      { status: 500 }
    );
  }
}

// GET 요청 (관리자용 신청 목록 조회)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");

    const { createClient: createServerClient } = await import(
      "@/lib/supabase/server"
    );
    const supabase = await createServerClient();

    // 인증된 관리자인지 확인
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, message: "인증이 필요합니다." },
        { status: 401 }
      );
    }

    // 관리자 권한 확인 (admins.auth_user_id 기준)
    const { data: adminData, error: adminError } = await supabase
      .from("admins")
      .select("id")
      .eq("auth_user_id", user.id)
      .single();

    if (adminError || !adminData) {
      return NextResponse.json(
        { success: false, message: "관리자 권한이 필요합니다." },
        { status: 403 }
      );
    }

    // 쿼리 빌드
    let query = supabase
      .from("service_requests")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false });

    if (status && status !== "all") {
      query = query.eq("status", status);
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      // Failed to fetch service requests
      return NextResponse.json(
        { success: false, message: "데이터를 가져오는데 실패했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    // Service request GET API error

    return NextResponse.json(
      { success: false, message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
