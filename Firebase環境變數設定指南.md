# 🔥 Firebase 環境變數設定完整指南

## 📍 步驟 1: 在 Firebase Console 取得配置值

### 1.1 登入 Firebase Console

1. 前往 https://console.firebase.google.com/
2. 使用您的 Google 帳號登入
3. 選擇您的專案（如果還沒有專案，需要先建立一個）

### 1.2 取得 Web 應用程式配置

1. **進入專案設定**
   - 點擊左上角的 ⚙️ **專案設定** (Project Settings)
   - 或點擊左側選單的 ⚙️ 圖示

2. **找到您的應用程式**
   - 向下滾動到 **"您的應用程式"** (Your apps) 區塊
   - 如果還沒有 Web 應用程式，點擊 **</>** (Web) 圖示建立一個
   - 如果已經有，點擊現有的 Web 應用程式

3. **複製配置值**
   - 您會看到類似這樣的配置：
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "123456789012",
     appId: "1:123456789012:web:abcdefghijklmnop"
   };
   ```

4. **對應關係**
   - `apiKey` → `VITE_FIREBASE_API_KEY`
   - `authDomain` → `VITE_FIREBASE_AUTH_DOMAIN`
   - `projectId` → `VITE_FIREBASE_PROJECT_ID`
   - `storageBucket` → `VITE_FIREBASE_STORAGE_BUCKET`
   - `messagingSenderId` → `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `appId` → `VITE_FIREBASE_APP_ID`

### 1.3 如果還沒有建立 Web 應用程式

1. 在 **"您的應用程式"** 區塊，點擊 **</>** (Web) 圖示
2. 填寫應用程式暱稱（例如：`ai-news-worker-web`）
3. 可選：勾選 "Also set up Firebase Hosting"
4. 點擊 **註冊應用程式** (Register app)
5. 複製顯示的配置值

---

## 📝 步驟 2: 在 Vercel 設定環境變數

### 2.1 進入環境變數設定頁面

1. **前往 Vercel Dashboard**
   - 訪問：https://vercel.com/agneoneszens-projects/ai-news-worker
   - 或從 Dashboard 點擊專案名稱

2. **進入 Settings**
   - 點擊頂部導航欄的 **Settings** 標籤

3. **找到 Environment Variables**
   - 在左側選單中，點擊 **Environment Variables**
   - 或直接訪問：https://vercel.com/agneoneszens-projects/ai-news-worker/settings/environment-variables

### 2.2 新增環境變數

#### 變數 1: VITE_FIREBASE_API_KEY

1. 在 Environment Variables 頁面，點擊 **Add New**
2. 填寫：
   - **Key**: `VITE_FIREBASE_API_KEY`
   - **Value**: 貼上從 Firebase 複製的 `apiKey` 值（例如：`AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`）
   - **Environment**: 勾選所有三個選項：
     - ✅ Production
     - ✅ Preview
     - ✅ Development
3. 點擊 **Save**

#### 變數 2: VITE_FIREBASE_AUTH_DOMAIN

1. 點擊 **Add New**
2. 填寫：
   - **Key**: `VITE_FIREBASE_AUTH_DOMAIN`
   - **Value**: 貼上從 Firebase 複製的 `authDomain` 值（例如：`your-project.firebaseapp.com`）
   - **Environment**: 勾選所有三個選項
3. 點擊 **Save**

#### 變數 3: VITE_FIREBASE_PROJECT_ID

1. 點擊 **Add New**
2. 填寫：
   - **Key**: `VITE_FIREBASE_PROJECT_ID`
   - **Value**: 貼上從 Firebase 複製的 `projectId` 值（例如：`your-project-id`）
   - **Environment**: 勾選所有三個選項
3. 點擊 **Save**

#### 變數 4: VITE_FIREBASE_STORAGE_BUCKET

1. 點擊 **Add New**
2. 填寫：
   - **Key**: `VITE_FIREBASE_STORAGE_BUCKET`
   - **Value**: 貼上從 Firebase 複製的 `storageBucket` 值（例如：`your-project.appspot.com`）
   - **Environment**: 勾選所有三個選項
3. 點擊 **Save**

#### 變數 5: VITE_FIREBASE_MESSAGING_SENDER_ID

