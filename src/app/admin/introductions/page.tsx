"use client";

import { useState, useEffect } from "react";
import {
  introductionService,
  type Introduction,
} from "@/services/admin/introductions";
import { formatFileSize } from "@/services/admin/storage";
import { Download, Plus, Trash2 } from "lucide-react";

export default function IntroductionsPage() {
  const [introductions, setIntroductions] = useState<Introduction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    loadIntroductions();
  }, []);

  const loadIntroductions = async () => {
    try {
      setIsLoading(true);
      const introductions = await introductionService.getIntroductions();
      setIntroductions(introductions);
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

      await introductionService.uploadIntroduction(file);
      await loadIntroductions(); // 목록 새로고침

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

  const handleDeleteIntroduction = async (fileName: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    try {
      await introductionService.deleteIntroduction(fileName);
      await loadIntroductions(); // 목록 새로고침
    } catch (error) {
      console.error("문서 삭제 실패:", error);
      alert("문서 삭제에 실패했습니다.");
    }
  };

  const handleDownload = async (introduction: Introduction) => {
    try {
      window.open(introduction.url, "_blank");
    } catch (error) {
      console.error("다운로드 실패:", error);
      alert("파일 다운로드에 실패했습니다.");
    }
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">회사 소개서 관리</h1>
          <p className="text-sm text-gray-400 mt-1">
            회사 소개서 파일을 업로드하고 관리할 수 있습니다. 업로드된 파일 중
            가장 최신 파일을 방문자들이 다운로드 합니다.
          </p>
        </div>
        <div className="relative">
          <input
            id="file-upload"
            type="file"
            onChange={handleFileUpload}
            disabled={isUploading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          />
          <button
            disabled={isUploading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
            <span>{isUploading ? "업로드 중..." : "파일 업로드"}</span>
          </button>
        </div>
      </div>

      {/* 업로드 에러 표시 */}
      {uploadError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-red-800">{uploadError}</div>
        </div>
      )}

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
            ) : introductions.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  업로드된 파일이 없습니다.
                </td>
              </tr>
            ) : (
              introductions.map((introduction) => (
                <tr key={introduction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500">
                      {introduction.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {formatFileSize(introduction.size)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(introduction.uploadedAt).toLocaleString("ko-KR")}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleDownload(introduction)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Download className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() =>
                          handleDeleteIntroduction(introduction.name)
                        }
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
      </div>
    </div>
  );
}
