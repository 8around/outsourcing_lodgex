import { postsService } from '@/services/admin/posts'
import { BoardPost, BoardCategory } from '@/types'

// 프론트엔드용 게시글 서비스
export class FrontendPostsService {
  
  // 게시글 목록 조회 (프론트엔드용)
  async getPosts(
    postType: 'insights' | 'events' | 'testimonials',
    options: {
      category?: string
      search?: string
      page?: number
      limit?: number
      sortBy?: string
      sortOrder?: 'asc' | 'desc'
    } = {}
  ) {
    try {
      const {
        category,
        search,
        page = 1,
        limit = 10,
        sortBy = 'date',
        sortOrder = 'desc'
      } = options

      // 필터 조건 구성
      const filters: any = {
        post_type: postType,
        status: 'published' // 프론트엔드에서는 게시된 글만 조회
      }

      if (search) {
        filters.search = search
      }

      // 카테고리 필터링 (all이 아닌 경우)
      if (category && category !== 'all') {
        // category는 이미 실제 DB ID이므로 바로 사용
        filters.category_id = category
      }

      const response = await postsService.getPosts(
        filters,
        {
          page,
          per_page: limit,
          sort_by: sortBy,
          sort_direction: sortOrder
        }
      )

      // BoardPost 형태로 변환
      const posts: BoardPost[] = response.data.map(post => ({
        id: post.id,
        title: post.title,
        content: post.content,
        excerpt: post.excerpt || '',
        author: post.author,
        date: post.date.split('T')[0], // YYYY-MM-DD 형태로 변환
        category: post.category_name || '',
        imageUrl: post.image_url || '/images/placeholder.jpg',
        views: post.views,
        tags: post.tags || [],
        // 고객 후기 전용 필드
        clientName: post.client_name,
        clientCompany: post.client_company,
        clientPosition: post.client_position,
        rating: post.rating
      }))

      return {
        posts,
        total: response.total,
        totalPages: response.total_pages,
        currentPage: response.page
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
      return {
        posts: [],
        total: 0,
        totalPages: 0,
        currentPage: 1
      }
    }
  }

  // 단일 게시글 조회
  async getPost(id: string) {
    try {
      const post = await postsService.getPost(id)
      if (!post) return null

      // 조회수 증가
      await postsService.incrementViews(id)

      // BoardPost 형태로 변환
      const boardPost: BoardPost = {
        id: post.id,
        title: post.title,
        content: post.content,
        excerpt: post.excerpt || '',
        author: post.author,
        date: post.date.split('T')[0],
        category: post.category_name || '',
        imageUrl: post.image_url || '/images/placeholder.jpg',
        views: post.views + 1, // 조회수 증가 반영
        tags: post.tags || [],
        // 고객 후기 전용 필드
        clientName: post.client_name,
        clientCompany: post.client_company,
        clientPosition: post.client_position,
        rating: post.rating
      }

      return boardPost
    } catch (error) {
      console.error('Error fetching post:', error)
      return null
    }
  }

  // 카테고리 목록 조회 (최적화됨)
  async getCategories(postType: 'insights' | 'events' | 'testimonials') {
    try {
      // 카테고리 목록과 전체 게시글을 병렬로 조회
      const [categories, allPosts] = await Promise.all([
        postsService.getCategories(postType),
        // 전체 게시글을 한 번에 조회 (카테고리별 개수 계산용)
        postsService.getPosts(
          { 
            post_type: postType,
            status: 'published' 
          },
          { page: 1, per_page: 1000 } // 충분히 큰 수로 설정하여 모든 게시글 가져오기
        )
      ])

      // 카테고리별 게시글 수 계산
      const categoryCountMap: { [key: string]: number } = {}
      allPosts.data.forEach(post => {
        if (post.category_id) {
          categoryCountMap[post.category_id] = (categoryCountMap[post.category_id] || 0) + 1
        }
      })

      // BoardCategory 형태로 변환
      const boardCategories: BoardCategory[] = [
        { id: 'all', name: '전체', postCount: allPosts.total }
      ]

      // 각 카테고리에 대한 게시글 수 추가
      for (const category of categories) {
        boardCategories.push({
          id: category.id,
          name: category.name,
          postCount: categoryCountMap[category.id] || 0
        })
      }

      return boardCategories
    } catch (error) {
      console.error('Error fetching categories:', error)
      return [{ id: 'all', name: '전체', postCount: 0 }]
    }
  }

  // 관련 게시글 조회
  async getRelatedPosts(
    postId: string, 
    postType: 'insights' | 'events' | 'testimonials',
    limit: number = 3
  ) {
    try {
      const relatedPosts = await postsService.getRelatedPosts(postId, postType, limit)
      
      // BoardPost 형태로 변환
      const posts: BoardPost[] = relatedPosts.map(post => ({
        id: post.id,
        title: post.title,
        content: post.content,
        excerpt: post.excerpt || '',
        author: post.author,
        date: post.date.split('T')[0],
        category: post.category_name || '',
        imageUrl: post.image_url || '/images/placeholder.jpg',
        views: post.views,
        tags: post.tags || []
      }))

      return posts
    } catch (error) {
      console.error('Error fetching related posts:', error)
      return []
    }
  }

  // 최신 게시글 조회 (메인 페이지용)
  async getLatestPosts(
    postType: 'insights' | 'events' | 'testimonials',
    limit: number = 6
  ) {
    try {
      const latestPosts = await postsService.getLatestPosts(postType, limit)
      
      // BoardPost 형태로 변환
      const posts: BoardPost[] = latestPosts.map(post => ({
        id: post.id,
        title: post.title,
        content: post.content,
        excerpt: post.excerpt || '',
        author: post.author,
        date: post.date.split('T')[0],
        category: post.category_name || '',
        imageUrl: post.image_url || '/images/placeholder.jpg',
        views: post.views,
        tags: post.tags || [],
        // 고객 후기 전용 필드
        rating: post.rating,
        clientCompany: post.client_company
      }))

      return posts
    } catch (error) {
      console.error('Error fetching latest posts:', error)
      return []
    }
  }

  // 카테고리명을 URL slug로 변환
  private getCategorySlug(categoryName: string): string {
    const slugMap: { [key: string]: string } = {
      // 인사이트 카테고리
      '시장 분석': 'market-analysis',
      '수익 관리': 'revenue-management',
      '마케팅': 'marketing',
      '운영 혁신': 'operation-innovation',
      '기술 혁신': 'tech-innovation',
      // 이벤트 카테고리
      '세미나': 'seminar',
      '워크샵': 'workshop',
      '마스터클래스': 'masterclass',
      '네트워킹': 'networking',
      '전문과정': 'course',
      // 고객 후기 카테고리
      '리뉴얼': 'renewal',
      '운영 개선': 'operation',
      '브랜딩': 'branding',
      '수익 개선': 'revenue',
      '디지털 전환': 'digital'
    }

    return slugMap[categoryName] || categoryName.toLowerCase().replace(/\s+/g, '-')
  }

  // slug를 카테고리명으로 변환
  private getCategoryNameFromSlug(slug: string): string {
    const nameMap: { [key: string]: string } = {
      // 인사이트 카테고리
      'market-analysis': '시장 분석',
      'revenue-management': '수익 관리',
      'marketing': '마케팅',
      'operation-innovation': '운영 혁신',
      'tech-innovation': '기술 혁신',
      // 이벤트 카테고리
      'seminar': '세미나',
      'workshop': '워크샵',
      'masterclass': '마스터클래스',
      'networking': '네트워킹',
      'course': '전문과정',
      // 고객 후기 카테고리
      'renewal': '리뉴얼',
      'operation': '운영 개선',
      'branding': '브랜딩',
      'revenue': '수익 개선',
      'digital': '디지털 전환'
    }

    return nameMap[slug] || slug
  }
}

// 싱글톤 인스턴스 생성
export const frontendPostsService = new FrontendPostsService()