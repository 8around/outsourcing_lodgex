import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST() {
  try {
    const supabase = await createClient();
    
    // Supabase Auth 로그아웃
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      return NextResponse.json(
        { error: '로그아웃 실패' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: true },
      { status: 200 }
    );
  } catch (error) {
    // Logout error
    return NextResponse.json(
      { error: '로그아웃 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}