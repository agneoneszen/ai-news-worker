# 📰 RSS 新聞來源列表

## 📋 當前已配置的來源

### 科技類 (Tech)

1. **The Verge**
   - URL: `https://www.theverge.com/rss/index.xml`
   - 類別: Tech
   - 狀態: ✅ 正常

2. **TechCrunch**
   - URL: `https://techcrunch.com/feed/`
   - 類別: Tech
   - 狀態: ✅ 已新增

3. **Ars Technica**
   - URL: `https://feeds.arstechnica.com/arstechnica/index`
   - 類別: Tech
   - 狀態: ✅ 已新增

4. **Wired**
   - URL: `https://www.wired.com/feed/rss`
   - 類別: Tech
   - 狀態: ✅ 已新增

5. **Hacker News**
   - URL: `https://hnrss.org/frontpage`
   - 類別: Tech
   - 狀態: ✅ 已新增

6. **VentureBeat**
   - URL: `https://venturebeat.com/feed/`
   - 類別: Tech
   - 狀態: ✅ 已新增

### 加密貨幣類 (Crypto)

1. **CoinDesk**
   - URL: `https://www.coindesk.com/arc/outboundfeeds/rss/`
   - 類別: Crypto
   - 狀態: ⚠️ 有解析警告（但不影響）

2. **CoinTelegraph**
   - URL: `https://cointelegraph.com/rss`
   - 類別: Crypto
   - 狀態: ✅ 已新增

3. **Decrypt**
   - URL: `https://decrypt.co/feed`
   - 類別: Crypto
   - 狀態: ✅ 已新增

4. **The Block**
   - URL: `https://www.theblock.co/rss.xml`
   - 類別: Crypto
   - 狀態: ✅ 已新增

---

## 🔧 如何新增更多來源

### 步驟 1: 編輯 scraper.py

在 `backend/scraper.py` 的 `RSS_FEEDS` 列表中添加：

```python
{
    "source": "來源名稱",
    "url": "RSS Feed URL",
    "category": "Tech"  # 或 "Crypto", "AI", "Business" 等
}
```

### 步驟 2: 測試新來源

```bash
cd backend
python3 test_scraper_only.py
```

查看新來源是否正常運作。

---

## 📚 推薦的額外來源

### 人工智慧類 (AI)

1. **MIT Technology Review - AI**
   - URL: `https://www.technologyreview.com/topic/artificial-intelligence/feed/`
   - 類別: AI

2. **AI News**
   - URL: `https://www.artificialintelligence-news.com/feed/`
   - 類別: AI

3. **VentureBeat AI**
   - URL: `https://venturebeat.com/ai/feed/`
   - 類別: AI

### 商業/創業類 (Business)

1. **Bloomberg Technology**
   - URL: `https://www.bloomberg.com/feeds/bloomberg/technology.xml`
   - 類別: Business

2. **Reuters Technology**
   - URL: `https://www.reutersagency.com/feed/?taxonomy=best-topics&post_type=best`
   - 類別: Business

3. **The Information**
   - URL: `https://www.theinformation.com/feed` (可能需要訂閱)
   - 類別: Business

### 區塊鏈/Web3

1. **Blockworks**
   - URL: `https://blockworks.co/feed`
   - 類別: Crypto

2. **The Defiant**
   - URL: `https://thedefiant.io/feed`
   - 類別: Crypto

3. **Messari**
   - URL: `https://messari.io/rss` (如果有提供)
   - 類別: Crypto

### 中文來源（可選）

1. **TechOrange**
   - URL: `https://buzzorange.com/techorange/feed/`
   - 類別: Tech

2. **Inside**
   - URL: `https://www.inside.com.tw/feed`
   - 類別: Tech

---

## ⚠️ 注意事項

1. **RSS Feed 格式**
   - 確保 URL 是有效的 RSS/Atom feed
   - 某些網站可能沒有 RSS feed

2. **更新頻率**
   - 某些來源更新較慢
   - 24小時過濾可能導致某些來源沒有新聞

3. **解析錯誤**
   - 某些 feed 可能有格式問題
   - 系統會自動跳過有問題的來源

4. **請求限制**
   - 避免過於頻繁的請求
   - 已加入 1 秒延遲避免被擋

---

## 🔍 如何找到 RSS Feed

1. **檢查網站**
   - 查看網站底部是否有 RSS 連結
   - 常見格式：`/feed`, `/rss`, `/rss.xml`

2. **使用搜尋引擎**
   - 搜尋 "網站名稱 RSS feed"

3. **檢查原始碼**
   - 查看 HTML `<head>` 中的 `<link rel="alternate" type="application/rss+xml">`

---

## 📊 來源統計

- **總數**: 10 個來源
- **科技類**: 6 個
- **加密貨幣類**: 4 個

---

## 🎯 建議配置

根據您的需求，建議：
- **科技為主**: 增加更多 Tech 來源
- **加密貨幣為主**: 增加更多 Crypto 來源
- **平衡配置**: 保持 Tech 和 Crypto 平衡

