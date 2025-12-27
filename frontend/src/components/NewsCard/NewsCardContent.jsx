import React from 'react';
import MarkdownRenderer from '../MarkdownRenderer';
import DebugInfo from '../DebugInfo';

/**
 * 新聞卡片內容組件
 * 顯示完整的 Markdown 內容
 */
export default function NewsCardContent({ content, data }) {
  return (
    <div className="px-6 py-8">
      <DebugInfo data={data} />
      <MarkdownRenderer content={content} />
    </div>
  );
}
