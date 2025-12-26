# 🔧 Firebase enableNetwork 錯誤修復

## ❌ 錯誤訊息

```
Uncaught TypeError: j_.enableNetwork is not a function
```

## 🔍 原因

在 `firebase.js` 中錯誤地使用了 `db.enableNetwork()`。

`enableNetwork` 不是 `db` 物件的方法，而是 Firebase SDK 的獨立函數，用於離線持久化，不是用來驗證連接的。

## ✅ 解決方案

已移除不必要的連接驗證。Firestore 會自動連接，不需要手動調用 `enableNetwork`。

### 修復前：
```javascript
db.enableNetwork().then(() => {
  console.log('✅ [Firebase] Firestore 連接成功');
}).catch((error) => {
  console.error('❌ [Firebase] Firestore 連接失敗:', error);
});
```

### 修復後：
```javascript
// Firestore 會自動連接，不需要手動驗證
console.log('✅ [Firebase] Firestore 已初始化');
```

## 📋 驗證步驟

修復後應該：
1. ✅ Console 沒有 `enableNetwork` 錯誤
2. ✅ 看到 `✅ [Firebase] Firestore 已初始化`
3. ✅ 看到 `🔍 [useNewsData] 開始讀取 Firestore...`
4. ✅ 成功載入資料或顯示適當的錯誤訊息

## 🎯 如果還是沒有內容

請檢查：
1. **Firestore 是否有資料**：
   - Firebase Console > Firestore Database
   - 確認 `daily_news` collection 有文件

2. **Firestore 規則**：
   - 確認規則允許讀取：
   ```javascript
   match /daily_news/{document=**} {
     allow read: if true;
   }
   ```

3. **Console 輸出**：
   - 查看是否有其他錯誤訊息
   - 確認 `useNewsData` 的輸出

