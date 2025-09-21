'use client';

interface BoardHeaderProps {
  title: string;
  description: string;
  totalPosts: number;
}

export const BoardHeader = ({ title, description, totalPosts }: BoardHeaderProps) => {
  return (
    <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
      {/* Add subtle overlay for better text contrast */}
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 drop-shadow-lg">{title}</h1>
          <p className="text-xl text-white/95 mb-4 max-w-3xl mx-auto drop-shadow" dangerouslySetInnerHTML={{ __html: description }}></p>
          <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
            <span className="text-sm font-medium">총 {totalPosts}개의 게시글</span>
          </div>
        </div>
      </div>
    </div>
  );
};