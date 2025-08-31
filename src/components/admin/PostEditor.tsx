'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { PhotoIcon } from '@heroicons/react/24/outline'
import { uploadService } from '@/services/admin/upload'

// React-Quill을 동적 import (SSR 방지)
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })
import 'react-quill/dist/quill.snow.css'

interface Category {
  id: string
  name: string
  post_type: string
}

interface PostEditorProps {
  postType: 'insights' | 'events' | 'testimonials'
  initialData?: any
  categories: Category[]
  onSave: (data: any) => Promise<void>
  onCancel: () => void
  loading?: boolean
}

export default function PostEditor({
  postType,
  initialData,
  categories,
  onSave,
  onCancel,
  loading = false
}: PostEditorProps) {
  // 기본값 설정
  const defaultFormData = {
    title: '',
    content: '',
    excerpt: '',
    image_url: '',
    category_id: '',
    tags: [] as string[],
    author: '',
    author_title: '',
    status: 'draft',
    meta_title: '',
    meta_description: '',
    date: new Date().toISOString().split('T')[0], // 항상 기본값으로 오늘 날짜 설정
    // 고객 후기 전용 필드
    client_name: '',
    client_company: '',
    client_position: '',
    rating: 5
  }

  // initialData가 있으면 병합, 없으면 기본값 사용
  const [formData, setFormData] = useState(() => {
    console.log('PostEditor - useState 초기화:', { initialData, defaultFormData })
    
    if (initialData) {
      const merged = {
        ...defaultFormData,
        ...initialData,
        date: initialData.date || defaultFormData.date, // date는 항상 값이 있도록 보장
        tags: initialData.tags || []
      }
      console.log('PostEditor - initialData 있음, merged:', merged)
      return merged
    }
    
    console.log('PostEditor - defaultFormData 사용:', defaultFormData)
    return defaultFormData
  })

  const [tagInput, setTagInput] = useState('')
  const [imagePreview, setImagePreview] = useState(initialData?.image_url || '')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  // initialData가 변경될 때만 업데이트 (수정 모드로 전환 시)
  useEffect(() => {
    console.log('PostEditor - useEffect 실행:', { initialData })
    
    if (initialData && Object.keys(initialData).length > 0) {
      const updatedFormData = {
        ...defaultFormData,
        ...initialData,
        date: initialData.date || defaultFormData.date, // date는 항상 값이 있도록 보장
        tags: initialData.tags || []
      }
      
      console.log('PostEditor - useEffect에서 formData 업데이트:', updatedFormData)
      setFormData(updatedFormData)
      
      if (initialData.image_url) {
        setImagePreview(initialData.image_url)
      }
    }
  }, [initialData])

  const handleInputChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleTagAdd = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }))
      setTagInput('')
    }
  }

  const handleTagRemove = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }))
  }


  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // 파일 크기 체크 (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('이미지 크기는 5MB 이하여야 합니다.')
        return
      }
      
      // 미리보기 생성
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setImagePreview(result)
      }
      reader.readAsDataURL(file)
      
      // 파일 저장 (나중에 업로드)
      setImageFile(file)
    }
  }

  const handleSubmit = async (status: string) => {
    try {
      console.log('PostEditor - handleSubmit 시작')
      console.log('PostEditor - 현재 formData:', formData)
      console.log('PostEditor - formData.date 값:', formData.date, 'type:', typeof formData.date)
      
      setUploading(true)
      
      // 이미지 업로드 처리
      let imageUrl = formData.image_url
      if (imageFile) {
        console.log('PostEditor - 이미지 업로드 시작')
        const uploadedUrl = await uploadService.uploadImage(imageFile)
        if (uploadedUrl) {
          console.log('PostEditor - 이미지 업로드 성공:', uploadedUrl)
          imageUrl = uploadedUrl
        } else {
          console.error('PostEditor - 이미지 업로드 실패')
          alert('이미지 업로드에 실패했습니다.')
          setUploading(false)
          return
        }
      }
      
      setUploading(false)
      
      // date 필드 안전성 검증 및 변환
      let dateValue: string;
      
      if (!formData.date || formData.date === '' || formData.date === null || formData.date === undefined) {
        console.warn('PostEditor - date 필드가 비어있음, 현재 시간으로 설정')
        dateValue = new Date().toISOString()
      } else {
        try {
          // date 필드가 이미 ISO 형식인지 확인
          if (typeof formData.date === 'string' && formData.date.includes('T')) {
            console.log('PostEditor - date가 이미 ISO 형식:', formData.date)
            dateValue = formData.date
          } else {
            console.log('PostEditor - date를 ISO 형식으로 변환 중:', formData.date)
            dateValue = new Date(formData.date).toISOString()
          }
        } catch (dateError) {
          console.error('PostEditor - date 변환 오류:', dateError)
          dateValue = new Date().toISOString()
        }
      }
      
      const submitData = {
        ...formData,
        status,
        date: dateValue,  // 검증된 ISO 8601 형식으로 전송
        post_type: postType,
        image_url: imageUrl  // 업로드된 이미지 URL 사용
      }
      
      // postType에 맞게 불필요/유효하지 않은 필드 정리 및 빈 문자열 DATE 제거
      const cleanedData: any = { ...submitData }

      // 공통: category_id가 빈 문자열이면 제거 (UUID 캐스팅 에러 방지)
      if (!cleanedData.category_id) {
        delete cleanedData.category_id
      }

      if (postType === 'insights') {
        delete cleanedData.client_name
        delete cleanedData.client_company
        delete cleanedData.client_position
        delete cleanedData.rating
      } else if (postType === 'events') {
        delete cleanedData.client_name
        delete cleanedData.client_company
        delete cleanedData.client_position
        delete cleanedData.rating
      } else if (postType === 'testimonials') {
        // testimonials는 client 필드들을 유지
      }

      console.log('PostEditor - 최종 cleanedData:', cleanedData)
      console.log('PostEditor - cleanedData.date:', cleanedData.date, 'type:', typeof cleanedData.date)

      await onSave(cleanedData)
    } catch (error) {
      console.error('PostEditor - 저장 오류:', error)
    }
  }

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'blockquote'],
      [{ 'align': [] }],
      ['clean']
    ]
  }

  const filteredCategories = categories.filter(cat => cat.post_type === postType)

  return (
    <div className="space-y-6">
      {/* 기본 정보 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            제목 *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className="w-full px-3 py-2 bg-[#0f0f23] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-[#D4B98B] focus:border-transparent"
            placeholder="제목을 입력하세요"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            카테고리 *
          </label>
          <select
            value={formData.category_id}
            onChange={(e) => handleInputChange('category_id', e.target.value)}
            className="w-full px-3 py-2 bg-[#0f0f23] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-[#D4B98B] focus:border-transparent"
            required
          >
            <option value="">카테고리를 선택하세요</option>
            {filteredCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 작성자 정보 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            작성자 *
          </label>
          <input
            type="text"
            value={formData.author}
            onChange={(e) => handleInputChange('author', e.target.value)}
            className="w-full px-3 py-2 bg-[#0f0f23] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-[#D4B98B] focus:border-transparent"
            placeholder="작성자명을 입력하세요"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            작성자 직책
          </label>
          <input
            type="text"
            value={formData.author_title}
            onChange={(e) => handleInputChange('author_title', e.target.value)}
            className="w-full px-3 py-2 bg-[#0f0f23] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-[#D4B98B] focus:border-transparent"
            placeholder="예: 호텔 컨설턴트, 운영 전문가"
          />
        </div>
      </div>

      {/* 요약 */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          요약
        </label>
        <textarea
          value={formData.excerpt}
          onChange={(e) => handleInputChange('excerpt', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 bg-[#0f0f23] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-[#D4B98B] focus:border-transparent"
          placeholder="게시글 요약을 입력하세요"
        />
      </div>

      {/* 이미지 업로드 */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          대표 이미지
        </label>
        <div className="flex items-center space-x-4">
          <label className="flex-1 flex justify-center px-6 py-4 border-2 border-gray-700 border-dashed rounded-lg cursor-pointer hover:border-[#D4B98B] transition-colors">
            <div className="space-y-1 text-center">
              <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
              <div className="text-sm text-gray-400">
                <span className="font-medium text-[#D4B98B]">파일을 선택</span>하거나 드래그하세요
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
            </div>
            <input
              type="file"
              className="sr-only"
              accept="image/*"
              onChange={handleImageUpload}
            />
          </label>
          {imagePreview && (
            <div className="w-24 h-24 border border-gray-700 rounded-lg overflow-hidden">
              <img
                src={imagePreview}
                alt="미리보기"
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
      </div>


      {/* 고객 후기 전용 필드 */}
      {postType === 'testimonials' && (
        <div className="border border-gray-800 rounded-lg p-4">
          <h3 className="text-lg font-medium text-white mb-4">고객 정보</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                고객명
              </label>
              <input
                type="text"
                value={formData.client_name}
                onChange={(e) => handleInputChange('client_name', e.target.value)}
                className="w-full px-3 py-2 bg-[#0f0f23] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-[#D4B98B] focus:border-transparent"
                placeholder="고객명을 입력하세요"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                회사명
              </label>
              <input
                type="text"
                value={formData.client_company}
                onChange={(e) => handleInputChange('client_company', e.target.value)}
                className="w-full px-3 py-2 bg-[#0f0f23] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-[#D4B98B] focus:border-transparent"
                placeholder="회사명을 입력하세요"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                직책
              </label>
              <input
                type="text"
                value={formData.client_position}
                onChange={(e) => handleInputChange('client_position', e.target.value)}
                className="w-full px-3 py-2 bg-[#0f0f23] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-[#D4B98B] focus:border-transparent"
                placeholder="직책을 입력하세요"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                평점
              </label>
              <select
                value={formData.rating}
                onChange={(e) => handleInputChange('rating', parseInt(e.target.value))}
                className="w-full px-3 py-2 bg-[#0f0f23] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-[#D4B98B] focus:border-transparent"
              >
                <option value={5}>★★★★★ (5점)</option>
                <option value={4}>★★★★☆ (4점)</option>
                <option value={3}>★★★☆☆ (3점)</option>
                <option value={2}>★★☆☆☆ (2점)</option>
                <option value={1}>★☆☆☆☆ (1점)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* 태그 */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          태그
        </label>
        <div className="flex space-x-2 mb-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            className="flex-1 px-3 py-2 bg-[#0f0f23] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-[#D4B98B] focus:border-transparent"
            placeholder="태그를 입력하세요"
            onKeyPress={(e) => e.key === 'Enter' && handleTagAdd()}
          />
          <button
            type="button"
            onClick={handleTagAdd}
            className="px-4 py-2 bg-[#D4B98B] text-black rounded-lg hover:bg-[#D4B98B]/80 transition-colors"
          >
            추가
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm"
            >
              {tag}
              <button
                onClick={() => handleTagRemove(index)}
                className="ml-2 text-gray-400 hover:text-white"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* 내용 에디터 */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          내용 *
        </label>
        <div className="bg-white rounded-lg">
          <ReactQuill
            value={formData.content}
            onChange={(content) => handleInputChange('content', content)}
            modules={quillModules}
            theme="snow"
            className="min-h-[300px]"
            placeholder="내용을 입력하세요..."
          />
        </div>
      </div>

      {/* SEO 설정 */}
      <div className="border border-gray-800 rounded-lg p-4">
        <h3 className="text-lg font-medium text-white mb-4">SEO 설정</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              메타 제목
            </label>
            <input
              type="text"
              value={formData.meta_title}
              onChange={(e) => handleInputChange('meta_title', e.target.value)}
              className="w-full px-3 py-2 bg-[#0f0f23] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-[#D4B98B] focus:border-transparent"
              placeholder="검색 결과에 표시될 제목 (비어있으면 제목 사용)"
              maxLength={60}
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.meta_title.length}/60자 (권장: 50-60자)
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              메타 설명
            </label>
            <textarea
              value={formData.meta_description}
              onChange={(e) => handleInputChange('meta_description', e.target.value)}
              rows={2}
              className="w-full px-3 py-2 bg-[#0f0f23] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-[#D4B98B] focus:border-transparent"
              placeholder="검색 결과에 표시될 설명 (비어있으면 요약 사용)"
              maxLength={160}
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.meta_description.length}/160자 (권장: 140-160자)
            </p>
          </div>
        </div>
      </div>

      {/* 액션 버튼 */}
      <div className="flex justify-end space-x-4 pt-6 border-t border-gray-800">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-6 py-2 text-gray-300 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
        >
          취소
        </button>
        <button
          type="button"
          onClick={() => handleSubmit('draft')}
          disabled={loading}
          className="px-6 py-2 text-gray-300 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
        >
          {loading || uploading ? '저장 중...' : '임시저장'}
        </button>
        <button
          type="button"
          onClick={() => handleSubmit('published')}
          disabled={loading}
          className="px-6 py-2 text-black bg-[#D4B98B] rounded-lg hover:bg-[#D4B98B]/80 transition-colors disabled:opacity-50"
        >
          {loading || uploading ? '발행 중...' : '발행하기'}
        </button>
      </div>
    </div>
  )
}