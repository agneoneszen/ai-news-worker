import React from 'react';
import { TrendingUp, FileText } from 'lucide-react';
import Badge from '../ui/Badge';
import Icon from '../ui/Icon';

/**
 * 新聞卡片底部統計組件
 */
export default function NewsCardFooter({ 
  articleCount = 0, 
  categoryCount,
  categories = [] 
}) {
  return (
    <div className="px-8 py-6 bg-slate-900/60 border-t border-slate-700/50 backdrop-blur-sm">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2 px-4 py-2 bg-semantic-success-main/10 border border-semantic-success-main/30 rounded-lg">
            <Icon 
              icon={TrendingUp} 
              size={16}
              color="success"
            />
            <span className="text-xs text-text-secondary font-medium">
              來源: <span className="text-semantic-success-light font-bold">{articleCount}</span> 篇
            </span>
          </div>
          
          {categoryCount && (
            <div className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-lg">
              <Icon 
                icon={FileText} 
                size={16}
                color="info"
              />
              <span className="text-xs text-text-secondary font-medium">
                分類: <span className="text-purple-400 font-bold">{categoryCount}</span>
              </span>
            </div>
          )}
        </div>

        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {categories.map((category, i) => (
              <Badge 
                key={i} 
                variant="default"
                size="md"
                className="hover:border-primary-500/50"
              >
                {category}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

