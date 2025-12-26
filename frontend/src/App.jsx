import { useState, useEffect } from 'react';
import { useNewsData } from './hooks/useNewsData'; // ✨ 確保這裡有加花括號
import NewsCard from './components/NewsCard';
import { Loader2, AlertCircle, FileText } from 'lucide-react';

export default function App() {
  const { news, loading, error } = useNewsData();
  
  // 調試：檢查 Firebase 配置
  useEffect(() => {
    console.log('🔧 [App] Firebase 配置檢查:');
    console.log('  - VITE_FIREBASE_API_KEY:', import.meta.env.VITE_FIREBASE_API_KEY ? '已設定' : '未設定');
    console.log('  - VITE_FIREBASE_PROJECT_ID:', import.meta.env.VITE_FIREBASE_PROJECT_ID || '未設定');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100 font-sans">
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50 sticky top-0 z-10 shadow-lg">
        <div className="max-w-4xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/30">
              AI
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">Daily Insight</h1>
              <p className="text-xs text-slate-400">AI-Powered News Intelligence</p>
            </div>
          </div>
          <div className="text-xs text-slate-300 bg-slate-800/50 border border-slate-700/50 px-4 py-1.5 rounded-full font-medium">
            Beta v1.0
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-6">
            <div className="relative">
              <Loader2 className="w-16 h-16 animate-spin text-blue-400" />
              <div className="absolute inset-0 w-16 h-16 border-4 border-blue-500/20 rounded-full"></div>
            </div>
            <p className="text-slate-300 text-lg font-medium">正在同步最新的 AI 分析報告...</p>
            <p className="text-slate-500 text-sm">這可能需要幾秒鐘</p>
          </div>
        ) : error ? (
          <div className="text-center py-24 bg-gradient-to-br from-red-900/20 to-red-800/10 rounded-3xl border border-red-500/30 backdrop-blur-sm">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-6" />
            <p className="text-red-300 font-semibold text-xl mb-3">讀取資料時發生錯誤</p>
            <p className="text-red-400 text-sm mb-6">{error}</p>
            <p className="text-slate-400 text-xs">請檢查 Firebase 配置和 Firestore 規則</p>
          </div>
        ) : news.length === 0 ? (
          <div className="text-center py-24 bg-slate-800/30 rounded-3xl border border-dashed border-slate-700/50 backdrop-blur-sm">
            <FileText className="w-16 h-16 text-slate-500 mx-auto mb-6" />
            <p className="text-slate-300 text-lg font-medium mb-2">目前沒有新聞資料</p>
            <p className="text-slate-500 text-sm">請等待後端排程器執行，或檢查 Firestore 是否有資料</p>
          </div>
        ) : (
          <div className="space-y-12">
            {news.map((item) => (
              <NewsCard key={item.id} data={item} />
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-slate-700/50 bg-slate-900/50 backdrop-blur-sm py-10 mt-16 text-center">
        <p className="text-slate-400 text-sm">
          © 2025 AI News Aggregator. Powered by OpenAI & Firebase.
        </p>
        <p className="text-slate-500 text-xs mt-2">
          Daily automated news analysis and intelligence reports
        </p>
      </footer>
    </div>
  );
}