import React from 'react';
import MarkdownRenderer from '../MarkdownRenderer';
import DebugInfo from '../DebugInfo';

/**
 * 新聞卡片內容組件
 */
export default function NewsCardContent({ content, data }) {
  return (
    <div className="p-8 sm:p-10 px-6 sm:px-8">
      <DebugInfo data={data} />
      <MarkdownRenderer content={content} />
    </div>
  );
}

