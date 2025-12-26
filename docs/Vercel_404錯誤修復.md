# 🔧 Vercel 404 錯誤修復指南

## ❌ 問題：Vercel 返回 404 NOT_FOUND

從 Console 看到：
```
GET https://ai-news-worker.vercel.app/ 404 (Not Found)
```

這表示 Vercel 找不到應用程式。

---

## ✅ 解決方案

### 步驟 1: 檢查 Vercel Root Directory 設定

1. 前往 [Vercel Dashboard](https://vercel.com/dashboard)
2. 選擇專案 `ai-news-worker`
3. Settings > **General**
4. **Root Directory**: 應該設為 `frontend`

**如果沒有設定**:
- 點擊 "Edit"
- 輸入 `frontend`
- 儲存

### 步驟 2: 檢查 Build 設定

1. Settings > **Build & Development Settings**
2. 確認以下設定：

**Framework Preset**: `Vite` 或 `Other`

**Build Command**: 
```
npm run build
```

**Output Directory**: 
```
dist
```

**Install Command**:
```
npm install
```

### 步驟 3: 確認 vercel.json 存在

確認 `frontend/vercel.json` 存在且內容正確：

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### 步驟 4: 重新部署

1. Deployments 標籤
2. 點擊最新部署右側的 "..." 選單
3. 選擇 **Redeploy**
4. 或推送新的 commit 觸發自動部署

---

## 🔍 檢查清單

### Vercel 設定
- [ ] Root Directory: `frontend`
- [ ] Framework: `Vite` 或 `Other`
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `dist`
- [ ] Install Command: `npm install`

### 檔案確認
- [ ] `frontend/vercel.json` 存在
- [ ] `frontend/package.json` 存在
- [ ] `frontend/vite.config.js` 存在
- [ ] `frontend/index.html` 存在

### 部署狀態
- [ ] 最新部署狀態: Ready
- [ ] Build Logs 沒有錯誤
- [ ] 網站可以訪問（不是 404）

---

## 🆘 如果還是有問題

### 方案 A: 手動設定 Root Directory

1. Vercel Dashboard > Settings > General
2. Root Directory: 設為 `frontend`
3. 儲存並重新部署

### 方案 B: 檢查 Build Logs

1. Deployments > 點擊最新部署
2. 查看 Build Logs
3. 確認是否有錯誤

**常見錯誤**:
- `npm: command not found` → 需要設定 Node.js 版本
- `Cannot find module` → 需要檢查 package.json
- `Build failed` → 檢查 vite.config.js

### 方案 C: 確認專案結構

確認 GitHub 專案結構：
```
ai-news-worker/
  ├── frontend/
  │   ├── package.json
  │   ├── vite.config.js
  │   ├── vercel.json
  │   ├── index.html
  │   └── src/
  └── backend/
```

如果結構不同，需要調整 Root Directory。

---

## 📋 立即行動

1. **檢查 Root Directory**:
   - Vercel Dashboard > Settings > General
   - 確認設為 `frontend`

2. **檢查 Build 設定**:
   - Settings > Build & Development Settings
   - 確認 Build Command 和 Output Directory

3. **重新部署**:
   - Deployments > Redeploy

4. **驗證**:
   - 打開網站
   - 確認不是 404

---

## 🎯 預期結果

修復後應該：
- ✅ 網站可以訪問（不是 404）
- ✅ 顯示應用程式內容
- ✅ Console 沒有 404 錯誤

