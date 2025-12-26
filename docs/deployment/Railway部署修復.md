# 🔧 Railway 部署失敗修復

## ❌ 錯誤訊息

```
Error creating build plan with Railpack
```

## 🔍 問題分析

Railway 無法正確偵測或使用 Dockerfile。可能原因：
1. `railway.json` 配置問題
2. Dockerfile 路徑問題
3. Railway 自動偵測失敗

## ✅ 解決方案

### 方案 1: 確認 railway.json 配置

已更新 `railway.json`：
- ✅ 確認 `dockerfilePath` 為 `Dockerfile`
- ✅ 確認 `startCommand` 為 `python scheduler_continuous.py`

### 方案 2: 在 Railway Dashboard 手動設定

1. **前往 Railway Dashboard**
   - 點擊服務 `ai-news-worker`
   - 點擊 **Settings** 標籤

2. **設定 Root Directory**
   - 找到 **Root Directory**
   - 設為：`backend`

3. **設定 Build Command**（如果需要）
   - 找到 **Build Command**
   - 設為：`pip install -r requirements.txt`

4. **設定 Start Command**
   - 找到 **Start Command**
   - 設為：`python scheduler_continuous.py`

### 方案 3: 刪除 railway.json（讓 Railway 自動偵測）

如果 railway.json 造成問題，可以刪除它讓 Railway 自動偵測：

```bash
# 在本地執行
cd backend
rm railway.json
git add backend/railway.json
git commit -m "Remove railway.json for auto-detection"
git push
```

Railway 會自動偵測：
- Dockerfile
- Python 環境
- requirements.txt

### 方案 4: 檢查 Dockerfile 位置

確認 Dockerfile 在正確位置：
- ✅ `backend/Dockerfile` - 正確
- ❌ `Dockerfile`（根目錄）- 錯誤

## 🚀 重新部署步驟

1. **確認設定**
   - Root Directory: `backend`
   - 環境變數已設定
   - Dockerfile 存在

2. **觸發重新部署**
   - 前往 **Deployments** 標籤
   - 點擊 **Redeploy** 或推送新的 commit

3. **查看日誌**
   - 點擊部署項目
   - 查看 **Logs** 確認建置過程

## 📋 檢查清單

- [ ] Root Directory 設為 `backend`
- [ ] Dockerfile 存在於 `backend/` 目錄
- [ ] requirements.txt 存在且包含所有依賴
- [ ] 環境變數已設定（OPENAI_API_KEY, SERVICE_ACCOUNT_KEY）
- [ ] railway.json 配置正確（或已刪除讓自動偵測）

## 🆘 如果還是失敗

請提供：
1. Railway Logs 的完整錯誤訊息
2. 部署設定的截圖
3. Dockerfile 內容確認

我可以進一步協助診斷問題。

