'use client';

import { Card } from '@/components/ui';
import { BoardPost } from '@/types';
import Link from 'next/link';

interface PostCardProps {
  post: BoardPost;
  boardType: 'insights' | 'events' | 'testimonials';
}

export const PostCard = ({ post, boardType }: PostCardProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getBoardPath = () => {
    switch (boardType) {
      case 'insights':
        return '/insights';
      case 'events':
        return '/events';
      case 'testimonials':
        return '/testimonials';
      default:
        return '/';
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
      <Link href={`${getBoardPath()}/${post.id}`} className="block">
        {/* 이미지 영역 */}
        <div className="aspect-video bg-gray-200 overflow-hidden">
          {post.imageUrl && post.imageUrl !== '/images/placeholder.jpg' ? (
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300" />
          )}
        </div>

        {/* 콘텐츠 영역 */}
        <div className="p-6">
          {/* 카테고리와 날짜 */}
          <div className="flex items-center justify-between mb-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {post.category}
            </span>
            <div className="flex items-center text-sm text-gray-500 space-x-4">
              <span>{formatDate(post.date)}</span>
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {post.views.toLocaleString()}
              </span>
            </div>
          </div>

          {/* 제목 */}
          <h3 className="text-xl font-semibold mb-3 text-gray-900 line-clamp-2 hover:text-blue-600 transition-colors">
            {post.title}
          </h3>

          {/* 고객 정보 (고객 후기 전용) */}
          {boardType === 'testimonials' && (post.clientName || post.clientCompany) && (
            <div className="mb-3 space-y-1">
              {post.clientName && (
                <p className="text-sm font-medium text-gray-700">{post.clientName}</p>
              )}
              {(post.clientCompany || post.clientPosition) && (
                <p className="text-xs text-gray-500">
                  {post.clientCompany}
                  {post.clientCompany && post.clientPosition && ' · '}
                  {post.clientPosition}
                </p>
              )}
              {post.rating && (
                <div className="flex items-center mt-2">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${i < post.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="ml-1 text-xs text-gray-500">({post.rating}.0)</span>
                </div>
              )}
            </div>
          )}

          {/* 요약 */}
          <p className="text-gray-600 mb-4 line-clamp-3 text-sm leading-relaxed">
            {post.excerpt}
          </p>

          {/* 태그 */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex gap-1 flex-wrap">
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded"
                >
                  #{tag}
                </span>
              ))}
              {post.tags.length > 3 && (
                <span className="text-xs text-gray-400">+{post.tags.length - 3}</span>
              )}
            </div>
          )}
        </div>
      </Link>
    </Card>
  );
};