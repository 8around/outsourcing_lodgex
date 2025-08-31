'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PostDetail } from '@/components/board/PostDetail';
import { frontendPostsService } from '@/services/posts';
import { BoardPost } from '@/types';

export default function EventDetailPage() {
  const params = useParams();
  const [post, setPost] = useState<BoardPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BoardPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    const loadData = async () => {
      // 이미 로드했으면 중복 실행 방지
      if (hasLoadedRef.current) {
        return;
      }
      
      try {
        setLoading(true);
        hasLoadedRef.current = true;
        
        if (!params.id || typeof params.id !== 'string') {
          setNotFound(true);
          return;
        }

        // 게시글과 관련 게시글을 병렬로 로드
        const [postData, relatedPostsData] = await Promise.all([
          frontendPostsService.getPost(params.id),
          frontendPostsService.getRelatedPosts(params.id, 'events', 3)
        ]);

        if (!postData) {
          setNotFound(true);
          return;
        }

        setPost(postData);
        setRelatedPosts(relatedPostsData);
      } catch (error) {
        console.error('게시글 로드 실패:', error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">게시글을 불러오는 중...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (notFound || !post) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">게시글을 찾을 수 없습니다</h1>
            <p className="text-gray-600 mb-8">요청하신 게시글이 존재하지 않거나 삭제되었습니다.</p>
            <a
              href="/events"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              이벤트 & 교육으로 돌아가기
            </a>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <main className="flex-1">
        <PostDetail
          post={post}
          boardType="events"
          relatedPosts={relatedPosts}
        />
      </main>
      <Footer />
    </div>
  );
}