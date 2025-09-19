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
      alert("파트너사 목록을 불러오는 중 오류가 발생했습니다.");
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

  // 파트너사 삭제
  const handleDelete = async (id: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    try {
      await partnersService.deletePartner(id);
      fetchPartners();
      alert("파트너사가 삭제되었습니다.");
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
    setShowCreateModal(true);
  };

  // 모달 닫기
  const handleCloseModal = () => {
    setShowCreateModal(false);
    setEditingPartner(null);
    setFormData({
      name: "",
      image_url: "",
      is_active: true,
      display_order: 0,
    });
  };

  // 이미지 업로드
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const imageUrl = await uploadService.uploadImage(file, "partners");
      setFormData((prev) => ({ ...prev, image_url: imageUrl || "" }));
    } catch (error) {
      console.error("이미지 업로드 중 오류:", error);
      alert("이미지 업로드 중 오류가 발생했습니다.");
    } finally {
      setUploading(false);
    }
  };

  // 파트너사 저장
  const handleSave = async () => {
    if (!formData.name.trim()) {
      alert("파트너사 이름을 입력해주세요.");
      return;
    }

    try {
      setSaving(true);
      if (editingPartner) {
        await partnersService.updatePartner(editingPartner.id, formData);
        alert("파트너사가 수정되었습니다.");
      } else {
        await partnersService.createPartner(formData);
        alert("파트너사가 생성되었습니다.");
      }
      handleCloseModal();
      fetchPartners();
    } catch (error) {
      console.error("파트너사 저장 중 오류:", error);
      alert("저장 중 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">파트너사 관리</h1>
          <p className="text-gray-400 mt-1">
            메인페이지에 표시될 파트너사를 관리합니다.
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-[#D4B98B] text-white px-4 py-2 rounded-lg hover:bg-[#C5A572] transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>파트너사 추가</span>
        </button>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#1C2A44] rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">전체 파트너사</p>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
            </div>
            <Building2 className="w-8 h-8 text-[#D4B98B]" />
          </div>
        </div>
        <div className="bg-[#1C2A44] rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">활성 파트너사</p>
              <p className="text-2xl font-bold text-green-400">
                {stats.active}
              </p>
            </div>
            <Check className="w-8 h-8 text-green-400" />
          </div>
        </div>
        <div className="bg-[#1C2A44] rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">비활성 파트너사</p>
              <p className="text-2xl font-bold text-gray-400">
                {stats.inactive}
              </p>
            </div>
            <AlertCircle className="w-8 h-8 text-gray-400" />
          </div>
        </div>
      </div>

      {/* 검색 및 필터 */}
      <div className="bg-[#1C2A44] rounded-lg p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 flex space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="파트너사 이름으로 검색..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={handleSearchKeyPress}
                className="w-full pl-10 pr-4 py-2 bg-[#0f0f23] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#D4B98B]"
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-[#D4B98B] text-white rounded-lg hover:bg-[#C5A572] transition-colors"
            >
              검색
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#0f0f23] border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#D4B98B]"
            >
              <option value="">전체 상태</option>
              <option value="active">활성</option>
              <option value="inactive">비활성</option>
            </select>
          </div>
        </div>
      </div>

      {/* 파트너사 목록 */}
      <div className="bg-[#1C2A44] rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D4B98B] mx-auto"></div>
            <p className="text-gray-400 mt-2">로딩 중...</p>
          </div>
        ) : partners.length === 0 ? (
          <div className="p-8 text-center">
            <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400">파트너사가 없습니다.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#0f0f23]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    파트너사
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    상태
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    순서
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    생성일
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                    작업
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {partners.map((partner) => (
                  <tr
                    key={partner.id}
                    className="hover:bg-[#0f0f23] transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {partner.image_url ? (
                          <img
                            src={partner.image_url}
                            alt={partner.name}
                            className="h-10 w-10 rounded-lg object-cover mr-3"
                          />
                        ) : (
                          <div className="h-10 w-10 bg-gray-600 rounded-lg flex items-center justify-center mr-3">
                            <Building2 className="w-5 h-5 text-gray-400" />
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-medium text-white">
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {partner.display_order}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
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
                          onClick={() => handleDelete(partner.id)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                          title="삭제"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 rounded-lg bg-[#1C2A44] text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#2A3F5F] transition-colors"
          >
            이전
          </button>
          <span className="px-4 py-2 text-white">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-3 py-2 rounded-lg bg-[#1C2A44] text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#2A3F5F] transition-colors"
          >
            다음
          </button>
        </div>
      )}

      {/* 생성/수정 모달 */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#1C2A44] rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">
                {editingPartner ? "파트너사 수정" : "파트너사 추가"}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  파트너사 이름 *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full px-3 py-2 bg-[#0f0f23] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#D4B98B]"
                  placeholder="파트너사 이름을 입력하세요"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  로고 이미지
                </label>
                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="w-full px-3 py-2 bg-[#0f0f23] border border-gray-700 rounded-lg text-white file:bg-[#D4B98B] file:text-white file:border-0 file:rounded file:px-3 file:py-1 file:mr-3"
                  />
                  {formData.image_url && (
                    <div className="flex items-center justify-center">
                      <img
                        src={formData.image_url}
                        alt="미리보기"
                        className="h-20 w-auto object-contain rounded-lg"
                      />
                    </div>
                  )}
                  {uploading && (
                    <p className="text-sm text-gray-400">업로드 중...</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
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
                  className="w-full px-3 py-2 bg-[#0f0f23] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#D4B98B]"
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
                <label htmlFor="is_active" className="text-sm text-gray-300">
                  메인페이지에 표시
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 bg-[#D4B98B] text-white rounded-lg hover:bg-[#C5A572] transition-colors disabled:opacity-50"
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
