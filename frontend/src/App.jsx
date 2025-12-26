import { useState } from 'react';
import { useNewsData } from './hooks/useNewsData'; // ✨ 確保這裡有加花括號
import NewsCard from './components/NewsCard';
import { Loader2 } from 'lucide-react';

export default function App() {
  const { news, loading } = useNewsData();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">AI</div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800">Daily Insight</h1>
          </div>
          <div className="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full">Beta v1.0</div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 space-y-4">
            <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
            <p>正在同步最新的 AI 分析報告...</p>
          </div>
        ) : news.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
            <p className="text-slate-500">目前沒有新聞資料，請執行後端 scheduler.py</p>
          </div>
        ) : (
          <div className="space-y-8">
            {news.map((item) => (
              <NewsCard key={item.id} data={item} />
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-slate-200 bg-white py-8 mt-12 text-center text-slate-400 text-sm">
        <p>© 2025 AI News Aggregator. Powered by OpenAI & Firebase.</p>
      </footer>
    </div>
  );
}