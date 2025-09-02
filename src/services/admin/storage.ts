import { createClient } from '@/lib/supabase/client'

export interface FileUploadOptions {
  bucket: string
  folder?: string
  fileName?: string
  maxSize?: number // MB 단위
  allowedTypes?: string[]
  quality?: number // 이미지 품질 (0-1)
}

export interface UploadResult {
  url: string
  path: string
  fileName: string
  size: number
  type: string
}

export class StorageService {
  private supabase = createClient()
  
  // 기본 버킷 이름들
  static readonly BUCKETS = {
    POSTS: 'posts',
    THUMBNAILS: 'thumbnails',
    DOCUMENTS: 'documents',
    AVATARS: 'avatars'
  }

  // 파일 업로드
  async uploadFile(
    file: File, 
    options: FileUploadOptions
  ): Promise<UploadResult> {
    try {
      // 파일 검증
      this.validateFile(file, options)

      // 파일명 생성
      const fileName = this.generateFileName(file, options.fileName)
      const folder = options.folder || 'general'
      const filePath = `${folder}/${fileName}`

      // 파일 업로드
      const { data, error } = await this.supabase.storage
        .from(options.bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type
        })

      if (error) {
        throw new Error(`파일 업로드 실패: ${error.message}`)
      }

      // 공개 URL 생성
      const { data: urlData } = this.supabase.storage
        .from(options.bucket)
        .getPublicUrl(filePath)

      return {
        url: urlData.publicUrl,
        path: filePath,
        fileName: fileName,
        size: file.size,
        type: file.type
      }
    } catch (error) {
      throw error
    }
  }

  // 이미지 업로드 (리사이징 포함)
  async uploadImage(
    file: File,
    options: Partial<FileUploadOptions> = {}
  ): Promise<UploadResult> {
    const defaultOptions: FileUploadOptions = {
      bucket: StorageService.BUCKETS.POSTS,
      folder: 'images',
      maxSize: 10, // 10MB
      allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
      quality: 0.8,
      ...options
    }

    // 이미지인지 확인
    if (!file.type.startsWith('image/')) {
      throw new Error('이미지 파일만 업로드 가능합니다.')
    }

    // 이미지 리사이징 (선택적)
    const processedFile = await this.processImage(file, {
      quality: defaultOptions.quality,
      maxWidth: 1920,
      maxHeight: 1080
    })

    return this.uploadFile(processedFile, defaultOptions)
  }

  // 썸네일 업로드
  async uploadThumbnail(
    file: File,
    postId: string,
    options: Partial<FileUploadOptions> = {}
  ): Promise<UploadResult> {
    const defaultOptions: FileUploadOptions = {
      bucket: StorageService.BUCKETS.THUMBNAILS,
      folder: `posts/${postId}`,
      fileName: 'thumbnail',
      maxSize: 5, // 5MB
      allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
      quality: 0.85,
      ...options
    }

    // 썸네일 크기로 리사이징
    const processedFile = await this.processImage(file, {
      quality: defaultOptions.quality,
      maxWidth: 800,
      maxHeight: 600
    })

    return this.uploadFile(processedFile, defaultOptions)
  }

  // 다중 파일 업로드
  async uploadMultipleFiles(
    files: File[],
    options: FileUploadOptions
  ): Promise<UploadResult[]> {
    try {
      const uploads = files.map(file => this.uploadFile(file, options))
      const results = await Promise.allSettled(uploads)

      const successful: UploadResult[] = []
      const failed: string[] = []

      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          successful.push(result.value)
        } else {
          failed.push(`${files[index].name}: ${result.reason.message}`)
        }
      })

      if (failed.length > 0) {
        // Some files failed to upload
      }

      return successful
    } catch (error) {
      throw error
    }
  }

  // 파일 삭제
  async deleteFile(bucket: string, filePath: string): Promise<void> {
    try {
      const { error } = await this.supabase.storage
        .from(bucket)
        .remove([filePath])

      if (error) throw error
    } catch (error) {
      throw error
    }
  }

  // 파일 URL 생성
  getPublicUrl(bucket: string, filePath: string): string {
    const { data } = this.supabase.storage
      .from(bucket)
      .getPublicUrl(filePath)

    return data.publicUrl
  }

  // 서명된 URL 생성 (임시 접근용)
  async getSignedUrl(
    bucket: string, 
    filePath: string, 
    expiresIn: number = 3600
  ): Promise<string> {
    try {
      const { data, error } = await this.supabase.storage
        .from(bucket)
        .createSignedUrl(filePath, expiresIn)

      if (error) throw error

      return data.signedUrl
    } catch (error) {
      throw error
    }
  }

  // 파일 검증
  private validateFile(file: File, options: FileUploadOptions): void {
    // 파일 크기 검증
    const maxSizeBytes = (options.maxSize || 10) * 1024 * 1024 // MB to bytes
    if (file.size > maxSizeBytes) {
      throw new Error(`파일 크기가 ${options.maxSize}MB를 초과합니다.`)
    }

    // 파일 타입 검증
    if (options.allowedTypes && !options.allowedTypes.includes(file.type)) {
      throw new Error(`허용되지 않은 파일 타입입니다. 허용 타입: ${options.allowedTypes.join(', ')}`)
    }
  }

  // 파일명 생성
  private generateFileName(file: File, customName?: string): string {
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 8)
    const extension = file.name.split('.').pop()

    if (customName) {
      return `${customName}_${timestamp}_${random}.${extension}`
    }

    // 원본 파일명에서 특수문자 제거
    const cleanName = file.name
      .replace(/[^a-zA-Z0-9가-힣.\-_]/g, '')
      .replace(/\s+/g, '_')
    
    return `${timestamp}_${random}_${cleanName}`
  }

  // 이미지 처리 (리사이징, 압축)
  private async processImage(
    file: File,
    options: {
      quality?: number
      maxWidth?: number
      maxHeight?: number
    } = {}
  ): Promise<File> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()

      img.onload = () => {
        try {
          const { maxWidth = 1920, maxHeight = 1080, quality = 0.8 } = options

          // 원본 크기
          let { width, height } = img

          // 리사이징 계산
          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height)
            width *= ratio
            height *= ratio
          }

          // 캔버스 크기 설정
          canvas.width = width
          canvas.height = height

          // 이미지 그리기
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height)

            // Blob으로 변환
            canvas.toBlob(
              (blob) => {
                if (blob) {
                  const processedFile = new File(
                    [blob], 
                    file.name, 
                    { 
                      type: file.type,
                      lastModified: Date.now()
                    }
                  )
                  resolve(processedFile)
                } else {
                  reject(new Error('이미지 처리 실패'))
                }
              },
              file.type,
              quality
            )
          } else {
            reject(new Error('Canvas 컨텍스트 생성 실패'))
          }
        } catch (error) {
          reject(error)
        }
      }

      img.onerror = () => reject(new Error('이미지 로드 실패'))
      img.src = URL.createObjectURL(file)
    })
  }

  // 버킷 존재 확인 및 생성
  async ensureBucketExists(bucketName: string): Promise<void> {
    try {
      const { data: buckets, error: listError } = await this.supabase.storage.listBuckets()
      
      if (listError) throw listError

      const bucketExists = buckets.some(bucket => bucket.name === bucketName)
      
      if (!bucketExists) {
        const { error: createError } = await this.supabase.storage.createBucket(bucketName, {
          public: true,
          allowedMimeTypes: ['image/*', 'application/pdf', 'text/*'],
          fileSizeLimit: 52428800 // 50MB
        })

        if (createError) throw createError
      }
    } catch (error) {
      throw error
    }
  }

  // 파일 목록 조회
  async listFiles(
    bucket: string, 
    folder: string = '',
    options: {
      limit?: number
      offset?: number
      sortBy?: 'name' | 'updated_at' | 'created_at' | 'last_accessed_at'
    } = {}
  ) {
    try {
      const { data, error } = await this.supabase.storage
        .from(bucket)
        .list(folder, {
          limit: options.limit || 100,
          offset: options.offset || 0,
          sortBy: { column: options.sortBy || 'created_at', order: 'desc' }
        })

      if (error) throw error

      return data || []
    } catch (error) {
      throw error
    }
  }
}

// 싱글톤 인스턴스 생성
export const storageService = new StorageService()

// 유틸리티 함수들
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export const getFileExtension = (fileName: string): string => {
  return fileName.split('.').pop()?.toLowerCase() || ''
}

export const isImageFile = (fileType: string): boolean => {
  return fileType.startsWith('image/')
}

export const isVideoFile = (fileType: string): boolean => {
  return fileType.startsWith('video/')
}