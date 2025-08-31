import { createClient } from '@/lib/supabase/client'

export interface Post {
  id: string
  title: string
  content: string
  excerpt?: string
  image_url?: string
  post_type: 'insights' | 'events' | 'testimonials'
  category_id?: string
  tags?: string[]
  date: string
  status: 'draft' | 'published'
  views: number
  
  // 고객 후기 전용 필드
  client_name?: string
  client_company?: string
  client_position?: string
  rating?: number
  
  // 타임스탬프
  created_at: string
  updated_at: string
  
  // 조인된 데이터
  category_name?: string
}

export interface Category {
  id: string
  name: string
  post_type: 'insights' | 'events' | 'testimonials'
  description?: string
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface PostFilters {
  post_type?: 'insights' | 'events' | 'testimonials'
  status?: string
  category_id?: string
  search?: string
}

export interface PaginationOptions {
  page: number
  per_page: number
  sort_by?: string
  sort_direction?: 'asc' | 'desc'
}

export interface PostsResponse {
  data: Post[]
  total: number
  page: number
  per_page: number
  total_pages: number
}

export class PostsService {
  private supabase = createClient()

  // 게시글 목록 조회
  async getPosts(
    filters: PostFilters = {},
    pagination: PaginationOptions = { page: 1, per_page: 10 }
  ): Promise<PostsResponse> {
    try {
      let query = this.supabase
        .from('posts')
        .select(`
          *,
          categories (
            id,
            name,
            post_type,
            display_order
          )
        `)

      // 필터 적용
      if (filters.post_type) {
        query = query.eq('post_type', filters.post_type)
      }
      
      if (filters.status) {
        query = query.eq('status', filters.status)
      }
      
      if (filters.category_id) {
        query = query.eq('category_id', filters.category_id)
      }
      
      
      // 검색 시 전체 데이터를 가져와서 클라이언트에서 필터링
      let shouldFilterClient = false
      if (filters.search) {
        // 태그 검색을 위해 모든 데이터를 가져옴
        shouldFilterClient = true
        // DB에서 기본 검색 (제목, 내용, excerpt)
        query = query.or(`title.ilike.%${filters.search}%,content.ilike.%${filters.search}%,excerpt.ilike.%${filters.search}%`)
      }

      // 정렬
      const sortBy = pagination.sort_by || 'date'
      const sortDirection = pagination.sort_direction || 'desc'
      query = query.order(sortBy, { ascending: sortDirection === 'asc' })

      // 검색 시 페이지네이션 없이 전체 데이터 가져오기
      let data, error
      if (shouldFilterClient) {
        // 검색 시 전체 데이터 가져오기
        const result = await query
        data = result.data
        error = result.error
      } else {
        // 일반 조회 시 페이지네이션 적용
        const result = await query.range(
          (pagination.page - 1) * pagination.per_page,
          pagination.page * pagination.per_page - 1
        )
        data = result.data
        error = result.error
      }

      if (error) throw error

      // 카테고리 이름 매핑
      let postsWithCategory = data.map(post => ({
        ...post,
        category_name: post.categories?.name || null
      }))
      
      // 태그 검색 필터링 (클라이언트 사이드)
      if (filters.search && shouldFilterClient) {
        const searchLower = filters.search.toLowerCase()
        // 모든 필드에서 검색
        postsWithCategory = postsWithCategory.filter(post => {
          const titleMatch = post.title?.toLowerCase().includes(searchLower)
          const contentMatch = post.content?.toLowerCase().includes(searchLower)
          const excerptMatch = post.excerpt?.toLowerCase().includes(searchLower)
          const tagsMatch = post.tags?.some(tag => 
            tag.toLowerCase().includes(searchLower)
          )
          
          return titleMatch || contentMatch || excerptMatch || tagsMatch
        })
      }

      // 클라이언트 필터링 후 페이지네이션 적용
      let paginatedData = postsWithCategory
      let total = postsWithCategory.length
      
      if (shouldFilterClient) {
        // 클라이언트에서 페이지네이션
        const start = (pagination.page - 1) * pagination.per_page
        const end = start + pagination.per_page
        paginatedData = postsWithCategory.slice(start, end)
        total = postsWithCategory.length
      } else {
        // 서버 페이지네이션 시 총 개수 조회
        const countQuery = this.supabase
          .from('posts')
          .select('*', { count: 'exact', head: true })
        
        if (filters.post_type) {
          countQuery.eq('post_type', filters.post_type)
        }
        if (filters.status) {
          countQuery.eq('status', filters.status)
        }
        if (filters.category_id) {
          countQuery.eq('category_id', filters.category_id)
        }
        
        const { count, error: countError } = await countQuery
        if (countError) throw countError
        total = count || 0
      }

      return {
        data: paginatedData,
        total: total,
        page: pagination.page,
        per_page: pagination.per_page,
        total_pages: Math.ceil(total / pagination.per_page)
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
      throw error
    }
  }

  // 게시글 단일 조회
  async getPost(id: string): Promise<Post | null> {
    try {
      const { data, error } = await this.supabase
        .from('posts')
        .select(`
          *,
          categories (
            id,
            name,
            post_type,
            display_order
          )
        `)
        .eq('id', id)
        .single()

      if (error) throw error

      if (data) {
        return {
          ...data,
          category_name: data.categories?.name || null
        }
      }

      return null
    } catch (error) {
      console.error('Error fetching post:', error)
      throw error
    }
  }

  // 게시글 생성
  async createPost(postData: Omit<Post, 'id' | 'views' | 'created_at' | 'updated_at' | 'category_name'>): Promise<Post> {
    try {
      const { data, error } = await this.supabase
        .from('posts')
        .insert([postData])
        .select(`
          *,
          categories (
            id,
            name,
            post_type,
            display_order
          )
        `)
        .single()

      if (error) throw error

      return {
        ...data,
        category_name: data.categories?.name || null
      }
    } catch (error) {
      console.error('Error creating post:', error)
      throw error
    }
  }

  // 게시글 수정
  async updatePost(
    id: string, 
    updates: Partial<Omit<Post, 'id' | 'created_at' | 'updated_at' | 'category_name'>>
  ): Promise<Post> {
    try {
      const { data, error } = await this.supabase
        .from('posts')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          categories (
            id,
            name,
            post_type,
            display_order
          )
        `)
        .single()

      if (error) throw error

      return {
        ...data,
        category_name: data.categories?.name || null
      }
    } catch (error) {
      console.error('Error updating post:', error)
      throw error
    }
  }

  // 게시글 삭제
  async deletePost(id: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('posts')
        .delete()
        .eq('id', id)

      if (error) throw error
    } catch (error) {
      console.error('Error deleting post:', error)
      throw error
    }
  }

  // 조회수 증가
  async incrementViews(id: string): Promise<void> {
    try {
      const { error } = await this.supabase.rpc('increment_view_count', {
        post_id: id
      })

      if (error) throw error
    } catch (error) {
      console.error('Error incrementing views:', error)
      throw error
    }
  }

  // 카테고리 목록 조회
  async getCategories(postType?: 'insights' | 'events' | 'testimonials'): Promise<Category[]> {
    try {
      let query = this.supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true })

      if (postType) {
        query = query.eq('post_type', postType)
      }

      const { data, error } = await query

      if (error) throw error

      return data || []
    } catch (error) {
      console.error('Error fetching categories:', error)
      throw error
    }
  }

  // 카테고리 생성
  async createCategory(categoryData: Omit<Category, 'id' | 'created_at' | 'updated_at'>): Promise<Category> {
    try {
      const { data, error } = await this.supabase
        .from('categories')
        .insert([categoryData])
        .select()
        .single()

      if (error) throw error

      return data
    } catch (error) {
      console.error('Error creating category:', error)
      throw error
    }
  }

  // 카테고리 수정
  async updateCategory(
    id: string, 
    updates: Partial<Omit<Category, 'id' | 'created_at' | 'updated_at'>>
  ): Promise<Category> {
    try {
      const { data, error } = await this.supabase
        .from('categories')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      return data
    } catch (error) {
      console.error('Error updating category:', error)
      throw error
    }
  }

  // 카테고리에 속한 게시글 수 조회
  async getPostsCountByCategory(categoryId: string): Promise<number> {
    try {
      const { count, error } = await this.supabase
        .from('posts')
        .select('*', { count: 'exact', head: true })
        .eq('category_id', categoryId)

      if (error) throw error

      return count || 0
    } catch (error) {
      console.error('Error fetching posts count by category:', error)
      throw error
    }
  }

  // 카테고리 삭제
  async deleteCategory(id: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('categories')
        .delete()
        .eq('id', id)

      if (error) throw error
    } catch (error) {
      console.error('Error deleting category:', error)
      throw error
    }
  }

  // 게시글 통계
  async getPostStats(postType?: 'insights' | 'events' | 'testimonials') {
    try {
      let query = this.supabase
        .from('posts')
        .select('status, views')

      if (postType) {
        query = query.eq('post_type', postType)
      }

      const { data, error } = await query

      if (error) throw error

      const stats = {
        total: data.length,
        published: data.filter(p => p.status === 'published').length,
        draft: data.filter(p => p.status === 'draft').length,
        totalViews: data.reduce((sum, p) => sum + (p.views || 0), 0)
      }

      return stats
    } catch (error) {
      console.error('Error fetching post stats:', error)
      throw error
    }
  }

  // 최신 게시글 조회 (프론트엔드용)
  async getLatestPosts(
    postType: 'insights' | 'events' | 'testimonials',
    limit: number = 6
  ): Promise<Post[]> {
    try {
      const { data, error } = await this.supabase
        .from('posts')
        .select(`
          *,
          categories (
            id,
            name,
            post_type,
            display_order
          )
        `)
        .eq('post_type', postType)
        .eq('status', 'published')
        .order('date', { ascending: false })
        .limit(limit)

      if (error) throw error

      const postsWithCategory = data.map(post => ({
        ...post,
        category_name: post.categories?.name || null
      }))

      return postsWithCategory
    } catch (error) {
      console.error('Error fetching latest posts:', error)
      throw error
    }
  }

  // 관련 게시글 조회
  async getRelatedPosts(
    postId: string,
    postType: 'insights' | 'events' | 'testimonials',
    limit: number = 3
  ): Promise<Post[]> {
    try {
      // 현재 게시글 정보 조회
      const currentPost = await this.getPost(postId)
      if (!currentPost) return []

      let query = this.supabase
        .from('posts')
        .select(`
          *,
          categories (
            id,
            name,
            post_type,
            display_order
          )
        `)
        .eq('post_type', postType)
        .eq('status', 'published')
        .neq('id', postId)
        .order('date', { ascending: false })
        .limit(limit)

      // 같은 카테고리의 게시글 우선 조회
      if (currentPost.category_id) {
        query = query.eq('category_id', currentPost.category_id)
      }

      const { data, error } = await query

      if (error) throw error

      const postsWithCategory = data.map(post => ({
        ...post,
        category_name: post.categories?.name || null
      }))

      // 같은 카테고리에서 충분한 게시글을 찾지 못한 경우, 같은 타입의 다른 게시글로 채움
      if (postsWithCategory.length < limit) {
        const additionalQuery = this.supabase
          .from('posts')
          .select(`
            *,
            categories (
              id,
              name,
              post_type,
              display_order
            )
          `)
          .eq('post_type', postType)
          .eq('status', 'published')
          .neq('id', postId)
          .order('date', { ascending: false })
          .limit(limit - postsWithCategory.length)

        // 이미 조회된 게시글 제외
        if (postsWithCategory.length > 0) {
          const excludeIds = postsWithCategory.map(p => p.id)
          additionalQuery.not('id', 'in', `(${excludeIds.join(',')})`)
        }

        const { data: additionalData, error: additionalError } = await additionalQuery

        if (additionalError) throw additionalError

        const additionalPosts = additionalData.map(post => ({
          ...post,
          category_name: post.categories?.name || null
        }))

        return [...postsWithCategory, ...additionalPosts]
      }

      return postsWithCategory
    } catch (error) {
      console.error('Error fetching related posts:', error)
      throw error
    }
  }
}

// 싱글톤 인스턴스 생성
export const postsService = new PostsService()