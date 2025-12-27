import React from 'react';
import { Calendar, X } from 'lucide-react';

/**
 * 日期選擇器組件
 * 橫向滾動的日期按鈕列表
 */
export default function DateSelector({ dates, selectedDate, onDateSelect, onDateDeselect }) {
  // 格式化日期顯示
  const formatDateButton = (dateStr) => {
    if (!dateStr) return { weekday: '', day: '', date: '' };
    
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) {
        // 如果不是有效日期，嘗試解析 YYYY-MM-DD 格式
        const [year, month, day] = dateStr.split('-');
        if (year && month && day) {
          const d = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
          const weekdays = ['週日', '週一', '週二', '週三', '週四', '週五', '週六'];
          const weekdayEn = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
          return {
            weekday: weekdays[d.getDay()],
            weekdayEn: weekdayEn[d.getDay()],
            day: `${month}/${day}`
          };
        }
        return { weekday: '', day: '', date: dateStr };
      }
      
      const weekdays = ['週日', '週一', '週二', '週三', '週四', '週五', '週六'];
      const weekdayEn = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      
      return {
        weekday: weekdays[date.getDay()],
        weekdayEn: weekdayEn[date.getDay()],
        day: `${month}/${day}`
      };
    } catch (e) {
      return { weekday: '', day: '', date: dateStr };
    }
  };

  return (
    <div className="
      flex items-center 
      gap-2 
      overflow-x-auto 
      pb-2 
      scrollbar-hide
    ">
      {dates.map((dateStr) => {
        const formatted = formatDateButton(dateStr);
        const isSelected = selectedDate === dateStr;
        
        return (
          <button
            key={dateStr}
            onClick={() => {
              if (isSelected && onDateDeselect) {
                onDateDeselect();
              } else {
                onDateSelect(dateStr);
              }
            }}
            className={`
              flex-shrink-0 
              px-4 py-2 
              rounded-lg 
              font-medium 
              text-sm 
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              ${isSelected 
                ? 'bg-blue-500 text-white shadow-md' 
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }
            `}
            aria-label={`選擇日期 ${formatted.day}`}
            aria-pressed={isSelected}
          >
            <div className="flex items-center gap-2">
              <span className="text-xs">{formatted.weekday}</span>
              <span className="text-xs font-normal">{formatted.weekdayEn}</span>
              <span className="text-sm font-semibold">{formatted.day}</span>
              {isSelected && (
                <X 
                  size={14} 
                  className="ml-1 opacity-70 hover:opacity-100" 
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onDateDeselect) onDateDeselect();
                  }}
                />
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}

