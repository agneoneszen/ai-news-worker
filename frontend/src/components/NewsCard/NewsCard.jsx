import React from 'react';
import Card from '../ui/Card';
import NewsCardHeader from './NewsCardHeader';
import NewsCardContent from './NewsCardContent';
import NewsCardFooter from './NewsCardFooter';

/**
 * 新聞卡片主組件
 * 整合標題、內容、底部統計
 */
export default function NewsCard({ data }) {
  if (!data) return null;

  return (
    <Card
      className="mb-12 overflow-hidden"
      hover
      padding="none"
      rounded="3xl"
      border
      shadow
    >
      <NewsCardHeader 
        dateStr={data.date_str} 
        id={data.id}
        createdAt={data.created_at}
      />
      
      <NewsCardContent 
        content={data.content}
        data={data}
      />
      
      <NewsCardFooter
        articleCount={data.article_count}
        categoryCount={data.category_count}
        categories={data.categories}
      />
    </Card>
  );
}

