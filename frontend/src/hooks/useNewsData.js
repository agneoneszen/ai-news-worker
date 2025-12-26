import { useState, useEffect } from 'react';
import { db } from '../firebase'; 
import { collection, query, onSnapshot, limit, orderBy } from 'firebase/firestore';

export function useNewsData() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('🔍 [useNewsData] 開始讀取 Firestore...');
    
    // 查詢 daily_news collection，按日期降序排列，取最新 5 筆
    const q = query(
      collection(db, "daily_news"),
      orderBy("created_at", "desc"), // 按建立時間降序
      limit(5)
    );

    const unsubscribe = onSnapshot(
      q, 
      (snapshot) => {
        console.log('📊 [useNewsData] 收到快照，文件數:', snapshot.size);
        
        if (snapshot.empty) {
          console.warn('⚠️ [useNewsData] 資料庫是空的');
          setNews([]);
          setError('目前沒有新聞資料，請等待後端排程器執行');
        } else {
          const newsData = snapshot.docs.map(doc => {
            const data = doc.data();
            console.log('📄 [useNewsData] 文件:', doc.id, '內容長度:', data.content?.length || 0);
            return {
              id: doc.id,
              date_str: data.date_str || doc.id, 
              ...data
            };
          });
          console.log('✅ [useNewsData] 成功載入', newsData.length, '筆資料');
          setNews(newsData);
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
