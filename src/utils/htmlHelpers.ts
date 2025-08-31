export function stripHtml(html: string): string {
  if (!html) return '';
  // HTML 태그를 제거하고 텍스트만 반환
  return html.replace(/<[^>]*>/g, '').trim();
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}