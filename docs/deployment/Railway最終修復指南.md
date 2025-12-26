# 🔧 Railway 最終修復指南

## ❌ 當前問題

從日誌和截圖看到：
1. Railway 仍在使用 **Railpack**（自動偵測），而不是 Dockerfile
2. Dockerfile Path 設為 `/Dockerfile`（絕對路徑，錯誤）
3. Railpack 正在分析整個專案根目錄，而不是 `backend/` 目錄

## ✅ 解決方案

### 步驟 1: 確認 Root Directory

1. 前往 Railway Dashboard
2. 點擊服務 `ai-news-worker`
3. 前往 **Settings** 標籤
4. 找到 **Source** 區塊
5. **確認 Root Directory 設為**: `backend`

**重要**: 如果 Root Directory 不是 `backend`，Railway 會從專案根目錄開始建置，導致找不到 Dockerfile。

### 步驟 2: 強制使用 Dockerfile

1. 在 **Settings** 標籤中
2. 找到 **Build** 區塊
3. 找到 **Builder** 設定
4. **選擇 "Dockerfile"**（不是 Railpack/Nixpacks）

### 步驟 3: 修正 Dockerfile Path

1. 在 **Build** 區塊中
2. 找到 **Dockerfile Path** 欄位
3. **將 `/Dockerfile` 改為 `Dockerfile`**
   - 因為 Root Directory 是 `backend`
   - Railway 會在 `backend/` 目錄中尋找 Dockerfile
   - 所以路徑應該是相對的 `Dockerfile`，不是絕對的 `/Dockerfile`

### 步驟 4: 調整 Watch Paths（可選）

1. 在 **Settings** 標籤中
2. 找到 **Watch Paths** 區塊
3. 確認設為 `/backend/**`（這是正確的）
4. 或刪除所有 Watch Paths，讓 Railway 監控所有變更

### 步驟 5: 重新部署

1. 前往 **Deployments** 標籤
2. 點擊 **Redeploy** 或推送新的 commit
3. 查看 **Build Logs**

**預期應該看到**:
```
Building Docker image...
Step 1/7 : FROM python:3.9-slim
Step 2/7 : WORKDIR /app
...
```

**不應該看到**:
```
Railpack 0.15.4
✖ Railpack could not determine how to build the app.
```

## 📋 正確設定檢查清單

### Settings > Source
- [ ] Root Directory: `backend`

### Settings > Build
- [ ] Builder: `Dockerfile`（不是 Railpack）
- [ ] Dockerfile Path: `Dockerfile`（不是 `/Dockerfile`）

### Settings > Variables
- [ ] `OPENAI_API_KEY` 已設定
- [ ] `SERVICE_ACCOUNT_KEY` 已設定（完整 JSON）

### Settings > Watch Paths（可選）
- [ ] `/backend/**` 或留空

## 🆘 如果還是不行

### 方案 A: 刪除 railway.json

如果 `railway.json` 造成衝突：

```bash
cd backend
rm railway.json
git add backend/railway.json
git commit -m "Remove railway.json to use Dashboard settings"
git push
```

然後在 Railway Dashboard 手動設定所有選項。

### 方案 B: 使用 Nixpacks

如果 Dockerfile 還是有問題，可以改用 Nixpacks：

1. 在 Builder 設定中選擇 **Nixpacks**
2. 已建立的 `nixpacks.toml` 會自動被使用
3. Railway 會根據 `nixpacks.toml` 建置 Python 應用程式

### 方案 C: 檢查 Dockerfile 位置

確認 Dockerfile 在正確位置：
```bash
cd backend
ls -la Dockerfile
```

應該會看到 Dockerfile 存在。

## 🔍 診斷步驟

1. **檢查 Root Directory**
   - 如果設為空或根目錄，Railway 會從專案根目錄開始
   - 必須設為 `backend`

2. **檢查 Builder 選擇**
   - 如果選擇 Railpack，Railway 會嘗試自動偵測
   - 必須選擇 Dockerfile

3. **檢查 Dockerfile Path**
   - 如果設為 `/Dockerfile`，Railway 會在根目錄尋找
   - 必須設為 `Dockerfile`（相對路徑）

4. **查看 Build Logs**
   - 如果看到 "Railpack"，表示仍在使用 Railpack
   - 應該看到 "Building Docker image..."

## 📝 正確設定範例

### 設定 1: Source
```
Root Directory: backend
```

### 設定 2: Build
```
Builder: Dockerfile
Dockerfile Path: Dockerfile
```

### 設定 3: Variables
```
OPENAI_API_KEY: sk-...
SERVICE_ACCOUNT_KEY: {"type":"service_account",...}
```

## 🚀 完成後

完成上述設定後：
1. 點擊 **Redeploy**
2. 查看 **Build Logs**
3. 確認看到 Docker 建置過程
4. 確認服務成功啟動

如果還有問題，請提供：
1. Settings 截圖（特別是 Build 區塊）
2. Build Logs 的完整內容
3. 確認 Root Directory 和 Dockerfile Path 的實際值

