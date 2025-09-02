'use client';

import { useState, useEffect, useRef } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { BoardHeader, BoardSearch, BoardList } from '@/components/board';
import { frontendPostsService } from '@/services/posts';
import { SearchParams, BoardPost, BoardCategory } from '@/types';

export default function InsightsPage() {
  const [posts, setPosts] = useState<BoardPost[]>([]);
  const [categories, setCategories] = useState<BoardCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  
  // StrictMode 중복 호출 방지용 ref
  const abortControllerRef = useRef<AbortController | null>(null);
  const isLoadingRef = useRef(false);
  
  // 모든 검색 관련 state를 하나로 통합
  const [searchState, setSearchState] = useState({
    query: '',
    category: 'all',
    page: 1,
    sortBy: 'date' as 'date' | 'views' | 'title',
    sortOrder: 'desc' as 'asc' | 'desc'
  });

  // 데이터 로드 함수
  const loadData = async () => {
    // 이전 요청 취소
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // 이미 로딩 중이면 중복 요청 방지
    if (isLoadingRef.current) {
      return;
    }
    
    try {
      isLoadingRef.current = true;
      setLoading(true);
      
      // 새로운 AbortController 생성
      abortControllerRef.current = new AbortController();

      // 카테고리와 게시글을 병렬로 로드
      const [categoriesData, postsData] = await Promise.all([
        frontendPostsService.getCategories('insights'),
        frontendPostsService.getPosts('insights', {
          category: searchState.category,
          search: searchState.query,
          page: searchState.page,
          limit: 10,
          sortBy: searchState.sortBy,
          sortOrder: searchState.sortOrder
        })
      ]);

      setCategories(categoriesData);
      setPosts(postsData.posts);
      setTotalPosts(postsData.total);
      setTotalPages(postsData.totalPages);
    } catch (error: any) {
      // AbortError는 무시 (정상적인 취소)
      if (error?.name !== 'AbortError') {
      }
    } finally {
      isLoadingRef.current = false;
      setLoading(false);
    }
  };

  // 초기 데이터 로드 - 통합된 state로 한 번만 실행
  useEffect(() => {
    loadData();
    
    // cleanup 함수로 컴포넌트 언마운트 시 요청 취소
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [searchState.category, searchState.query, searchState.page, searchState.sortBy, searchState.sortOrder]);

  const handleCategoryChange = (category: string) => {
    // 한 번의 setState로 category와 page를 동시에 업데이트
    setSearchState(prev => ({ ...prev, category, page: 1 }));
  };

  const handleSearchChange = (query: string) => {
    setSearchState(prev => ({ ...prev, query }));
  };

  const handleSearch = () => {
    setSearchState(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setSearchState(prev => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-1">
        <BoardHeader
          title="인사이트 허브"
          description="호텔 업계의 최신 트렌드와 전문 지식을 공유합니다. 성공적인 호텔 운영을 위한 인사이트를 확인하세요."
          totalPosts={totalPosts}
        />
        
        <BoardSearch
          categories={categories}
          selectedCategory={searchState.category || 'all'}
          searchQuery={searchState.query || ''}
          onCategoryChange={handleCategoryChange}
          onSearchChange={handleSearchChange}
          onSearch={handleSearch}
        />
        
        <BoardList
          posts={posts}
          boardType="insights"
          searchParams={{
            query: searchState.query,
            category: searchState.category,
            page: searchState.page,
            sortBy: searchState.sortBy,
            sortOrder: searchState.sortOrder
          }}
          loading={loading}
          currentPage={searchState.page}
          totalPages={totalPages}
          totalPosts={totalPosts}
          onPageChange={handlePageChange}
        />
      </main>
      
      <Footer />
    </div>
  );
}