# 🔧 Railway 關鍵問題修復

## ❌ 問題分析

從日誌看到：
```
The app contents that Railpack analyzed contains:
./
├── backend/
├── docs/
├── frontend/
...
```

**關鍵問題**:
1. Railway 正在分析**專案根目錄**（`./`），而不是 `backend/` 目錄
2. Railway 仍然使用 **Railpack**，而不是 Dockerfile 或 Nixpacks
3. Root Directory 設定可能**沒有生效**或**設定錯誤**

---

## ✅ 解決方案

### 步驟 1: 確認 Root Directory 設定（最重要）

1. 前往 Railway Dashboard
2. Settings > **Source**
3. **Root Directory**: 必須設為 `backend`（**不是空、不是 `/`、不是根目錄**）

**檢查方式**:
- 如果欄位是**空的**，請輸入 `backend`
- 如果欄位是 `/`，請改為 `backend`
- 如果欄位是根目錄路徑，請改為 `backend`

**⚠️ 關鍵**: 這個設定必須正確，否則 Railway 會從專案根目錄開始！

### 步驟 2: 強制使用 Nixpacks（推薦）

既然 Dockerfile 有問題，改用 Nixpacks：

1. Settings > **Build**
2. **Builder**: 選擇 `Nixpacks`（**不是** Railpack 或 Dockerfile）
3. **Root Directory**: 確認是 `backend`（應該會自動繼承 Source 的設定）

### 步驟 3: 確認設定已儲存

1. **儲存所有設定**
2. 確認沒有警告訊息
3. 重新整理頁面確認設定還在

### 步驟 4: 重新部署

1. 前往 **Deployments** 標籤
2. 點擊 **Redeploy**
3. 或推送新的 commit：
   ```bash
   git commit --allow-empty -m "Trigger Railway deployment"
   git push
   ```

### 步驟 5: 驗證

查看 Build Logs，應該看到：
```
Building with Nixpacks...
Detected Python project
...
```

**不應該看到**:
```
Railpack 0.15.4
The app contents that Railpack analyzed contains:
./
```

---

## 🔍 詳細檢查

### 檢查 1: Root Directory 設定

**正確設定**:
```
Settings > Source > Root Directory: backend
```

**錯誤設定**:
- 空
- `/`
- 根目錄路徑
- `./backend`（應該只是 `backend`）

### 檢查 2: Builder 設定

**正確設定**:
```
Settings > Build > Builder: Nixpacks
```

**錯誤設定**:
- Railpack（自動偵測）
- Dockerfile（如果持續失敗）

### 檢查 3: 檔案結構

Railway 應該看到的結構：
```
backend/
├── nixpacks.toml
├── requirements.txt
├── scheduler_continuous.py
└── ...
```

**不應該是**:
```
./
├── backend/
├── frontend/
└── ...
```

---

## 🆘 如果 Root Directory 設定無效

### 方案 A: 刪除並重新建立服務

1. **備份環境變數**
2. **刪除現有服務**
3. **重新建立**:
   - New Project > Deploy from GitHub repo
   - 選擇 `ai-news-worker`
   - **立即設定** Root Directory = `backend`
   - **立即設定** Builder = `Nixpacks`

### 方案 B: 檢查專案連接

1. Settings > **Source**
2. 確認 GitHub 專案正確連接
3. 確認分支是 `main`

---

## 📋 完整設定檢查清單

### Source
- [ ] Root Directory: `backend`（**不是空**）
- [ ] GitHub 專案已連接
- [ ] 分支: `main`

### Build
- [ ] Builder: `Nixpacks`（**不是** Railpack）
- [ ] Root Directory: `backend`（應該自動繼承）

### Variables
- [ ] `OPENAI_API_KEY` 已設定
- [ ] `SERVICE_ACCOUNT_KEY` 已設定

---

## 🎯 立即行動

**最重要的一步**:
1. 前往 Settings > Source
2. **確認 Root Directory 欄位有值 `backend`**
3. 如果沒有，請輸入 `backend` 並儲存
4. 重新部署

這個設定是關鍵！如果 Root Directory 是空的，Railway 會從專案根目錄開始，導致所有問題。

