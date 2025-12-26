# 🔍 Vercel 部署檢查指南

## ❓ 為什麼沒有看到新的部署？

### 可能原因

1. **沒有觸發部署**
   - Vercel 通常會在 Git push 時自動部署
   - 如果沒有變更，可能不會觸發

2. **部署失敗**
   - 檢查 Vercel Dashboard 中的錯誤訊息

3. **分支設定**
   - 確認 Vercel 監控的是正確的分支（通常是 `main`）

4. **專案未連接**
   - 確認 GitHub 專案已連接到 Vercel

---

## ✅ 檢查步驟

### 步驟 1: 確認專案連接

1. 前往 [Vercel Dashboard](https://vercel.com/dashboard)
2. 確認專案 `ai-news-worker` 存在
3. 點擊進入專案

### 步驟 2: 檢查部署設定

1. 前往 **Settings** > **Git**
2. 確認：
   - **Production Branch**: `main`
   - **Root Directory**: `frontend`（或留空，如果 frontend 是根目錄）
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 步驟 3: 手動觸發部署

#### 方法 1: 推送空 commit

```bash
cd /Users/yveschen/Desktop/ai-news-worker
git commit --allow-empty -m "Trigger Vercel deployment"
git push
```

#### 方法 2: 在 Vercel Dashboard 觸發

1. 前往 **Deployments** 標籤
2. 點擊 **Redeploy**（如果有舊的部署）
3. 或點擊 **Deploy** 按鈕

#### 方法 3: 修改檔案觸發

```bash
cd frontend
echo "# Trigger deployment" >> README.md
git add frontend/README.md
git commit -m "Trigger Vercel deployment"
git push
```

### 步驟 4: 檢查部署日誌

1. 前往 **Deployments** 標籤
2. 點擊最新的部署
3. 查看 **Build Logs** 和 **Deploy Logs**

**預期應該看到**:
```
> npm run build
...
✓ built in Xs
```

---

## 🔧 常見問題

### 問題 1: 找不到專案

**解決**:
1. 確認已登入正確的 Vercel 帳號
2. 檢查專案是否在團隊中
3. 嘗試重新連接 GitHub 專案

### 問題 2: 部署失敗

**檢查**:
1. Build Logs 中的錯誤訊息
2. 環境變數是否設定
3. `package.json` 和依賴是否正確

### 問題 3: 環境變數未設定

**解決**:
1. 前往 **Settings** > **Environment Variables**
2. 新增所有 Firebase 環境變數：
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`

### 問題 4: Root Directory 設定錯誤

**檢查**:
- 如果專案結構是：
  ```
  ai-news-worker/
  ├── frontend/
  └── backend/
  ```
  
  則 Root Directory 應設為：`frontend`

---

## 🚀 快速修復

### 立即觸發部署

```bash
cd /Users/yveschen/Desktop/ai-news-worker
git commit --allow-empty -m "Trigger Vercel deployment"
git push
```

然後前往 Vercel Dashboard 查看新的部署。

---

## 📝 檢查清單

- [ ] Vercel 專案已連接 GitHub
- [ ] Production Branch 設為 `main`
- [ ] Root Directory 設為 `frontend`（如果適用）
- [ ] 環境變數已設定
- [ ] 最新的 Git push 已觸發部署
- [ ] 部署狀態為 "Ready"（不是 "Error"）

---

## 🔗 相關連結

- [Vercel Dashboard](https://vercel.com/dashboard)
- [Vercel 文件](https://vercel.com/docs)

