"use client";

import { useState, useEffect } from "react";
import { partnersService, PartnersResponse } from "@/services/admin/partners";
import { uploadService } from "@/services/admin/upload";
import { Partner } from "@/types";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Filter,
  Building2,
  X,
  Check,
  AlertCircle,
} from "lucide-react";

export default function PartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0 });

  // 모달 상태
  const [formData, setFormData] = useState({
    name: "",
    image_url: "",
    is_active: true,
    display_order: 0,
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  // 파트너사 목록 조회
  const fetchPartners = async () => {
    try {
      setLoading(true);
      const filters: any = {};

      if (searchTerm) filters.search = searchTerm;
      if (statusFilter) filters.is_active = statusFilter === "active";

      const response: PartnersResponse = await partnersService.getPartners(
        filters,
        {
          page: currentPage,
          per_page: 10,
          sort_by: "display_order",
          sort_direction: "asc",
        }
      );

      setPartners(response.data);
      setTotalPages(response.total_pages);

      // 통계 조회
      const statsData = await partnersService.getPartnerStats();
      setStats(statsData);
    } catch (error) {
      console.error("파트너사 목록 조회 중 오류:", error);
    } finally {
      setLoading(false);
    }
  };

  // 검색 실행
  const handleSearch = () => {
    setSearchTerm(searchInput);
    setCurrentPage(1);
  };

  // 검색 엔터 키 처리
  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  useEffect(() => {
    fetchPartners();
  }, [currentPage, statusFilter, searchTerm]);

  // 컴포넌트 cleanup - blob URL 정리
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // 파트너사 삭제
  const handleDelete = async (partner: Partner) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    try {
      await partnersService.deletePartner(partner.id, partner.image_url);
      fetchPartners();
    } catch (error) {
      console.error("파트너사 삭제 중 오류:", error);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  // 파트너사 편집
  const handleEdit = (partner: Partner) => {
    setEditingPartner(partner);
    setFormData({
      name: partner.name,
      image_url: partner.image_url || "",
      is_active: partner.is_active || false,
      display_order: partner.display_order || 0,
    });
    // 기존 이미지를 미리보기로 설정
    if (partner.image_url) {
      setImagePreview(partner.image_url);
    }
    setShowCreateModal(true);
  };

  // 모달 닫기
  const handleCloseModal = () => {
    // blob URL 정리
    if (imagePreview && imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview);
    }
    
    setShowCreateModal(false);
    setEditingPartner(null);
    setSelectedFile(null);
    setImagePreview("");
    setFormData({
      name: "",
      image_url: "",
      is_active: true,
      display_order: 0,
    });
  };

  // 이미지 업로드
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 이전 미리보기 URL 정리
    if (imagePreview && imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview);
    }

    // 파일 저장 및 미리보기 생성
    setSelectedFile(file);
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  // 파트너사 저장
  const handleSave = async () => {
    if (!formData.name.trim()) {
      alert("파트너사 이름을 입력해주세요.");
      return;
    }

    try {
      setSaving(true);
      let finalImageUrl = formData.image_url;

      // 새 이미지가 선택되었을 경우
      if (selectedFile) {
        setUploading(true);
        
        // 수정 모드이고 기존 이미지가 있으면 삭제
        if (editingPartner && editingPartner.image_url) {
          await uploadService.deleteImage(editingPartner.image_url);
        }
        
        // 새 이미지 업로드
        const uploadedUrl = await uploadService.uploadImage(selectedFile, "partners");
        if (uploadedUrl) {
          finalImageUrl = uploadedUrl;
        } else {
          alert("이미지 업로드에 실패했습니다.");
          return;
        }
        setUploading(false);
      }

      // 파트너사 정보 저장
      const saveData = { ...formData, image_url: finalImageUrl };
      
      if (editingPartner) {
        await partnersService.updatePartner(editingPartner.id, saveData);
      } else {
        await partnersService.createPartner(saveData);
      }
      
      handleCloseModal();
      fetchPartners();
    } catch (error) {
      console.error("파트너사 저장 중 오류:", error);
      alert("저장 중 오류가 발생했습니다.");
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">파트너사 관리</h1>
          <p className="text-sm text-gray-400 mt-1">
            메인페이지에 표시될 파트너사를 관리합니다.
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>파트너사 추가</span>
        </button>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">전체 파트너사</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Building2 className="w-8 h-8 text-blue-400" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">활성 파트너사</p>
              <p className="text-2xl font-bold text-green-600">
                {stats.active}
              </p>
            </div>
            <Check className="w-8 h-8 text-green-400" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">비활성 파트너사</p>
              <p className="text-2xl font-bold text-gray-600">
                {stats.inactive}
              </p>
            </div>
            <AlertCircle className="w-8 h-8 text-gray-400" />
          </div>
        </div>
      </div>

      {/* 검색 및 필터 */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="파트너사 이름"
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
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">전체 상태</option>
            <option value="active">활성</option>
            <option value="inactive">비활성</option>
          </select>
        </div>
      </div>

      {/* 파트너사 목록 */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  파트너사
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  상태
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  순서
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  생성일
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  작업
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    로딩 중...
                  </td>
                </tr>
              ) : partners.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    파트너사가 없습니다.
                  </td>
                </tr>
              ) : (
                partners.map((partner) => (
                  <tr
                    key={partner.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {partner.image_url ? (
                          <img
                            src={partner.image_url}
                            alt={partner.name}
                            className="h-10 w-10 border border-gray-200 rounded-lg object-cover mr-3"
                          />
                        ) : (
                          <div className="h-10 w-10 bg-gray-200 rounded-lg flex items-center justify-center mr-3">
                            <Building2 className="w-5 h-5 text-gray-400" />
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {partner.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          partner.is_active
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {partner.is_active ? "활성" : "비활성"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {partner.display_order}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {partner.created_at
                        ? new Date(partner.created_at).toLocaleDateString(
                            "ko-KR",
                            {
                              timeZone: "Asia/Seoul",
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                            }
                          )
                        : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(partner)}
                          className="text-blue-400 hover:text-blue-300 transition-colors"
                          title="수정"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(partner)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                          title="삭제"
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

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            이전
          </button>
          <span className="px-4 py-2 text-gray-700">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-3 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            다음
          </button>
        </div>
      )}

      {/* 생성/수정 모달 */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {editingPartner ? "파트너사 수정" : "파트너사 추가"}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  파트너사 이름 *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="파트너사 이름을 입력하세요"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  로고 이미지
                </label>
                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 file:bg-blue-600 file:text-white file:border-0 file:rounded file:px-3 file:py-1 file:mr-3"
                  />
                  {imagePreview && (
                    <div className="flex items-center justify-center">
                      <img
                        src={imagePreview}
                        alt="미리보기"
                        className="h-20 w-auto object-contain rounded-lg"
                      />
                    </div>
                  )}
                  {uploading && (
                    <p className="text-sm text-gray-600">업로드 중...</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  표시 순서
                </label>
                <input
                  type="number"
                  value={formData.display_order}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      display_order: parseInt(e.target.value) || 0,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      is_active: e.target.checked,
                    }))
                  }
                  className="mr-2"
                />
                <label htmlFor="is_active" className="text-sm text-gray-700">
                  메인페이지에 표시
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {saving ? "저장 중..." : "저장"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