1. 點擊 **Add New**
2. 填寫：
   - **Key**: `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - **Value**: 貼上從 Firebase 複製的 `messagingSenderId` 值（例如：`123456789012`）
   - **Environment**: 勾選所有三個選項
3. 點擊 **Save**

#### 變數 6: VITE_FIREBASE_APP_ID

1. 點擊 **Add New**
2. 填寫：
   - **Key**: `VITE_FIREBASE_APP_ID`
   - **Value**: 貼上從 Firebase 複製的 `appId` 值（例如：`1:123456789012:web:abcdefghijklmnop`）
   - **Environment**: 勾選所有三個選項
3. 點擊 **Save**

### 2.3 確認所有變數

完成後，您應該在 Environment Variables 頁面看到 6 個變數：

```
✅ VITE_FIREBASE_API_KEY
✅ VITE_FIREBASE_AUTH_DOMAIN
✅ VITE_FIREBASE_PROJECT_ID
✅ VITE_FIREBASE_STORAGE_BUCKET
✅ VITE_FIREBASE_MESSAGING_SENDER_ID
✅ VITE_FIREBASE_APP_ID
```

---

## 🔄 步驟 3: 重新部署以套用環境變數

### 3.1 觸發重新部署

1. **前往 Deployments**
   - 點擊頂部導航欄的 **Deployments** 標籤

2. **重新部署**
   - 找到最新的部署項目
   - 點擊右側的 **⋯** (三個點)
   - 選擇 **Redeploy**
   - 確認勾選 **Use existing Build Cache**（可選，但建議勾選以加快速度）
   - 點擊 **Redeploy**

### 3.2 等待部署完成

- 部署通常需要 1-2 分鐘
- 可以在 Deployments 頁面查看進度
- 點擊部署項目可以查看詳細日誌

---

## ✅ 步驟 4: 驗證設定

### 4.1 檢查部署狀態

1. 在 Deployments 頁面，確認最新部署狀態為 **Ready**
2. 點擊部署項目查看 URL（例如：`https://ai-news-worker.vercel.app`）

### 4.2 測試網站

1. 訪問部署的 URL
2. 打開瀏覽器開發者工具（按 F12）
3. 前往 **Console** 標籤
4. 檢查是否有 Firebase 相關錯誤

### 4.3 預期結果

- ✅ 網站正常載入
- ✅ Console 沒有 Firebase 連線錯誤
- ✅ 如果看到 "資料庫是空的" 是正常的（後端還沒執行任務）

---

## 🖼️ 視覺化指引

### Firebase Console 位置示意

```
Firebase Console
├── 專案設定 (Project Settings) ⚙️
    ├── 一般 (General)
    └── 您的應用程式 (Your apps)
        └── </> Web 應用程式
            └── 配置代碼 (Config)
                └── 這裡有所有需要的值！
```

### Vercel 設定位置示意

```
Vercel Dashboard
├── 您的專案 (ai-news-worker)
    ├── Settings ⚙️
    │   └── Environment Variables
    │       └── Add New (新增變數)
    └── Deployments
        └── Redeploy (重新部署)
```

---

## 🔍 常見問題

### Q1: 找不到 Firebase 配置值？

**A:** 
- 確認您已建立 Web 應用程式
- 確認您在正確的 Firebase 專案中
- 嘗試重新整理頁面

### Q2: 環境變數設定後網站還是無法連線 Firebase？

**A:**
- 確認已重新部署（環境變數需要重新部署才會生效）
- 檢查變數名稱是否正確（必須以 `VITE_` 開頭）
- 檢查變數值是否完整（沒有遺漏引號或空格）

### Q3: 如何確認環境變數是否正確設定？

**A:**
- 在 Vercel Dashboard > Settings > Environment Variables 查看
- 確認所有 6 個變數都存在
- 確認每個變數都勾選了 Production 環境

### Q4: 可以只設定 Production 環境嗎？

**A:** 
- 可以，但建議三個環境都設定，以便測試
- 至少 Production 必須設定

---

## 📝 快速檢查清單

- [ ] 已在 Firebase Console 取得 Web 應用程式配置
- [ ] 已在 Vercel 設定 `VITE_FIREBASE_API_KEY`
- [ ] 已在 Vercel 設定 `VITE_FIREBASE_AUTH_DOMAIN`
- [ ] 已在 Vercel 設定 `VITE_FIREBASE_PROJECT_ID`
- [ ] 已在 Vercel 設定 `VITE_FIREBASE_STORAGE_BUCKET`
- [ ] 已在 Vercel 設定 `VITE_FIREBASE_MESSAGING_SENDER_ID`
- [ ] 已在 Vercel 設定 `VITE_FIREBASE_APP_ID`
- [ ] 所有變數都勾選了 Production 環境
- [ ] 已重新部署專案
- [ ] 網站可以正常訪問且沒有 Firebase 錯誤

---

## 🆘 需要幫助？

如果遇到問題，請告訴我：
1. 您在哪一步遇到困難？
2. 是否有看到任何錯誤訊息？
3. Firebase Console 中是否能看到配置值？

我可以協助您解決！

