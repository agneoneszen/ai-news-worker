# ⚡ LLM 工作流效率分析與優化

## 📊 當前工作流程分析

### 流程概覽

```
1. 抓取新聞 (N 篇，假設 10-20 篇)
   ↓
2. 單篇分析 (N 次 API 呼叫)
   - 每篇: ~2500 tokens 輸入 + ~500 tokens 輸出
   - 總計: N × 3000 tokens
   ↓
3. 分類分組 (最多 5 個分類)
   ↓
4. 分類統合分析 (最多 5 次 API 呼叫)
   - 每分類: ~8000 tokens 輸入 + ~1000 tokens 輸出
   - 總計: 5 × 9000 tokens
   ↓
5. 日報生成 (1 次 API 呼叫)
   - 輸入: ~6000 tokens + ~2000 tokens 輸出
   - 總計: 8000 tokens
```

### 成本估算（假設 20 篇新聞，5 個分類）

| 階段 | API 呼叫次數 | 輸入 Tokens | 輸出 Tokens | 總 Tokens |
|------|-------------|------------|------------|----------|
| 單篇分析 | 20 | 50,000 | 10,000 | 60,000 |
| 分類分析 | 5 | 40,000 | 5,000 | 45,000 |
| 日報生成 | 1 | 6,000 | 2,000 | 8,000 |
| **總計** | **26** | **96,000** | **17,000** | **113,000** |

**成本**（GPT-4o-mini 價格）:
- 輸入: $0.15 / 1M tokens → 96,000 × $0.15 / 1,000,000 = $0.0144
- 輸出: $0.60 / 1M tokens → 17,000 × $0.60 / 1,000,000 = $0.0102
- **每日成本**: ~$0.025（約 $0.75/月）

---

## 🔍 效率問題分析

### 問題 1: 單篇分析串行執行

**當前**: 逐篇分析，20 篇需要 20 次 API 呼叫  
**問題**: 
- 總耗時 = 20 × API 延遲（~2-3秒）= 40-60 秒
- 無法並行處理

### 問題 2: Token 使用可優化

**當前**:
- 單篇分析：傳入完整 2500 字內容
- 分類分析：傳入完整文章內容（8000 字）

**優化空間**:
- 單篇分析後已有結構化結果
- 分類分析應使用結構化結果而非原始內容（已部分實現）

### 問題 3: 重複資訊傳遞

**當前**: 分類分析時可能重複傳遞相同資訊  
**優化**: 使用結構化摘要，減少 token 使用

---

## ✅ 已實現的優化

### 1. 使用結構化結果（已實現）

```python
# 分類分析時使用結構化結果而非原始內容
for art in article_data:
    combined_input += f"摘要：{art['summary']}\n"
    combined_input += f"重點：{highlights_str}\n"
    combined_input += f"洞察：{art.get('insight', '')}\n"
```

**節省**: 約 30-40% token 使用

### 2. 限制輸入長度（已實現）

- 單篇: 2500 字
- 分類統合: 8000 字
- 日報輸入: 6000 字

### 3. 限制分類數量（已實現）

最多 5 個分類，避免過多 API 呼叫

---

## 🚀 進一步優化建議

### 優化 1: 並行處理單篇分析（高優先級）

**當前**: 串行執行，20 篇需要 40-60 秒  
**優化**: 並行執行，20 篇只需要 5-10 秒

```python
import asyncio
from concurrent.futures import ThreadPoolExecutor

# 使用 ThreadPoolExecutor 並行處理
with ThreadPoolExecutor(max_workers=5) as executor:
    futures = [
        executor.submit(analyze_article, news.get("content", ""), ...)
        for news in raw_news_list
    ]
    results = [f.result() for f in futures]
```

**預期效果**:
- 時間: 40-60 秒 → 5-10 秒（4-6 倍加速）
- 成本: 不變（API 呼叫次數相同）

### 優化 2: 批次 API 呼叫（中優先級）

**當前**: 每篇文章單獨呼叫  
**優化**: 批次處理多篇文章（如果 OpenAI 支援）

**限制**: OpenAI Chat API 不直接支援批次，但可以：
- 使用並行處理（如上）
- 或合併多篇文章為一個 prompt（可能降低品質）

### 優化 3: 快取機制（中優先級）

**場景**: 如果同一篇文章被多次分析  
**優化**: 使用 Redis 或記憶體快取

