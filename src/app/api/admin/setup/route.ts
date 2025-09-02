import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// 이 API는 초기 설정 시 한 번만 실행되어야 합니다
// Supabase Auth에 관리자 계정을 생성하고 admins 테이블과 연결합니다
export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const supabase = await createClient();

    // 1. Supabase Auth에 사용자 생성 시도
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/admin/dashboard`,
      },
    });

    if (signUpError && signUpError.message !== "User already registered") {
      return NextResponse.json(
        { error: `Auth 사용자 생성 실패: ${signUpError.message}` },
        { status: 400 }
      );
    }

    // 2. 이미 존재하는 경우 로그인 시도
    let userId = authData?.user?.id;

    if (!userId) {
      const { data: signInData, error: signInError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (signInError) {
        return NextResponse.json(
          { error: `로그인 실패: ${signInError.message}` },
          { status: 400 }
        );
      }

      userId = signInData?.user?.id;
    }

    if (!userId) {
      return NextResponse.json(
        { error: "사용자 ID를 가져올 수 없습니다." },
        { status: 400 }
      );
    }

    // 3. admins 테이블 업데이트 (auth_user_id 연결)
    const { error: updateError } = await supabase
      .from("admins")
      .update({
        auth_user_id: userId,
        email: email,
      })
      .eq("login_id", email);

    if (updateError) {
      return NextResponse.json(
        { error: `관리자 테이블 업데이트 실패: ${updateError.message}` },
        { status: 400 }
      );
    }

    // 4. 로그아웃 (설정 완료 후 정상적인 로그인 프로세스를 거치도록)
    await supabase.auth.signOut();

    return NextResponse.json({
      success: true,
      message:
        "Supabase Auth 설정이 완료되었습니다. 이제 로그인 페이지에서 로그인할 수 있습니다.",
    });
  } catch (error) {
    // Setup error
    return NextResponse.json(
      { error: "설정 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
