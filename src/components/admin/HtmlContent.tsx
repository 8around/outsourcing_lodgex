'use client';

import React from 'react';
import DOMPurify from 'isomorphic-dompurify';

interface HtmlContentProps {
  content: string;
  className?: string;
}

const HtmlContent: React.FC<HtmlContentProps> = ({ content, className = '' }) => {
  // HTML 콘텐츠를 안전하게 정화
  const sanitizedContent = DOMPurify.sanitize(content, {
    ALLOWED_TAGS: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'p', 'br', 'strong', 'b', 'em', 'i', 'u', 'strike', 's',
      'ul', 'ol', 'li',
      'blockquote', 'pre', 'code',
      'a', 'img', 'video',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'div', 'span',
      'sub', 'sup'
    ],
    ALLOWED_ATTR: [
      'href', 'target', 'rel', 'src', 'alt', 'width', 'height',
      'class', 'id', 'style', 'align', 'colspan', 'rowspan'
    ],
    ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto|tel|ftp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
  });

  return (
    <div 
      className={`prose prose-lg max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
};

export default HtmlContent;