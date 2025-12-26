import { useState, useEffect } from 'react';
import { db } from '../firebase'; 
import { collection, query, onSnapshot, limit, getDocs } from 'firebase/firestore';

export function useNewsData() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('🔍 [useNewsData] 開始讀取 Firestore...');
    console.log('🔍 [useNewsData] 使用的 db 實例:', db);
    console.log('🔍 [useNewsData] 查詢的 Collection:', 'daily_news');
    console.log('🔍 [useNewsData] 查詢的 Project ID:', import.meta.env.VITE_FIREBASE_PROJECT_ID || '未設定');
    
    // 先嘗試直接讀取一次，看看能否獲取資料
    const testQuery = async () => {
      try {
        const testCollection = collection(db, "daily_news");
        const testSnapshot = await getDocs(testCollection);
        console.log('🧪 [測試查詢] 直接查詢結果，文件數:', testSnapshot.size);
        testSnapshot.forEach((doc) => {
          console.log('🧪 [測試查詢] 文件 ID:', doc.id);
          console.log('🧪 [測試查詢] 文件資料:', doc.data());
        });
      } catch (testError) {
        console.error('🧪 [測試查詢] 錯誤:', testError);
      }
    };
    testQuery();
    
    // 查詢 daily_news collection，獲取所有文章
    // 注意：如果使用 orderBy，需要在 Firestore 建立索引
    // 暫時不使用 orderBy，直接取所有，然後在客戶端排序
    const q = query(
      collection(db, "daily_news")
      // 移除 limit，獲取所有文章
    );

    const unsubscribe = onSnapshot(
      q, 
      (snapshot) => {
        console.log('📊 [useNewsData] 收到快照，文件數:', snapshot.size);
        console.log('📊 [useNewsData] 查詢的 Collection:', 'daily_news');
        console.log('📊 [useNewsData] 查詢的 Project ID:', import.meta.env.VITE_FIREBASE_PROJECT_ID || '未設定');
        
        // 詳細日誌：列出所有文件
        if (snapshot.size > 0) {
          console.log('📄 [useNewsData] 找到的文件列表:');
          snapshot.forEach((doc) => {
            console.log(`  - 文件 ID: ${doc.id}`);
            const data = doc.data();
            console.log(`  - 內容長度: ${data.content?.length || 0} 字元`);
            console.log(`  - 文章數: ${data.article_count || 0}`);
            console.log(`  - 日期: ${data.date_str || doc.id}`);
          });
        }
        
        if (snapshot.empty) {
          console.warn('⚠️ [useNewsData] 資料庫是空的');
          console.warn('⚠️ [useNewsData] 可能原因:');
          console.warn('   1. 後端還沒執行');
          console.warn('   2. 前端和後端使用不同的 Firebase 專案');
          console.warn('   3. Firestore 規則不允許讀取');
          console.warn('   4. Collection 名稱不匹配');
          console.warn('   5. 查詢語法問題');
          setNews([]);
          setError('目前沒有新聞資料，請等待後端排程器執行');
        } else {
          const newsData = snapshot.docs.map(doc => {
            const data = doc.data();
            console.log('📄 [useNewsData] 處理文件:', doc.id, '內容長度:', data.content?.length || 0);
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
          
          console.log('✅ [useNewsData] 成功載入', newsData.length, '筆資料');
          setNews(newsData);
          setError(null);
        }
        setLoading(false);
      }, 
      (error) => {
        console.error('❌ [useNewsData] Firebase 讀取錯誤:', error);
        console.error('❌ [useNewsData] 錯誤代碼:', error.code);
        console.error('❌ [useNewsData] 錯誤訊息:', error.message);
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
