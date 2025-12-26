# 📸 Firebase 配置值取得位置（詳細說明）

## 🔍 在 Firebase Console 找到配置值的步驟

### 步驟 1: 登入並選擇專案

1. 前往：https://console.firebase.google.com/
2. 登入您的 Google 帳號
3. 選擇您的 Firebase 專案

### 步驟 2: 進入專案設定

**方法 A: 從左側選單**
- 點擊左側選單最下方的 ⚙️ **專案設定** (Project Settings)

**方法 B: 從專案概覽**
- 點擊專案名稱旁邊的 ⚙️ 圖示
- 選擇 "專案設定"

### 步驟 3: 找到 Web 應用程式配置

1. 在專案設定頁面，向下滾動
2. 找到 **"您的應用程式"** (Your apps) 區塊
3. 您會看到類似這樣的圖示：
   ```
   </> Web
   📱 iOS
   🤖 Android
   ```

### 步驟 4: 查看或建立 Web 應用程式

**如果已經有 Web 應用程式：**
- 點擊 Web 應用程式圖示
- 您會看到配置代碼

**如果還沒有 Web 應用程式：**
1. 點擊 **</>** (Web) 圖示
2. 填寫應用程式暱稱（例如：`ai-news-worker`）
3. 可選：勾選 "Also set up Firebase Hosting"
4. 點擊 **註冊應用程式** (Register app)
5. 您會看到配置代碼

### 步驟 5: 複製配置值

您會看到類似這樣的代碼：

```javascript
// For Firebase JavaScript SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC1234567890abcdefghijklmnopqrstuvwxyz",
  authDomain: "my-project-12345.firebaseapp.com",
  projectId: "my-project-12345",
  storageBucket: "my-project-12345.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890abcdef"
};
```

**對應關係：**

| Firebase 配置 | Vercel 環境變數 | 範例值 |
|-------------|----------------|--------|
| `apiKey` | `VITE_FIREBASE_API_KEY` | `AIzaSyC1234567890...` |
| `authDomain` | `VITE_FIREBASE_AUTH_DOMAIN` | `my-project-12345.firebaseapp.com` |
| `projectId` | `VITE_FIREBASE_PROJECT_ID` | `my-project-12345` |
| `storageBucket` | `VITE_FIREBASE_STORAGE_BUCKET` | `my-project-12345.appspot.com` |
| `messagingSenderId` | `VITE_FIREBASE_MESSAGING_SENDER_ID` | `123456789012` |
| `appId` | `VITE_FIREBASE_APP_ID` | `1:123456789012:web:abcdef...` |

### 步驟 6: 複製每個值

**重要提示：**
- 只複製值本身，不要包含引號 `"` 或逗號 `,`
- 例如：如果看到 `apiKey: "AIzaSy..."`，只複製 `AIzaSy...` 這部分

---

## 🎯 在 Vercel 設定的詳細位置

### 進入環境變數頁面

1. 前往：https://vercel.com/agneoneszens-projects/ai-news-worker
2. 點擊頂部的 **Settings** 標籤
3. 在左側選單點擊 **Environment Variables**

### 新增變數的介面

當您點擊 **Add New** 時，會看到：

```
┌─────────────────────────────────────┐
│ Key                                 │
│ [VITE_FIREBASE_API_KEY        ]    │
│                                     │
│ Value                               │
│ [AIzaSyC1234567890...          ]    │
│                                     │
│ Environment                         │
│ ☑ Production                       │
│ ☑ Preview                          │
│ ☑ Development                      │
│                                     │
│ [Cancel]  [Save]                   │
└─────────────────────────────────────┘
```

### 填寫範例

**變數 1:**
- Key: `VITE_FIREBASE_API_KEY`
- Value: `AIzaSyC1234567890abcdefghijklmnopqrstuvwxyz`
- Environment: 全部勾選

**變數 2:**
- Key: `VITE_FIREBASE_AUTH_DOMAIN`
- Value: `my-project-12345.firebaseapp.com`
- Environment: 全部勾選

...依此類推

---

## ✅ 完成後的確認

設定完成後，在 Vercel Environment Variables 頁面應該看到：

```
Environment Variables (6)

VITE_FIREBASE_API_KEY              Production, Preview, Development
VITE_FIREBASE_AUTH_DOMAIN          Production, Preview, Development
VITE_FIREBASE_PROJECT_ID            Production, Preview, Development
VITE_FIREBASE_STORAGE_BUCKET        Production, Preview, Development
VITE_FIREBASE_MESSAGING_SENDER_ID   Production, Preview, Development
VITE_FIREBASE_APP_ID                Production, Preview, Development
```

---

## 🔗 快速連結

- **Firebase Console**: https://console.firebase.google.com/
- **Vercel Environment Variables**: https://vercel.com/agneoneszens-projects/ai-news-worker/settings/environment-variables
- **Vercel Deployments**: https://vercel.com/agneoneszens-projects/ai-news-worker/deployments

---

## 💡 提示

1. **一次設定一個變數**：不要一次複製所有值，一個一個設定比較不容易出錯
2. **檢查拼寫**：變數名稱必須完全正確，包括大小寫
3. **不要有空格**：複製值時注意不要包含前後空格
4. **重新部署**：設定完所有變數後，記得重新部署才會生效

