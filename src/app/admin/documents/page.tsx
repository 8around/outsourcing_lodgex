"use client";

import { useState, useEffect } from "react";
import {
  documentService,
  type CompanyDocument,
} from "@/services/admin/documents";
import { formatFileSize } from "@/services/admin/storage";
import { Button } from "@/components/ui";
import LoadingSpinner from "@/components/admin/LoadingSpinner";
import { Download, Trash2 } from "lucide-react";

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<CompanyDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      setIsLoading(true);
      const docs = await documentService.getCompanyDocuments();
      setDocuments(docs);
    } catch (error) {
      console.error("문서 목록 로드 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setUploadError(null);

      await documentService.uploadCompanyDocument(file);
      await loadDocuments(); // 목록 새로고침

      // 파일 입력 필드 초기화
      event.target.value = "";
    } catch (error) {
      console.error("파일 업로드 실패:", error);
      setUploadError(
        error instanceof Error ? error.message : "파일 업로드에 실패했습니다."
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteDocument = async (fileName: string) => {
    try {
      await documentService.deleteCompanyDocument(fileName);
      await loadDocuments(); // 목록 새로고침
      setDeleteConfirm(null);
    } catch (error) {
      console.error("문서 삭제 실패:", error);
      alert("문서 삭제에 실패했습니다.");
    }
  };

  const handleDownload = async (doc: CompanyDocument) => {
    try {
      const link = globalThis.document.createElement("a");
      link.href = doc.url;
      link.download = doc.name;
      link.target = "_blank";
      link.rel = "noopener noreferrer";

      globalThis.document.body.appendChild(link);
      link.click();
      globalThis.document.body.removeChild(link);
    } catch (error) {
      console.error("다운로드 실패:", error);
      alert("파일 다운로드에 실패했습니다.");
    }
  };

  return (
    <div className="p-6">
      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          회사 소개서 관리
        </h1>
        <p className="text-gray-600">
          회사 소개서 파일을 업로드하고 관리할 수 있습니다. 업로드된 파일 중
          가장 최신 파일을 방문자들이 다운로드 합니다.
        </p>
      </div>

      {/* 파일 업로드 섹션 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          새 파일 업로드
        </h2>

        <div className="space-y-4">
          <div>
            <input
              id="file-upload"
              type="file"
              onChange={handleFileUpload}
              disabled={isUploading}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-600 file:text-white hover:file:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {isUploading && (
            <div className="flex items-center gap-2 text-blue-600">
              <LoadingSpinner size="sm" />
              <span>업로드 중...</span>
            </div>
          )}

          {uploadError && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
              {uploadError}
            </div>
          )}
        </div>
      </div>

      {/* 파일 목록 테이블 */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                파일명
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                크기
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                업로드 일시
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                작업
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  로딩 중...
                </td>
              </tr>
            ) : documents.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  업로드된 파일이 없습니다.
                </td>
              </tr>
            ) : (
              documents.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500">{doc.name}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {formatFileSize(doc.size)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(doc.uploadedAt).toLocaleString("ko-KR")}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleDownload(doc)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Download className="w-4 h-4" />
                      </button>

                      {deleteConfirm === doc.name ? (
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setDeleteConfirm(null)}
                          >
                            취소
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleDeleteDocument(doc.name)}
                            className="bg-red-600 hover:bg-red-700 text-white"
                          >
                            삭제
                          </Button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirm(doc.name)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
