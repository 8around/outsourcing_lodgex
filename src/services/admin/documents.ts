import { createClient } from '@/lib/supabase/client'
import { StorageService, FileUploadOptions, UploadResult } from './storage'

export interface CompanyDocument {
  id: string
  name: string
  size: number
  type: string
  url: string
  path: string
  uploadedAt: string
}

export interface DocumentUploadOptions {
  maxSize?: number // MB 단위
  allowedTypes?: string[]
}

export class DocumentService extends StorageService {
  private static readonly BUCKET_NAME = 'documents'
  private static readonly FOLDER_NAME = 'introduction'

  // 회사 소개서 파일 업로드
  async uploadCompanyDocument(
    file: File,
    options: DocumentUploadOptions = {}
  ): Promise<UploadResult> {
    const defaultOptions: FileUploadOptions = {
      bucket: DocumentService.BUCKET_NAME,
      folder: DocumentService.FOLDER_NAME,
      maxSize: options.maxSize || 50, // 50MB
    }

    try {
      return await this.uploadFile(file, defaultOptions)
    } catch (error) {
      console.error('문서 업로드 실패:', error)
      throw error
    }
  }

  // 파일명 생성 (요구사항에 맞게 수정: 원본파일명_timestamp)
  protected generateFileName(file: File, customName?: string): string {
    const timestamp = Date.now()
    const originalName = file.name.split('.').slice(0, -1).join('.')
    const extension = file.name.split('.').pop()

    // 원본 파일명에서 특수문자 제거
    const cleanName = originalName
      .replace(/[^a-zA-Z0-9가-힣.\-_]/g, '')
      .replace(/\s+/g, '_')

    return `${cleanName}_${timestamp}.${extension}`
  }

  // 회사 소개서 파일 목록 조회
  async getCompanyDocuments(): Promise<CompanyDocument[]> {
    try {
      const files = await this.listFiles(
        DocumentService.BUCKET_NAME,
        DocumentService.FOLDER_NAME,
        {
          sortBy: 'created_at'
        }
      )

      return files.map(file => ({
        id: file.id || file.name,
        name: file.name,
        size: file.metadata?.size || 0,
        type: file.metadata?.mimetype || 'application/octet-stream',
        url: this.getPublicUrl(DocumentService.BUCKET_NAME, `${DocumentService.FOLDER_NAME}/${file.name}`),
        path: `${DocumentService.FOLDER_NAME}/${file.name}`,
        uploadedAt: file.created_at || file.updated_at || new Date().toISOString()
      }))
    } catch (error) {
      console.error('문서 목록 조회 실패:', error)
      throw error
    }
  }

  // 최신 회사 소개서 파일 조회
  async getLatestCompanyDocument(): Promise<CompanyDocument | null> {
    try {
      const documents = await this.getCompanyDocuments()
      
      if (documents.length === 0) {
        return null
      }

      // 업로드 날짜 기준으로 최신 파일 반환
      const latestDocument = documents.reduce((latest, current) => {
        return new Date(current.uploadedAt) > new Date(latest.uploadedAt) ? current : latest
      })

      return latestDocument
    } catch (error) {
      console.error('최신 문서 조회 실패:', error)
      throw error
    }
  }

  // 파일 삭제
  async deleteCompanyDocument(fileName: string): Promise<void> {
    try {
      const filePath = `${DocumentService.FOLDER_NAME}/${fileName}`
      await this.deleteFile(DocumentService.BUCKET_NAME, filePath)
    } catch (error) {
      console.error('문서 삭제 실패:', error)
      throw error
    }
  }

  // 파일 다운로드 URL 생성
  async getDownloadUrl(fileName: string, expiresIn: number = 3600): Promise<string> {
    try {
      const filePath = `${DocumentService.FOLDER_NAME}/${fileName}`
      return await this.getSignedUrl(DocumentService.BUCKET_NAME, filePath, expiresIn)
    } catch (error) {
      console.error('다운로드 URL 생성 실패:', error)
      throw error
    }
  }
}

// 싱글톤 인스턴스 생성
export const documentService = new DocumentService()

// 유틸리티 함수들
export const getFileIcon = (fileType: string): string => {
  if (fileType.startsWith('image/')) return '🖼️'
  if (fileType.includes('pdf')) return '📄'
  if (fileType.includes('word') || fileType.includes('document')) return '📝'
  if (fileType.includes('excel') || fileType.includes('spreadsheet')) return '📊'
  if (fileType.includes('powerpoint') || fileType.includes('presentation')) return '📋'
  if (fileType.includes('zip') || fileType.includes('rar') || fileType.includes('7z')) return '🗜️'
  if (fileType.startsWith('text/')) return '📃'
  return '📁'
}
