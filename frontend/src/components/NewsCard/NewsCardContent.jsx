import React from 'react';
import MarkdownRenderer from '../MarkdownRenderer';

/**
 * 新聞卡片內容組件
 */
export default function NewsCardContent({ content }) {
  return (
    <div className="p-8 sm:p-10 px-6 sm:px-8">
      <MarkdownRenderer content={content} />
    </div>
  );
}

