'use client'

import { useState, useEffect } from 'react'
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import { postsService, Category } from '@/services/admin/posts'

interface CategoryManagerProps {
  postType: 'insights' | 'events' | 'testimonials'
  onCategoriesUpdate: () => void
}

export default function CategoryManager({ postType, onCategoriesUpdate }: CategoryManagerProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [isFormVisible, setIsFormVisible] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    display_order: 0
  })
  const [error, setError] = useState<string | null>(null)

  // 카테고리 목록 로드
  const loadCategories = async () => {
    try {
      setLoading(true)
      const data = await postsService.getCategories(postType)
      setCategories(data)
    } catch (err) {
      // 카테고리 로드 실패
      setError('카테고리를 불러오는 데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCategories()
  }, [postType])

  // 폼 초기화
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      display_order: categories.length + 1
    })
    setEditingCategory(null)
    setIsFormVisible(false)
    setError(null)
  }

  // 새 카테고리 추가
  const handleAdd = () => {
    setFormData({
      name: '',
      description: '',
      display_order: categories.length + 1
    })
    setEditingCategory(null)
    setIsFormVisible(true)
  }

  // 카테고리 수정
  const handleEdit = (category: Category) => {
    setFormData({
      name: category.name,
      description: category.description || '',
      display_order: category.display_order
    })
    setEditingCategory(category)
    setIsFormVisible(true)
  }

  // 카테고리 삭제
  const handleDelete = (category: Category) => {
    setDeletingCategory(category)
    setIsDeleteModalOpen(true)
  }

  // 폼 저장
  const handleSave = async () => {
    try {
      if (!formData.name.trim()) {
        setError('카테고리명은 필수입니다.')
        return
      }

      setLoading(true)
      setError(null)

      const categoryData = {
        name: formData.name.trim(),
        post_type: postType,
        description: formData.description.trim() || undefined,
        display_order: formData.display_order,
        is_active: true
      }

      if (editingCategory) {
        await postsService.updateCategory(editingCategory.id, categoryData)
      } else {
        await postsService.createCategory(categoryData)
      }

      await loadCategories()
      onCategoriesUpdate()
      resetForm()
    } catch (err: any) {
      // 카테고리 저장 실패
      if (err.message?.includes('duplicate') || err.message?.includes('unique')) {
        setError('이미 존재하는 카테고리명입니다.')
      } else {
        setError('카테고리 저장에 실패했습니다.')
      }
    } finally {
      setLoading(false)
    }
  }

  // 카테고리 삭제 확인
  const confirmDelete = async () => {
    if (!deletingCategory) return

    try {
      setLoading(true)
      await postsService.deleteCategory(deletingCategory.id)
      await loadCategories()
      onCategoriesUpdate()
      setIsDeleteModalOpen(false)
      setDeletingCategory(null)
    } catch (err: any) {
      // 카테고리 삭제 실패
      if (err.message?.includes('foreign key') || err.message?.includes('referenced')) {
        setError('해당 카테고리를 사용하는 게시글이 있어 삭제할 수 없습니다.')
      } else {
        setError('카테고리 삭제에 실패했습니다.')
      }
      setIsDeleteModalOpen(false)
      setDeletingCategory(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-white">카테고리 관리</h3>
          <p className="text-sm text-gray-400">
            {postType === 'insights' && '인사이트'} 
            {postType === 'events' && '이벤트'} 
            {postType === 'testimonials' && '고객후기'} 카테고리를 관리합니다.
          </p>
        </div>
        <button
          onClick={handleAdd}
          disabled={loading}
          className="inline-flex items-center px-3 py-1.5 text-sm bg-[#D4B98B] text-black rounded-lg hover:bg-[#D4B98B]/80 transition-colors disabled:opacity-50"
        >
          <PlusIcon className="w-4 h-4 mr-1" />
          새 카테고리
        </button>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="flex items-center space-x-2 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01" />
          </svg>
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-red-400 hover:text-red-300"
          >
            ×
          </button>
        </div>
      )}

      {/* 카테고리 폼 */}
      {isFormVisible && (
        <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
          <h4 className="text-md font-medium text-white mb-4">
            {editingCategory ? '카테고리 수정' : '새 카테고리 추가'}
          </h4>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  카테고리명 *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 bg-[#0f0f23] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-[#D4B98B] focus:border-transparent"
                  placeholder="카테고리명을 입력하세요"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  표시 순서
                </label>
                <input
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData(prev => ({ ...prev, display_order: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 bg-[#0f0f23] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-[#D4B98B] focus:border-transparent"
                  min="0"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                설명
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={2}
                className="w-full px-3 py-2 bg-[#0f0f23] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-[#D4B98B] focus:border-transparent"
                placeholder="카테고리 설명을 입력하세요 (선택사항)"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={resetForm}
                disabled={loading}
                className="px-4 py-2 text-gray-300 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
              >
                취소
              </button>
              <button
                onClick={handleSave}
                disabled={loading || !formData.name.trim()}
                className="px-4 py-2 text-black bg-[#D4B98B] rounded-lg hover:bg-[#D4B98B]/80 transition-colors disabled:opacity-50"
              >
                {loading ? '저장 중...' : (editingCategory ? '수정' : '추가')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 카테고리 목록 */}
      <div className="space-y-2">
        {loading && categories.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            카테고리를 불러오는 중...
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            등록된 카테고리가 없습니다.
          </div>
        ) : (
          categories.map((category) => (
            <div
              key={category.id}
              className="flex items-center justify-between p-3 bg-gray-800/30 border border-gray-700 rounded-lg hover:bg-gray-800/50 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-400 font-mono">
                    #{category.display_order}
                  </span>
                  <span className="text-white font-medium">{category.name}</span>
                  {!category.is_active && (
                    <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded">
                      비활성
                    </span>
                  )}
                </div>
                {category.description && (
                  <p className="text-sm text-gray-400 mt-1 ml-8">
                    {category.description}
                  </p>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleEdit(category)}
                  disabled={loading}
                  className="p-1.5 text-gray-400 hover:text-yellow-400 transition-colors disabled:opacity-50"
                  title="수정"
                >
                  <PencilIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(category)}
                  disabled={loading}
                  className="p-1.5 text-gray-400 hover:text-red-400 transition-colors disabled:opacity-50"
                  title="삭제"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 삭제 확인 모달 */}
      {isDeleteModalOpen && deletingCategory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#0f0f23] border border-gray-700 rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-medium text-white mb-4">카테고리 삭제 확인</h3>
            <p className="text-gray-300 mb-2">
              다음 카테고리를 삭제하시겠습니까?
            </p>
            <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700 mb-4">
              <span className="font-medium text-white">{deletingCategory.name}</span>
              {deletingCategory.description && (
                <p className="text-sm text-gray-400 mt-1">{deletingCategory.description}</p>
              )}
            </div>
            <p className="text-sm text-red-400 mb-6">
              삭제된 카테고리는 복구할 수 없습니다.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false)
                  setDeletingCategory(null)
                }}
                disabled={loading}
                className="px-4 py-2 text-gray-300 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
              >
                취소
              </button>
              <button
                onClick={confirmDelete}
                disabled={loading}
                className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {loading ? '삭제 중...' : '삭제'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}