'use client';

import { BoardPost } from '@/types';
import Link from 'next/link';
import HtmlContent from '@/components/admin/HtmlContent';

interface PostDetailProps {
  post: BoardPost;
  boardType: 'insights' | 'events' | 'testimonials';
  relatedPosts?: BoardPost[];
}

export const PostDetail = ({ post, boardType, relatedPosts = [] }: PostDetailProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  const getBoardPath = () => {
    switch (boardType) {
      case 'insights':
        return { path: '/insights', name: '인사이트 허브' };
      case 'events':
        return { path: '/events', name: '이벤트 & 교육' };
      case 'testimonials':
        return { path: '/testimonials', name: '고객 후기' };
      default:
        return { path: '/', name: 'Home' };
    }
  };

  const { path: boardPath, name: boardName } = getBoardPath();


  return (
    <div className="min-h-screen bg-white">
      {/* 상단 네비게이션 */}
      <div className="bg-gray-50 border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600">홈</Link>
            <span>/</span>
            <Link href={boardPath} className="hover:text-blue-600">{boardName}</Link>
            <span>/</span>
            <span className="text-gray-900 truncate">{post.title}</span>
          </nav>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 헤더 */}
        <header className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              {post.category}
            </span>
            <span className="text-sm text-gray-500">{formatDate(post.date)}</span>
            <span className="flex items-center text-sm text-gray-500">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {post.views.toLocaleString()}
            </span>
          </div>
          
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            {post.title}
          </h1>
          
          <p className="text-xl text-gray-600 mb-6 leading-relaxed">
            {post.excerpt}
          </p>

          {/* 고객 정보 (고객 후기 전용) */}
          {boardType === 'testimonials' && (post.clientName || post.clientCompany) && (
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <div className="flex items-start justify-between">
                <div>
                  {post.clientName && (
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{post.clientName}</h3>
                  )}
                  {(post.clientCompany || post.clientPosition) && (
                    <p className="text-sm text-gray-600">
                      {post.clientCompany}
                      {post.clientCompany && post.clientPosition && ' · '}
                      {post.clientPosition}
                    </p>
                  )}
                </div>
                {post.rating && (
                  <div className="flex flex-col items-end">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-5 h-5 ${i < post.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 mt-1">평점 {post.rating}.0</span>
                  </div>
                )}
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-between border-b border-gray-200 pb-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-sm">
                    {post.author ? post.author.charAt(0) : 'A'}
                  </span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">{post.author || '관리자'}</p>
                <p className="text-sm text-gray-500">전문 컨설턴트</p>
              </div>
            </div>
            
            {post.tags && post.tags.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-block px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </header>

        {/* 대표 이미지 */}
        {post.imageUrl && post.imageUrl !== '/images/placeholder.jpg' && (
          <div className="mb-8">
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full h-64 lg:h-96 object-cover rounded-lg"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.parentElement?.remove();
              }}
            />
          </div>
        )}

        {/* 본문 내용 */}
        <div className="mb-12">
          <HtmlContent content={post.content} className="prose prose-lg max-w-none" />
        </div>

        {/* 액션 버튼 */}
        <div className="flex items-center justify-start border-t border-gray-200 pt-8 mb-12">
          <Link
            href={boardPath}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            목록으로 돌아가기
          </Link>
        </div>
      </article>

      {/* 관련 게시글 */}
      {relatedPosts.length > 0 && (
        <section className="bg-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">관련 게시글</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.slice(0, 3).map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  href={`${boardPath}/${relatedPost.id}`}
                  className="group block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="aspect-video bg-gray-200 rounded-t-lg overflow-hidden">
                    {relatedPost.imageUrl && relatedPost.imageUrl !== '/images/placeholder.jpg' ? (
                      <img
                        src={relatedPost.imageUrl}
                        alt={relatedPost.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300" />
                    )}
                  </div>
                  <div className="p-4">
                    <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded mb-2">
                      {relatedPost.category}
                    </span>
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {relatedPost.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {relatedPost.excerpt}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};