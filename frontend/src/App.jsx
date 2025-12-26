import { useState, useEffect, useMemo } from 'react';
import { useNewsData } from './hooks/useNewsData';
import NewsCard from './components/NewsCard/NewsCard';
import { Loader2, AlertCircle, FileText, ArrowLeft, Users, MoreVertical, Plus } from 'lucide-react';
import DateSelector from './components/DateSelector';
import SearchBar from './components/SearchBar';
import BottomNav from './components/BottomNav';

export default function App() {
  const { news, loading, error } = useNewsData();
  const [selectedDate, setSelectedDate] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('reports');
  
  // 調試：檢查 Firebase 配置
  useEffect(() => {
    console.log('🔧 [App] Firebase 配置檢查:');
    console.log('  - VITE_FIREBASE_API_KEY:', import.meta.env.VITE_FIREBASE_API_KEY ? '已設定' : '未設定');
    console.log('  - VITE_FIREBASE_PROJECT_ID:', import.meta.env.VITE_FIREBASE_PROJECT_ID || '未設定');
  }, []);

  // 獲取所有日期並排序
  const availableDates = useMemo(() => {
    const dates = news.map(item => item.date_str || item.id).filter(Boolean);
    return [...new Set(dates)].sort().reverse(); // 降序，最新的在前
  }, [news]);

  // 獲取日期範圍
  const dateRange = useMemo(() => {
    if (availableDates.length === 0) return null;
    const sorted = [...availableDates].sort();
    return `${sorted[0]} - ${sorted[sorted.length - 1]}`;
  }, [availableDates]);

  // 過濾報告（根據選中的日期和搜索詞）
  const filteredNews = useMemo(() => {
    let filtered = news;
    
    // 按日期過濾
    if (selectedDate) {
      filtered = filtered.filter(item => (item.date_str || item.id) === selectedDate);
    }
    
    // 按搜索詞過濾
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(item => 
        item.content?.toLowerCase().includes(term) ||
        item.date_str?.toLowerCase().includes(term) ||
        item.categories?.some(cat => cat.toLowerCase().includes(term))
      );
    }
    
    return filtered;
  }, [news, selectedDate, searchTerm]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20">
      {/* 頂部導航欄 - 參考圖片設計 */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3">
          {/* 第一行：標題和操作 */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <button className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
                <ArrowLeft size={20} className="text-slate-700" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Daily Insight</h1>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-slate-500">連線</span>
                  {dateRange && (
                    <>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs text-slate-500">{dateRange}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded">
                v1.0.0
              </div>
              <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <Users size={18} className="text-slate-700" />
              </button>
              <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <MoreVertical size={18} className="text-slate-700" />
              </button>
            </div>
          </div>
          
          {/* 搜索欄 */}
          <div className="mb-3">
            <SearchBar 
              onSearch={setSearchTerm}
              placeholder="Q 搜尋報告內容..."
            />
          </div>
          
          {/* 日期選擇器 */}
          {availableDates.length > 0 && (
            <DateSelector
              dates={availableDates}
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
              onDateDeselect={() => setSelectedDate(null)}
            />
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-6">
            <div className="relative">
              <Loader2 className="w-16 h-16 animate-spin text-blue-500" />
              <div className="absolute inset-0 w-16 h-16 border-4 border-blue-200 rounded-full"></div>
            </div>
            <p className="text-slate-700 text-lg font-medium">正在同步最新的 AI 分析報告...</p>
            <p className="text-slate-500 text-sm">這可能需要幾秒鐘</p>
          </div>
        ) : error ? (
          <div className="text-center py-24 bg-red-50 rounded-2xl border border-red-200">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
            <p className="text-red-700 font-semibold text-xl mb-3">讀取資料時發生錯誤</p>
            <p className="text-red-600 text-sm mb-6">{error}</p>
            <p className="text-slate-500 text-xs">請檢查 Firebase 配置和 Firestore 規則</p>
          </div>
        ) : filteredNews.length === 0 ? (
          <div className="text-center py-24 bg-slate-100 rounded-2xl border border-dashed border-slate-300">
            <FileText className="w-16 h-16 text-slate-400 mx-auto mb-6" />
            <p className="text-slate-700 text-lg font-medium mb-2">
              {searchTerm || selectedDate ? '沒有找到符合條件的報告' : '目前沒有新聞資料'}
            </p>
            <p className="text-slate-500 text-sm">
              {searchTerm || selectedDate 
                ? '請嘗試調整搜索條件或選擇其他日期' 
                : '請等待後端排程器執行，或檢查 Firestore 是否有資料'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredNews.map((item) => (
              <NewsCard key={item.id} data={item} />
            ))}
          </div>
        )}
      </main>

      {/* 浮動操作按鈕 */}
      <button className="fixed bottom-20 right-4 w-14 h-14 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors flex items-center justify-center z-40">
        <Plus size={24} />
      </button>

      {/* 底部導航欄 */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}