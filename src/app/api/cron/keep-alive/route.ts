import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    // Supabase 연결 유지를 위한 간단한 쿼리
    const supabase = await createClient();
    const { error } = await supabase
      .from("admins")
      .select("id")
      .limit(1)
      .single();

    if (error) {
      console.error("Keep-alive query failed:", error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Supabase connection kept alive",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Cron job error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
