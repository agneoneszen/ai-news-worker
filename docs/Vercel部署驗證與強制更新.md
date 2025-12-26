# 🔄 Vercel 部署驗證與強制更新指南

## 問題：展示時間顯示舊版本

如果 UI 上顯示的時間是舊的，表示 Vercel 可能還沒有部署最新版本。

## ✅ 解決方案

### 方案 1: 檢查 Vercel 部署狀態

1. 前往 [Vercel Dashboard](https://vercel.com/dashboard)
2. 選擇您的專案
3. 查看 **Deployments** 標籤
4. 確認最新的部署：
   - 狀態應該是 **Ready**（綠色）
   - 時間應該是最新的
   - 檢查 Git Commit 是否為最新

### 方案 2: 強制重新部署

如果最新部署不是最新的 commit：

1. 在 Vercel Dashboard 中
2. 點擊 **Deployments** 標籤
3. 找到最新的部署
4. 點擊右側的 **⋯** 選單
5. 選擇 **Redeploy**
6. 確認重新部署

### 方案 3: 清除 Vercel 緩存

1. 在 Vercel Dashboard 中
2. 進入專案 **Settings**
3. 找到 **Build & Development Settings**
4. 點擊 **Clear Build Cache**
5. 然後重新部署

### 方案 4: 觸發新的部署（推薦）

最簡單的方法是推送一個空 commit：

```bash
git commit --allow-empty -m "Trigger Vercel redeploy"
git push
```

這會觸發 Vercel 自動重新部署。

---

## 🔍 如何驗證已更新

### 方法 1: 檢查版本信息

1. 打開網站
2. 查看右下角的版本信息（固定位置）
3. 應該顯示：
   - UI 版本：`2025.12.26-HHMM`（當前日期和時間）
   - 構建時間：完整的時間戳

### 方法 2: 檢查標題區塊

1. 打開任意文章
2. 查看標題區塊右上角
3. 應該顯示：
   - UI 版本號
   - 生成時間（從 Firestore）

### 方法 3: 檢查調試信息

1. 打開任意文章
2. 點擊「顯示調試信息」
3. 查看：
   - UI 版本
   - 內容格式信息

### 方法 4: 檢查瀏覽器控制台

1. 按 F12 打開開發者工具
2. 查看 Console 標籤
3. 應該看到：
   - `🔍 [MarkdownRenderer]` 開頭的調試日誌
   - 如果沒有，可能是舊版本

---

## 🚨 如果還是舊版本

### 檢查清單

- [ ] Vercel 部署狀態為 **Ready**
- [ ] 部署時間是最新的
- [ ] Git Commit 是最新的
- [ ] 已清除瀏覽器緩存（Cmd+Shift+R）
- [ ] 已檢查 Vercel 構建日誌無錯誤

### 強制更新步驟

1. **推送空 commit 觸發部署**：
   ```bash
   git commit --allow-empty -m "Force Vercel redeploy"
   git push
   ```

2. **等待 Vercel 構建完成**（約 1-2 分鐘）

3. **清除瀏覽器緩存**：
   - Chrome/Edge: Cmd+Shift+R (Mac) 或 Ctrl+Shift+R (Windows)
   - Safari: Cmd+Option+R

4. **檢查版本信息**：
   - 右下角應該顯示最新時間
   - 標題區塊應該顯示最新版本

---

## 📝 版本號格式說明

版本號格式：`YYYY.MM.DD-HHMM`

例如：
- `2025.12.26-1430` = 2025年12月26日 14:30 構建

這可以幫助您確認：
- 是否為最新構建
- 構建時間是否正確

---

## 🎯 下一步

1. 執行上述步驟強制重新部署
2. 等待構建完成
3. 清除瀏覽器緩存
4. 檢查版本信息
5. 如果還是舊版本，請提供：
   - Vercel 部署日誌截圖
   - 瀏覽器控制台的版本信息
   - 實際顯示的時間戳

