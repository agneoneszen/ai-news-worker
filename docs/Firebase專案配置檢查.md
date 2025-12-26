# 🔍 Firebase 專案配置檢查

## ❌ 問題：資料庫有資料但 UI 未展示

可能原因：
1. **前端連接到不同的 Firebase 專案**
2. **Collection 名稱不匹配**
3. **資料結構不匹配**
4. **Firestore 規則問題**

---

## ✅ 檢查步驟

### 步驟 1: 確認前端 Firebase 專案 ID

**檔案**: `frontend/src/firebase.js`

查看 `projectId`：
```javascript
projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID"
```

**檢查**:
1. 前往 Vercel Dashboard > Settings > Environment Variables
2. 確認 `VITE_FIREBASE_PROJECT_ID` 的值
3. 或查看 Console 輸出中的 `Project ID: ai-news-worker`

### 步驟 2: 確認後端 Firebase 專案 ID

**檔案**: `backend/serviceAccountKey.json` 或環境變數 `SERVICE_ACCOUNT_KEY`

**檢查**:
1. 前往 Railway Dashboard > Variables
2. 查看 `SERVICE_ACCOUNT_KEY` 中的 `project_id`
3. 或查看本地 `backend/serviceAccountKey.json` 中的 `project_id`

### 步驟 3: 比對專案 ID

**前端 Project ID** 必須與 **後端 Project ID** 完全一致！

如果不一致：
- 前端會連接到不同的 Firebase 專案
- 即使後端寫入資料，前端也讀取不到

### 步驟 4: 確認 Collection 名稱

**後端寫入**: `daily_news` collection
**前端讀取**: `daily_news` collection

應該是一致的。

### 步驟 5: 確認資料結構

**後端寫入的資料結構**:
```python
{
    'date_str': '2025-12-26',
    'content': 'Markdown 日報內容',
    'article_count': 2,
    'category_count': 2,
    'categories': ['人工智慧', '其他'],
    'category_summaries': [...],
    'created_at': Timestamp,
    'status': 'published'
}
```

**前端讀取的資料結構**:
```javascript
{
    id: doc.id,  // 文件 ID (例如: '2025-12-26')
    date_str: data.date_str || doc.id,
    content: data.content,
    article_count: data.article_count,
    ...
}
```

應該匹配。

---

## 🔧 修復方案

### 方案 1: 確認專案 ID 一致

1. **查看後端專案 ID**:
   - Firebase Console > Project Settings > General
   - 複製 **Project ID**

2. **更新前端環境變數**:
   - Vercel Dashboard > Settings > Environment Variables
   - 確認 `VITE_FIREBASE_PROJECT_ID` 與後端專案 ID 一致

3. **重新部署前端**:
   - Vercel 會自動重新部署
   - 或手動觸發重新部署

### 方案 2: 檢查 Firestore 規則

1. Firebase Console > Firestore Database > Rules
2. 確認規則允許讀取：
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /daily_news/{document=**} {
      allow read: if true;
    }
  }
}
```

### 方案 3: 檢查資料位置

1. Firebase Console > Firestore Database
2. 確認資料在正確的專案中
3. 確認 `daily_news` collection 存在
4. 確認文件 ID 格式正確（例如: `2025-12-26`）

---

## 📋 完整檢查清單

- [ ] 前端 `VITE_FIREBASE_PROJECT_ID` 已設定
- [ ] 後端 `SERVICE_ACCOUNT_KEY` 中的 `project_id` 已確認
- [ ] 前端和後端使用**相同的** Firebase 專案 ID
- [ ] Firestore 規則允許讀取
- [ ] `daily_news` collection 有文件
- [ ] 文件包含 `content` 欄位
- [ ] Console 沒有讀取錯誤

---

## 🎯 立即行動

### 1. 確認專案 ID

**前端** (Console 輸出):
```
Project ID: ai-news-worker
```

**後端** (Firebase Console):
1. 前往 Firebase Console
2. Project Settings > General
3. 查看 **Project ID**

**比對**: 兩者必須完全一致！

### 2. 如果不一致

**更新 Vercel 環境變數**:
1. Vercel Dashboard > Settings > Environment Variables
2. 更新 `VITE_FIREBASE_PROJECT_ID` 為正確的專案 ID
3. 重新部署

### 3. 驗證修復

1. 重新整理網站
2. 查看 Console 輸出
3. 應該看到資料載入成功

---

## 🆘 如果還是有問題

請提供：
1. **前端 Project ID** (Console 輸出)
2. **後端 Project ID** (Firebase Console)
3. **Firestore 資料截圖** (Firebase Console)
4. **Console 完整輸出** (F12 > Console)

我可以根據實際情況提供更具體的解決方案。

