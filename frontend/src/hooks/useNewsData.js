import { useState, useEffect } from 'react';
import { db } from '../firebase'; 
import { collection, query, onSnapshot, limit } from 'firebase/firestore';

export function useNewsData() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('🔍 [useNewsData] 開始讀取 Firestore...');
    
    // 查詢 daily_news collection，取最新 5 筆
    // 注意：如果使用 orderBy，需要在 Firestore 建立索引
    // 暫時不使用 orderBy，直接取前 5 筆，然後在客戶端排序
    const q = query(
      collection(db, "daily_news"),
      limit(10) // 多取一些以確保有資料
    );

    const unsubscribe = onSnapshot(
      q, 
      (snapshot) => {
        console.log('📊 [useNewsData] 收到快照，文件數:', snapshot.size);
        console.log('📊 [useNewsData] 查詢的 Collection:', 'daily_news');
        console.log('📊 [useNewsData] 查詢的 Project ID:', import.meta.env.VITE_FIREBASE_PROJECT_ID || '未設定');
        
        if (snapshot.empty) {
          console.warn('⚠️ [useNewsData] 資料庫是空的');
          console.warn('⚠️ [useNewsData] 可能原因:');
          console.warn('   1. 後端還沒執行');
          console.warn('   2. 前端和後端使用不同的 Firebase 專案');
          console.warn('   3. Firestore 規則不允許讀取');
          console.warn('   4. Collection 名稱不匹配');
          setNews([]);
          setError('目前沒有新聞資料，請等待後端排程器執行');
        } else {
          const newsData = snapshot.docs.map(doc => {
            const data = doc.data();
            console.log('📄 [useNewsData] 文件:', doc.id, '內容長度:', data.content?.length || 0);
            return {
              id: doc.id,
              date_str: data.date_str || doc.id, 
              created_at: data.created_at,
              ...data
            };
          });
          
          // 按日期降序排序（最新的在前）
          newsData.sort((a, b) => {
            const dateA = a.date_str || a.id;
            const dateB = b.date_str || b.id;
            return dateB.localeCompare(dateA); // 降序
          });
          
          // 只取前 5 筆
          const latestNews = newsData.slice(0, 5);
          
          console.log('✅ [useNewsData] 成功載入', latestNews.length, '筆資料');
          setNews(latestNews);
          setError(null);
        }
        setLoading(false);
      }, 
      (error) => {
        console.error('❌ [useNewsData] Firebase 讀取錯誤:', error);
        setError(`讀取錯誤: ${error.message}`);
        setLoading(false);
      }
    );

    return () => {
      console.log('🧹 [useNewsData] 清理訂閱');
      unsubscribe();
    };
  }, []);

  return { news, loading, error };
}
