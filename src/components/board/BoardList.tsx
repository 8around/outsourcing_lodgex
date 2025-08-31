'use client';

import { useState, useMemo } from 'react';
import { BoardPost, BoardCategory, SearchParams } from '@/types';
import { PostCard } from './PostCard';
import { Pagination } from './Pagination';

interface BoardListProps {
  posts: BoardPost[];
  boardType: 'insights' | 'events' | 'testimonials';
  searchParams: SearchParams;
  loading?: boolean;
  currentPage?: number;
  totalPages?: number;
  totalPosts?: number;
  onPageChange?: (page: number) => void;
}

export const BoardList = ({ 
  posts, 
  boardType, 
  searchParams,
  loading = false,
  currentPage = 1,
  totalPages = 1,
  totalPosts = 0,
  onPageChange
}: BoardListProps) => {

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 결과 정보 */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-sm text-gray-600">
          {loading ? (
            <span>로딩 중...</span>
          ) : (
            <>
              총 <span className="font-semibold text-gray-900">{totalPosts || posts.length}</span>개의 게시글
              {searchParams.query && (
                <span className="ml-2">
                  '<span className="font-semibold">{searchParams.query}</span>' 검색 결과
                </span>
              )}
            </>
          )}
        </div>
      </div>

      {/* 로딩 중 */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
              <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">검색 결과가 없습니다</h3>
          <p className="text-gray-600">다른 검색어나 카테고리를 시도해보세요.</p>
        </div>
      ) : (
        <>
          {/* 게시글 그리드 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                boardType={boardType}
              />
            ))}
          </div>

          {/* 페이지네이션 */}
          {totalPages > 1 && onPageChange && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          )}
        </>
      )}
    </div>
  );
};