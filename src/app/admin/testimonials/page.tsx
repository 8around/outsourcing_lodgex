'use client';

import { useState, useEffect } from 'react';
import { postsService } from '@/services/admin/posts';
import { uploadService } from '@/services/admin/upload';
import { Post, Category } from '@/services/admin/posts';
import { Plus, Search, Edit2, Trash2, Eye, Filter, Tag, Calendar, User, BarChart3, FolderOpen, Upload, X, Star } from 'lucide-react';
import RichTextEditor from '@/components/admin/RichTextEditor';

export default function TestimonialsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(''); // 검색 입력 필드용
  const [searchTerm, setSearchTerm] = useState(''); // 실제 검색에 사용되는 값
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [stats, setStats] = useState({ total: 0, published: 0, draft: 0, avgRating: 0 });

  // 게시글 목록 조회
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await postsService.getPosts(
        {
          post_type: 'testimonials',
          status: statusFilter,
          category_id: categoryFilter,
          search: searchTerm
        },
        {
          page: currentPage,
          per_page: 10,
          sort_by: 'date',
          sort_direction: 'desc'
        }
      );
      setPosts(response.data);
      setTotalPages(response.total_pages);

      // 통계 조회
      const statsData = await postsService.getPostStats('testimonials');
      
      // 평균 평점 계산
      const ratingsSum = response.data
        .filter((p: Post) => p.rating && p.rating > 0)
        .reduce((sum: number, p: Post) => sum + (p.rating || 0), 0);
      const ratingsCount = response.data.filter((p: Post) => p.rating && p.rating > 0).length;
      const avgRating = ratingsCount > 0 ? Math.round((ratingsSum / ratingsCount) * 10) / 10 : 0;
      
      setStats({ ...statsData, avgRating });
    } catch (error) {
      // Error handled silently
    } finally {
      setLoading(false);
    }
  };

  // 카테고리 목록 조회
  const fetchCategories = async () => {
    try {
      const data = await postsService.getCategories('testimonials');
      setCategories(data);
    } catch (error) {
      // Error handled silently
    }
  };

  // 검색 실행 함수
  const handleSearch = () => {
    setSearchTerm(searchInput);
    setCurrentPage(1); // 검색 시 첫 페이지로 이동
  };

  // 검색 입력 필드에서 엔터 키 처리
  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, [currentPage, statusFilter, categoryFilter, searchTerm]); // searchTerm은 버튼 클릭 시에만 변경됨

  // 게시글 삭제
  const handleDelete = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    
    try {
      await postsService.deletePost(id);
      fetchPosts();
    } catch (error) {
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  // 게시글 편집
  const handleEdit = (post: Post) => {
    setEditingPost(post);
    setShowCreateModal(true);
  };

  // 모달 닫기
  const closeModal = () => {
    setShowCreateModal(false);
    setEditingPost(null);
    fetchPosts();
  };

  // 평점 렌더링 함수
  const renderRating = (rating: number | undefined | null) => {
    if (!rating) return <span className="text-gray-500">-</span>;
    
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'
            }`}
          />
        ))}
        <span className="ml-1 text-sm text-gray-500">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">고객 후기 관리</h1>
          <p className="text-sm text-gray-600 mt-1">고객의 성공 사례와 후기를 관리합니다</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowCategoryModal(true)}
            data-category-modal-trigger
            className="px-4 py-2 bg-gray-100 text-gray-800 font-medium rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
          >
            <FolderOpen className="w-4 h-4" />
            카테고리 관리
          </button>
          <button
            onClick={() => {
              if (categories.length === 0) {
                alert('먼저 카테고리를 등록해주세요.\n카테고리 관리 버튼을 클릭하여 카테고리를 추가한 후 후기를 작성할 수 있습니다.');
                setShowCategoryModal(true);
              } else {
                setShowCreateModal(true);
              }
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            새 후기 작성
          </button>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">전체 후기</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <BarChart3 className="w-8 h-8 text-gray-400" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">게시됨</p>
              <p className="text-2xl font-bold text-green-600">{stats.published}</p>
            </div>
            <Eye className="w-8 h-8 text-green-400" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">임시저장</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.draft}</p>
            </div>
            <Edit2 className="w-8 h-8 text-yellow-400" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">평균 평점</p>
              <p className="text-2xl font-bold text-blue-600">{stats.avgRating.toFixed(1)}</p>
            </div>
            <Star className="w-8 h-8 text-blue-400" />
          </div>
        </div>
      </div>

      {/* 필터 및 검색 */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="제목, 내용, 고객명, 회사명으로 검색..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyPress={handleSearchKeyPress}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={handleSearch}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Search className="w-4 h-4" />
                검색
              </button>
            </div>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1); // 필터 변경 시 첫 페이지로
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">모든 상태</option>
            <option value="published">게시됨</option>
            <option value="draft">임시저장</option>
          </select>
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setCurrentPage(1); // 필터 변경 시 첫 페이지로
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">모든 카테고리</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 게시글 목록 테이블 */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                제목 / 내용
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                고객 정보
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                카테고리
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                평점
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                작성일
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                상태
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                작업
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                  로딩 중...
                </td>
              </tr>
            ) : posts.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                  고객 후기가 없습니다.
                </td>
              </tr>
            ) : (
              posts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{post.title}</div>
                      {post.excerpt && (
                        <div className="text-sm text-gray-500 truncate max-w-md">{post.excerpt}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div className="font-medium text-gray-900">{post.client_name || '-'}</div>
                      <div className="text-gray-500">{post.client_company || '-'}</div>
                      {post.client_position && (
                        <div className="text-gray-400 text-xs">{post.client_position}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                      {post.category_name || '미분류'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {renderRating(post.rating)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(post.date).toLocaleDateString('ko-KR')}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      post.status === 'published' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {post.status === 'published' ? '게시됨' : '임시저장'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(post)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                이전
              </button>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                다음
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  전체 <span className="font-medium">{stats.total}</span>개 중{' '}
                  <span className="font-medium">{stats.total > 0 ? (currentPage - 1) * 10 + 1 : 0}</span> -{' '}
                  <span className="font-medium">{Math.min(currentPage * 10, stats.total)}</span> 표시
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    이전
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === i + 1
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    다음
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 게시글 작성/수정 모달 */}
      {showCreateModal && (
        <PostFormModal
          post={editingPost}
          categories={categories}
          onClose={closeModal}
        />
      )}

      {/* 카테고리 관리 모달 */}
      {showCategoryModal && (
        <CategoryModal
          postType="testimonials"
          categories={categories}
          onClose={() => {
            setShowCategoryModal(false);
            fetchCategories();
          }}
        />
      )}
    </div>
  );
}

// 게시글 폼 모달 컴포넌트
function PostFormModal({ post, categories, onClose }: {
  post: Post | null;
  categories: Category[];
  onClose: () => void;
}) {
  const [formData, setFormData] = useState<{
    title: string;
    content: string;
    excerpt: string;
    image_url: string;
    category_id: string;
    tags: string[];
    status: 'draft' | 'published';
    client_name: string;
    client_company: string;
    client_position: string;
    rating: number;
  }>({
    title: post?.title || '',
    content: post?.content || '',
    excerpt: post?.excerpt || '',
    image_url: post?.image_url || '',
    category_id: post?.category_id || '',
    tags: post?.tags || [],
    status: (post?.status as 'draft' | 'published') || 'draft',
    client_name: post?.client_name || '',
    client_company: post?.client_company || '',
    client_position: post?.client_position || '',
    rating: post?.rating || 5,
  });
  const [tagInput, setTagInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(post?.image_url || '');
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 카테고리 검증
    if (!formData.category_id) {
      alert('카테고리를 선택해주세요.');
      return;
    }
    
    setSaving(true);

    try {
      let imageUrl = formData.image_url;

      // 이미지 업로드
      if (imageFile) {
        setUploading(true);
        const uploadedUrl = await uploadService.uploadImage(imageFile);
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        }
        setUploading(false);
      }

      const postData = {
        ...formData,
        image_url: imageUrl,
        post_type: 'testimonials' as const,
        date: post?.date || new Date().toISOString(),
      };

      if (post) {
        await postsService.updatePost(post.id, postData);
      } else {
        await postsService.createPost(postData);
      }
      onClose();
    } catch (error) {
      alert('저장 중 오류가 발생했습니다.');
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('이미지 크기는 5MB 이하여야 합니다.');
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
    setFormData({ ...formData, image_url: '' });
  };

  const addTag = () => {
    if (tagInput && !formData.tags.includes(tagInput)) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput] });
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
          <h2 className="text-xl font-bold text-gray-900">
            {post ? '고객 후기 수정' : '새 고객 후기 작성'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* 기본 정보 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                제목 *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                고객명 *
              </label>
              <input
                type="text"
                required
                value={formData.client_name}
                onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                회사명 *
              </label>
              <input
                type="text"
                required
                value={formData.client_company}
                onChange={(e) => setFormData({ ...formData, client_company: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                직책
              </label>
              <input
                type="text"
                value={formData.client_position}
                onChange={(e) => setFormData({ ...formData, client_position: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                평점
              </label>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: star })}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= formData.rating
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      } hover:text-yellow-400 hover:fill-yellow-400 transition-colors`}
                    />
                  </button>
                ))}
                <span className="ml-2 text-sm text-gray-600">{formData.rating}점</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                카테고리 *
              </label>
              {categories.length === 0 ? (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    등록된 카테고리가 없습니다.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      // 부모 컴포넌트의 카테고리 모달 열기
                      document.querySelector<HTMLButtonElement>('[data-category-modal-trigger]')?.click();
                    }}
                    className="mt-2 text-sm text-yellow-700 underline hover:text-yellow-900"
                  >
                    카테고리 관리로 이동하여 카테고리를 등록하세요
                  </button>
                </div>
              ) : (
                <select
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">카테고리를 선택하세요</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                상태
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'draft' | 'published' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="draft">임시저장</option>
                <option value="published">게시됨</option>
              </select>
            </div>


            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                요약
              </label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="고객 후기의 핵심 내용을 간단히 요약해주세요..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                내용 *
              </label>
              <RichTextEditor
                value={formData.content}
                onChange={(value) => setFormData({ ...formData, content: value })}
                placeholder="고객 후기 내용을 입력하세요..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                대표 이미지
              </label>
              <div className="space-y-4">
                {imagePreview ? (
                  <div className="relative">
                    <img 
                      src={imagePreview} 
                      alt="미리보기" 
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">이미지를 선택하세요</p>
                    <p className="text-xs text-gray-500">JPG, PNG, GIF, WEBP (최대 5MB)</p>
                  </div>
                )}
                <input
                  type="file"
                  id="image-upload"
                  accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                  onChange={handleImageSelect}
                  className="hidden"
                />
                <label
                  htmlFor="image-upload"
                  className="inline-block px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer"
                >
                  이미지 선택
                </label>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                태그
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="태그 입력 후 Enter"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  추가
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* 버튼 */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? '저장 중...' : (post ? '수정' : '작성')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// 카테고리 관리 모달 컴포넌트
function CategoryModal({ postType, categories, onClose }: {
  postType: 'insights' | 'events' | 'testimonials';
  categories: Category[];
  onClose: () => void;
}) {
  const [categoryList, setCategoryList] = useState<Category[]>(categories);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  // 카테고리 추가
  const handleAddCategory = async () => {
    if (!newCategoryName) return;

    try {
      const newCategory = await postsService.createCategory({
        name: newCategoryName,
        post_type: postType,
        display_order: categoryList.length,
        is_active: true,
      });
      setCategoryList([...categoryList, newCategory]);
      setNewCategoryName('');
    } catch (error) {
      alert('카테고리 추가 중 오류가 발생했습니다.');
    }
  };

  // 카테고리 수정
  const handleUpdateCategory = async (id: string) => {
    if (!editingName) return;

    try {
      const updated = await postsService.updateCategory(id, { name: editingName });
      setCategoryList(categoryList.map(cat => cat.id === id ? updated : cat));
      setEditingCategory(null);
      setEditingName('');
    } catch (error) {
      alert('카테고리 수정 중 오류가 발생했습니다.');
    }
  };

  // 카테고리 삭제
  const handleDeleteCategory = async (id: string) => {
    try {
      // 카테고리에 속한 게시글 수 확인
      const postsCount = await postsService.getPostsCountByCategory(id);
      
      if (postsCount > 0) {
        // 게시글이 있으면 경고 메시지 표시
        alert('카테고리에 게시된 게시글을 삭제 후에 카테고리 삭제가 가능합니다.');
        return;
      }
      
      // 게시글이 없으면 삭제 확인
      if (!confirm('이 카테고리를 삭제하시겠습니까?')) return;

      await postsService.deleteCategory(id);
      setCategoryList(categoryList.filter(cat => cat.id !== id));
    } catch (error) {
      alert('카테고리 삭제 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white text-gray-900 rounded-lg max-w-md w-full">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">카테고리 관리</h2>
        </div>

        <div className="p-6">
          {/* 카테고리 추가 */}
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
              placeholder="새 카테고리 이름"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleAddCategory}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              추가
            </button>
          </div>

          {/* 카테고리 목록 */}
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {categoryList.map((category) => (
              <div key={category.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                {editingCategory === category.id ? (
                  <div className="flex gap-2 flex-1">
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleUpdateCategory(category.id)}
                      className="flex-1 px-2 py-1 border border-gray-300 rounded"
                    />
                    <button
                      onClick={() => handleUpdateCategory(category.id)}
                      className="text-green-600 hover:text-green-800"
                    >
                      저장
                    </button>
                    <button
                      onClick={() => {
                        setEditingCategory(null);
                        setEditingName('');
                      }}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      취소
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="text-sm font-medium">{category.name}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingCategory(category.id);
                          setEditingName(category.name);
                        }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}