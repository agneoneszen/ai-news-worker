import { useState, useEffect } from 'react';
import { db } from '../firebase'; 
import { collection, query, onSnapshot, limit } from 'firebase/firestore';

export function useNewsData() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 移除 orderBy 以免因欄位缺失導致失敗
    const q = query(
      collection(db, "daily_news"),
      limit(5)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
        console.log("資料庫是空的");
        setNews([]);
      } else {
        const newsData = snapshot.docs.map(doc => ({
          id: doc.id,
          // 優先使用文件 ID 作為日期顯示
          date_str: doc.data().date_str || doc.id, 
          ...doc.data()
        }));
        setNews(newsData);
      }
      setLoading(false);
    }, (error) => {
      console.error("Firebase 讀取錯誤:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { news, loading };
}