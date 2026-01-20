'use client';

import { useState } from 'react';
import { Input } from '@/components/ui';
import { BoardCategory } from '@/types';

interface BoardSearchProps {
  categories: BoardCategory[];
  selectedCategory: string;
  searchQuery: string;
  onCategoryChange: (category: string) => void;
  onSearchChange: (query: string) => void;
  onSearch: () => void;
}

export const BoardSearch = ({
  categories,
  selectedCategory,
  searchQuery,
  onCategoryChange,
  onSearchChange,
  onSearch
}: BoardSearchProps) => {
  const [localQuery, setLocalQuery] = useState(searchQuery);

  const handleSearch = () => {
    onSearchChange(localQuery);
    onSearch();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 카테고리 필터 */}
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.name}
              {category.postCount > 0 && (
                <span className="ml-1 text-xs opacity-75">
                  ({category.postCount})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* 검색창 */}
        <div className="flex gap-3">
          <div className="flex-1">
            <Input
              label=""
              name="search"
              type="text"
              placeholder="제목, 내용으로 검색하세요..."
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full"
            />
          </div>
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            검색
          </button>
        </div>
      </div>
    </div>
  );
};