```python
import hashlib

def get_article_hash(article):
    content = article.get('content', '')[:500]
    return hashlib.md5(content.encode()).hexdigest()

# 檢查快取
cache_key = get_article_hash(news)
if cache_key in cache:
    return cache[cache_key]
```

**預期效果**: 避免重複分析相同內容

### 優化 4: 智能截取（低優先級）

**當前**: 固定截取前 2500 字  
**優化**: 智能截取關鍵段落

```python
# 使用簡單的關鍵詞匹配或句子重要性評分
def smart_truncate(text, max_length=2500):
    # 優先保留包含關鍵詞的段落
    # 或使用句子重要性評分
    pass
```

### 優化 5: 減少分類分析 Token（已部分實現）

**當前**: 使用結構化結果  
**進一步優化**: 只傳遞關鍵資訊

```python
# 只傳遞最關鍵的資訊
combined_input = ""
for art in article_data:
    combined_input += f"【{art['title']}】\n"
    combined_input += f"摘要：{art['summary'][:200]}\n"  # 限制摘要長度
    combined_input += f"洞察：{art.get('insight', '')}\n"
    combined_input += f"情緒：{art.get('sentiment', 'neutral')}\n"
```

---

## 📈 優化效果預估

### 當前效能

| 指標 | 數值 |
|------|------|
| 總 API 呼叫 | 26 次 |
| 總耗時 | ~60-90 秒 |
| 總 Token | ~113,000 |
| 每日成本 | ~$0.025 |

### 優化後預估

| 優化項目 | 效果 |
|---------|------|
| 並行處理 | 時間: 60秒 → 10秒（6倍加速） |
| Token 優化 | Token: 113K → 80K（30% 減少） |
| 成本 | $0.025 → $0.018（28% 減少） |

---

## 🎯 推薦實施順序

### 階段 1: 立即實施（高 ROI）

1. **並行處理單篇分析**
   - 實施難度: ⭐⭐
   - 效果: ⭐⭐⭐⭐⭐
   - 時間節省: 50-80 秒

### 階段 2: 短期優化（中 ROI）

2. **進一步優化分類分析 Token**
   - 實施難度: ⭐
   - 效果: ⭐⭐⭐
   - Token 節省: 20-30%

### 階段 3: 長期優化（低優先級）

3. **快取機制**
4. **智能截取**

---

## 💡 實施建議

### 並行處理實作

可以修改 `scheduler.py` 使用 `concurrent.futures`：

```python
from concurrent.futures import ThreadPoolExecutor, as_completed

# 在分類階段使用並行
with ThreadPoolExecutor(max_workers=5) as executor:
    futures = {
        executor.submit(
            analyze_article,
            news.get("content", ""),
            news.get("title", ""),
            news.get("source", ""),
            news.get("published_at", "")
        ): news
        for news in raw_news_list
    }
    
    for future in as_completed(futures):
        news = futures[future]
        try:
            analysis_result = future.result()
            # 處理結果...
        except Exception as e:
            print(f"分析失敗: {e}")
```

---

## 📊 監控建議

建議加入以下監控指標：

1. **API 呼叫次數**: 追蹤每日呼叫次數
2. **Token 使用量**: 追蹤每日 token 消耗
3. **執行時間**: 追蹤每個階段的耗時
4. **成功率**: 追蹤 API 呼叫成功率
5. **成本**: 追蹤每日/每月成本

---

## 🔧 當前效率評估

### ✅ 優點

1. **結構化輸出**: 使用 JSON，便於處理
2. **Token 限制**: 已限制輸入長度
3. **分類限制**: 最多 5 個分類，避免過多呼叫
4. **錯誤處理**: 單篇失敗不影響整體

### ⚠️ 可改進

1. **並行處理**: 目前串行執行，耗時較長
2. **Token 優化**: 分類分析可進一步優化
3. **快取機制**: 可避免重複分析

---

## 🎯 結論

**當前效率**: ⭐⭐⭐ (3/5)
- 功能完整，但執行時間較長
- Token 使用合理，但可進一步優化

**優化後預期**: ⭐⭐⭐⭐ (4/5)
- 並行處理可大幅提升速度
- Token 優化可降低成本

**建議**: 優先實施並行處理，可立即獲得 6 倍速度提升。

