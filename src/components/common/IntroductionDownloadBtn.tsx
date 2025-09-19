"use client";

import { useState, useEffect } from "react";
import {
  introductionService,
  type Introduction,
} from "@/services/admin/introductions";

interface IntroductionDownloadBtnProps {
  className?: string;
}

export function IntroductionDownloadBtn({
  className = "",
}: IntroductionDownloadBtnProps) {
  const [introduction, setIntroduction] = useState<Introduction | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    loadLatestIntroduction();
  }, []);

  const loadLatestIntroduction = async () => {
    try {
      setIsLoading(true);
      const latestDoc = await introductionService.getLatestIntroduction();
      setIntroduction(latestDoc);
    } catch (err) {
      console.error("문서 로드 실패:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!introduction) return;

    try {
      setIsDownloading(true);
      window.open(introduction.url, "_blank");
    } catch (err) {
      console.error("다운로드 실패:", err);
    } finally {
      setIsDownloading(false);
    }
  };

  // 다운로드 버튼
  return !isLoading && introduction ? (
    <div className={`${className}`}>
      <button
        onClick={handleDownload}
        disabled={isDownloading}
        className="inline-flex items-center gap-3 bg-accent-500 hover:bg-accent-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        aria-label={`회사 소개서 다운로드: ${introduction.name}`}
      >
        {isDownloading ? (
          <>
            <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
            <span>다운로드 중...</span>
          </>
        ) : (
          <>
            <svg
              className="h-7 w-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span>회사 소개서 다운로드</span>
          </>
        )}
      </button>
    </div>
  ) : null;
}
