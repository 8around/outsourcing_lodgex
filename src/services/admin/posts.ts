import { createClient } from "@/lib/supabase/client";

export interface Post {
  id: string;
  title: string;
  content: string;
  excerpt?: string | null;
  image_url?: string | null;
  post_type: "insights" | "events" | "testimonials";
  category_id?: string | null;
  tags?: string[] | null;
  date: string;
  is_published: boolean;
  views: number;

  // 고객 후기 전용 필드
  client_name?: string | null;
  client_company?: string | null;
  client_position?: string | null;
  rating?: number | null;

  // 타임스탬프
  created_at: string;
  updated_at: string;

  // 조인된 데이터
  category_name?: string | null;
}

export interface Category {
  id: string;
  name: string;
  post_type: "insights" | "events" | "testimonials";
  description?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PostFilters {
  post_type?: "insights" | "events" | "testimonials";
  is_published?: boolean;
  category_id?: string;
  search?: string;
}

export interface PaginationOptions {
  page: number;
  per_page: number;
  sort_by?: string;
  sort_direction?: "asc" | "desc";
}

export interface PostsResponse {
  data: Post[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

// search_posts RPC 함수 응답 타입 (RETURNS JSON이므로 수동 정의)
interface SearchPostsRpcResponse {
  data: Array<{
    id: string;
    title: string;
    excerpt: string | null;
    image_url: string | null;
    post_type: string;
    category_id: string | null;
    tags: string[] | null;
    date: string;
    is_published: boolean;
    views: number;
    client_name: string | null;
    client_company: string | null;
    client_position: string | null;
    rating: number | null;
    created_at: string;
    updated_at: string;
    category_name: string | null;
  }>;
  total: number;
}

export class PostsService {
  private getClient() {
    return createClient();
  }

  // 게시글 목록 조회
  async getPosts(
    filters: PostFilters = {},
    pagination: PaginationOptions = { page: 1, per_page: 10 }
  ): Promise<PostsResponse> {
    try {
      // RPC 함수를 사용하여 title, excerpt, tags 통합 검색
      const { data, error } = await this.getClient().rpc('search_posts', {
        p_search: filters.search || undefined,
        p_post_type: filters.post_type || undefined,
        p_is_published: filters.is_published ?? undefined,
        p_category_id: filters.category_id || undefined,
        p_limit: pagination.per_page,
        p_offset: (pagination.page - 1) * pagination.per_page,
        p_sort_by: pagination.sort_by || 'date',
        p_sort_direction: pagination.sort_direction || 'desc'
      });

      if (error) throw error;

      // 타입 캐스팅 (RPC 함수가 JSON을 반환하므로)
      const rpcData = data as unknown as SearchPostsRpcResponse;

      // 목록에서는 content 불필요
      const postsWithCategory = (rpcData?.data || []).map((post) => ({
        ...post,
        content: '',
      }));

      return {
        data: postsWithCategory as Post[],
        total: rpcData?.total || 0,
        page: pagination.page,
        per_page: pagination.per_page,
        total_pages: Math.ceil((rpcData?.total || 0) / pagination.per_page),
      };
    } catch (error) {
      throw error;
    }
  }

  // 게시글 단일 조회
  async getPost(id: string): Promise<Post | null> {
    try {
      const { data, error } = await this.getClient()
        .from("posts")
        .select(
          `
          *,
          categories (
            id,
            name,
            post_type,
            display_order
          )
        `
        )
        .eq("id", id)
        .single();

      if (error) throw error;

      if (data) {
        return {
          ...data,
          category_name: data.categories?.name || null,
        } as Post;
      }

      return null;
    } catch (error) {
      throw error;
    }
  }

  // 게시글 생성
  async createPost(
    postData: Omit<
      Post,
      "id" | "views" | "created_at" | "updated_at" | "category_name"
    >
  ): Promise<Post> {
    try {
      const { data, error } = await this.getClient()
        .from("posts")
        .insert([postData])
        .select(
          `
          *,
          categories (
            id,
            name,
            post_type,
            display_order
          )
        `
        )
        .single();

      if (error) throw error;

      return {
        ...data,
        category_name: data.categories?.name || null,
      } as Post;
    } catch (error) {
      throw error;
    }
  }

  // 게시글 수정
  async updatePost(
    id: string,
    updates: Partial<
      Omit<Post, "id" | "created_at" | "updated_at" | "category_name">
    >
  ): Promise<Post> {
    try {
      const { data, error } = await this.getClient()
        .from("posts")
        .update(updates)
        .eq("id", id)
        .select(
          `
          *,
          categories (
            id,
            name,
            post_type,
            display_order
          )
        `
        )
        .single();

      if (error) throw error;

      return {
        ...data,
        category_name: data.categories?.name || null,
      } as Post;
    } catch (error) {
      throw error;
    }
  }

  // 게시글 삭제
  async deletePost(id: string): Promise<void> {
    try {
      const { error } = await this.getClient()
        .from("posts")
        .delete()
        .eq("id", id);

      if (error) throw error;
    } catch (error) {
      throw error;
    }
  }

  // 조회수 증가
  async incrementViews(id: string): Promise<void> {
    try {
      const { error } = await this.getClient().rpc("increment_view_count", {
        post_id: id,
      });

      if (error) throw error;
    } catch (error) {
      throw error;
    }
  }

  // 카테고리 목록 조회
  async getCategories(
    postType?: "insights" | "events" | "testimonials"
  ): Promise<Category[]> {
    try {
      let query = this.getClient()
        .from("categories")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (postType) {
        query = query.eq("post_type", postType);
      }

      const { data, error } = await query;

      if (error) throw error;

      return (data || []) as Category[];
    } catch (error) {
      throw error;
    }
  }

  // 카테고리 생성
  async createCategory(
    categoryData: Omit<Category, "id" | "created_at" | "updated_at">
  ): Promise<Category> {
    try {
      const { data, error } = await this.getClient()
        .from("categories")
        .insert([categoryData])
        .select()
        .single();

      if (error) throw error;

      return data as Category;
    } catch (error) {
      throw error;
    }
  }

  // 카테고리 수정
  async updateCategory(
    id: string,
    updates: Partial<Omit<Category, "id" | "created_at" | "updated_at">>
  ): Promise<Category> {
    try {
      const { data, error } = await this.getClient()
        .from("categories")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      return data as Category;
    } catch (error) {
      throw error;
    }
  }

  // 카테고리에 속한 게시글 수 조회
  async getPostsCountByCategory(categoryId: string): Promise<number> {
    try {
      const { count, error } = await this.getClient()
        .from("posts")
        .select("*", { count: "exact", head: true })
        .eq("category_id", categoryId);

      if (error) throw error;

      return count || 0;
    } catch (error) {
      throw error;
    }
  }

  // 카테고리 삭제
  async deleteCategory(id: string): Promise<void> {
    try {
      const { error } = await this.getClient()
        .from("categories")
        .delete()
        .eq("id", id);

      if (error) throw error;
    } catch (error) {
      throw error;
    }
  }

  // 게시글 통계
  async getPostStats(postType?: "insights" | "events" | "testimonials") {
    try {
      let query = this.getClient().from("posts").select("is_published, views");

      if (postType) {
        query = query.eq("post_type", postType);
      }

      const { data, error } = await query;

      if (error) throw error;

      const stats = {
        total: data.length,
        published: data.filter((p) => p.is_published).length,
        draft: data.filter((p) => !p.is_published).length,
        totalViews: data.reduce((sum, p) => sum + (p.views || 0), 0),
      };

      return stats;
    } catch (error) {
      throw error;
    }
  }

  // 최신 게시글 조회 (프론트엔드용)
  async getLatestPosts(
    postType: "insights" | "events" | "testimonials",
    limit: number = 6
  ): Promise<Post[]> {
    try {
      const { data, error } = await this.getClient()
        .from("posts")
        .select(
          `
          *,
          categories (
            id,
            name,
            post_type,
            display_order
          )
        `
        )
        .eq("post_type", postType)
        .eq("is_published", true)
        .order("date", { ascending: false })
        .limit(limit);

      if (error) throw error;

      const postsWithCategory = data.map((post) => ({
        ...post,
        category_name: post.categories?.name || null,
      }));

      return postsWithCategory as Post[];
    } catch (error) {
      throw error;
    }
  }

  // 관련 게시글 조회
  async getRelatedPosts(
    postId: string,
    postType: "insights" | "events" | "testimonials",
    limit: number = 3
  ): Promise<Post[]> {
    try {
      // 현재 게시글 정보 조회
      const currentPost = await this.getPost(postId);
      if (!currentPost) return [];

      let query = this.getClient()
        .from("posts")
        .select(
          `
          *,
          categories (
            id,
            name,
            post_type,
            display_order
          )
        `
        )
        .eq("post_type", postType)
        .eq("is_published", true)
        .neq("id", postId)
        .order("date", { ascending: false })
        .limit(limit);

      // 같은 카테고리의 게시글 우선 조회
      if (currentPost.category_id) {
        query = query.eq("category_id", currentPost.category_id);
      }

      const { data, error } = await query;

      if (error) throw error;

      const postsWithCategory = data.map((post) => ({
        ...post,
        category_name: post.categories?.name || null,
      }));

      // 같은 카테고리에서 충분한 게시글을 찾지 못한 경우, 같은 타입의 다른 게시글로 채움
      if (postsWithCategory.length < limit) {
        const additionalQuery = this.getClient()
          .from("posts")
          .select(
            `
            *,
            categories (
              id,
              name,
              post_type,
              display_order
            )
          `
          )
          .eq("post_type", postType)
          .eq("is_published", true)
          .neq("id", postId)
          .order("date", { ascending: false })
          .limit(limit - postsWithCategory.length);

        // 이미 조회된 게시글 제외
        if (postsWithCategory.length > 0) {
          const excludeIds = postsWithCategory.map((p) => p.id);
          additionalQuery.not("id", "in", `(${excludeIds.join(",")})`);
        }

        const { data: additionalData, error: additionalError } =
          await additionalQuery;

        if (additionalError) throw additionalError;

        const additionalPosts = additionalData.map((post) => ({
          ...post,
          category_name: post.categories?.name || null,
        }));

        return [...postsWithCategory, ...additionalPosts] as Post[];
      }

      return postsWithCategory as Post[];
    } catch (error) {
      throw error;
    }
  }
}

// 싱글톤 인스턴스 생성
export const postsService = new PostsService();
