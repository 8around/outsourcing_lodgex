import { createClient } from "@/lib/supabase/client";
import { Partner } from "@/types";
import { uploadService } from "@/services/admin/upload";

export interface PartnerFilters {
  search?: string;
  is_active?: boolean;
}

export interface PaginationOptions {
  page: number;
  per_page: number;
  sort_by?: string;
  sort_direction?: "asc" | "desc";
}

export interface PartnersResponse {
  data: Partner[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface CreatePartnerData {
  name: string;
  image_url?: string;
  is_active?: boolean;
  display_order?: number;
}

export interface UpdatePartnerData {
  name?: string;
  image_url?: string;
  is_active?: boolean;
  display_order?: number;
}

export class PartnersService {
  private getClient() {
    return createClient();
  }

  // 파트너사 목록 조회 (관리자용)
  async getPartners(
    filters: PartnerFilters = {},
    pagination: PaginationOptions = { page: 1, per_page: 10 }
  ): Promise<PartnersResponse> {
    try {
      let query = this.getClient()
        .from("partners")
        .select("*", { count: "exact" });

      // 필터 적용
      if (filters.search) {
        query = query.ilike("name", `%${filters.search}%`);
      }

      if (filters.is_active !== undefined) {
        query = query.eq("is_active", filters.is_active);
      }

      // 정렬
      const sortBy = pagination.sort_by || "display_order";
      const sortDirection = pagination.sort_direction || "asc";
      query = query.order(sortBy, { ascending: sortDirection === "asc" });

      // 페이지네이션
      const from = (pagination.page - 1) * pagination.per_page;
      const to = from + pagination.per_page - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) {
        throw new Error(`파트너사 목록 조회 실패: ${error.message}`);
      }

      const totalPages = Math.ceil((count || 0) / pagination.per_page);

      return {
        data: data || [],
        total: count || 0,
        page: pagination.page,
        per_page: pagination.per_page,
        total_pages: totalPages,
      };
    } catch (error) {
      throw error;
    }
  }

  // 파트너사 상세 조회
  async getPartner(id: string): Promise<Partner> {
    try {
      const { data, error } = await this.getClient()
        .from("partners")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        throw new Error(`파트너사 조회 실패: ${error.message}`);
      }

      if (!data) {
        throw new Error("파트너사를 찾을 수 없습니다.");
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // 파트너사 생성
  async createPartner(partnerData: CreatePartnerData): Promise<Partner> {
    try {
      const { data, error } = await this.getClient()
        .from("partners")
        .insert({
          name: partnerData.name,
          image_url: partnerData.image_url || null,
          is_active: partnerData.is_active ?? true,
          display_order: partnerData.display_order ?? 0,
        })
        .select()
        .single();

      if (error) {
        throw new Error(`파트너사 생성 실패: ${error.message}`);
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // 파트너사 수정
  async updatePartner(
    id: string,
    partnerData: UpdatePartnerData
  ): Promise<Partner> {
    try {
      const updateData: any = {};

      if (partnerData.name !== undefined) updateData.name = partnerData.name;
      if (partnerData.image_url !== undefined)
        updateData.image_url = partnerData.image_url;
      if (partnerData.is_active !== undefined)
        updateData.is_active = partnerData.is_active;
      if (partnerData.display_order !== undefined)
        updateData.display_order = partnerData.display_order;

      const { data, error } = await this.getClient()
        .from("partners")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        throw new Error(`파트너사 수정 실패: ${error.message}`);
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // 파트너사 삭제
  async deletePartner(id: string, imageUrl?: string | null): Promise<void> {
    try {
      // 이미지 URL이 있으면 이미지 파일 먼저 삭제
      if (imageUrl) {
        const imageDeleted = await uploadService.deleteImage(imageUrl);
        if (!imageDeleted) {
          console.error(`파트너사 이미지 삭제 실패: ${imageUrl}`);
          // 이미지 삭제 실패해도 계속 진행
        }
      }

      // DB에서 파트너 레코드 삭제
      const { error } = await this.getClient()
        .from("partners")
        .delete()
        .eq("id", id);

      if (error) {
        throw new Error(`파트너사 삭제 실패: ${error.message}`);
      }
    } catch (error) {
      throw error;
    }
  }

  // 파트너사 통계
  async getPartnerStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
  }> {
    try {
      const { data, error } = await this.getClient()
        .from("partners")
        .select("is_active");

      if (error) {
        throw new Error(`파트너사 통계 조회 실패: ${error.message}`);
      }

      const total = data?.length || 0;
      const active = data?.filter((p) => p.is_active).length || 0;
      const inactive = total - active;

      return {
        total,
        active,
        inactive,
      };
    } catch (error) {
      throw error;
    }
  }

  // 파트너사 순서 업데이트
  async updatePartnerOrder(partnerId: string, newOrder: number): Promise<void> {
    try {
      const { error } = await this.getClient()
        .from("partners")
        .update({ display_order: newOrder })
        .eq("id", partnerId);

      if (error) {
        throw new Error(`파트너사 순서 업데이트 실패: ${error.message}`);
      }
    } catch (error) {
      throw error;
    }
  }
}

export const partnersService = new PartnersService();
