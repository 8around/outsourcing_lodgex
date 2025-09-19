import { createClient } from "@/lib/supabase/client";
import { Partner } from "@/types";

export class PublicPartnersService {
  private getClient() {
    return createClient();
  }

  // 활성 파트너사 목록 조회 (메인페이지용)
  async getActivePartners(): Promise<Partner[]> {
    try {
      const { data, error } = await this.getClient()
        .from("partners")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (error) {
        throw new Error(`활성 파트너사 목록 조회 실패: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error("활성 파트너사 조회 중 오류:", error);
      return [];
    }
  }

  // 파트너사 개수 조회
  async getActivePartnersCount(): Promise<number> {
    try {
      const { count, error } = await this.getClient()
        .from("partners")
        .select("*", { count: "exact", head: true })
        .eq("is_active", true);

      if (error) {
        throw new Error(`활성 파트너사 개수 조회 실패: ${error.message}`);
      }

      return count || 0;
    } catch (error) {
      console.error("활성 파트너사 개수 조회 중 오류:", error);
      return 0;
    }
  }
}

export const publicPartnersService = new PublicPartnersService();
