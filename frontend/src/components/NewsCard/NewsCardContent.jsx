import React from 'react';
import MarkdownRenderer from '../MarkdownRenderer';
import DebugInfo from '../DebugInfo';

/**
 * 新聞卡片內容組件
 * 顯示完整的 Markdown 內容
 */
export default function NewsCardContent({ content, data }) {
  return (
    <div className="p-6">
      <DebugInfo data={data} />
      <MarkdownRenderer content={content} />
    </div>
  );
}
