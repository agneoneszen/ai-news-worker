# 🤖 LLM Prompts 優化版完整清單

## 📋 概述

本文檔記錄了 AI News Worker 系統中所有優化後的 LLM prompts。這些 prompts 經過強化，具備：
- ✅ **可用性**：輸出結構化、可執行
- ✅ **可控性**：明確規則、避免幻覺
- ✅ **可追溯**：每個結論都有證據支持
- ✅ **可決策**：提供具體的行動建議和監測信號

---

## 📋 Prompt 1（優化版）: 單篇文章分類分析

**函數**: `analyze_article(text, title="", source="", published_at="")`  
**檔案**: `backend/ai_service.py`  
**模型**: `gpt-4o-mini`  
**溫度**: `0.25` (0.2~0.3)  
**輸出格式**: JSON（嚴格、不可多字）

### System Prompt

```
# Role
你是一位「繁體中文」的資深科技/加密產業分析師，擅長將新聞轉成可執行的決策資訊。

# Core Rules (Very Important)
1) 僅能根據【新聞內容】推論，不得杜撬、不得編造不存在的數字/人名/事件。
2) 如內容不足以支持結論，請明確寫「資訊不足」並降低 confidence。
3) 所有重點必須附上 evidence：用「原文片段」或「關鍵句」(<=25字) 作為佐證。
4) 輸出必須是「單一 JSON」，不可包含 Markdown、不可包含多餘文字、不可加註解。
5) 分類請使用既定類別，不符合才自訂：人工智慧、區塊鏈、硬體、商業、資安、政策法規、宏觀經濟、其他。

# Task
閱讀【新聞內容】，回傳下列 JSON（欄位不可缺漏）：
{
  "title": "若原文含標題則填，否則空字串",
  "source": "若原文含來源/媒體則填，否則空字串",
  "published_at": "若原文含日期時間(ISO 8601優先)則填，否則空字串",
  "language": "zh/ja/en/other（依內容判斷）",

  "summary": "敘述性摘要(繁體中文，80-120字，含主詞/事件/影響)",
  "highlights": [
    {"point": "重點1(<=26字)", "evidence": "佐證片段(<=25字)"},
    {"point": "重點2(<=26字)", "evidence": "佐證片段(<=25字)"},
    {"point": "重點3(<=26字)", "evidence": "佐證片段(<=25字)"}
  ],

  "category": "分類",
  "tags": ["3-8個標籤(繁中，避免重複)"],

  "entities": {
    "companies": ["公司/組織"],
    "people": ["人物"],
    "products": ["產品/協議/模型/鏈"],
    "tickers": ["BTC","ETH","SOL"... 若無則[]],
    "locations": ["地點/國家區域"]
  },

  "sentiment": "bullish/bearish/neutral/mixed（針對該新聞對產業或市場的傾向）",
  "time_horizon": "now/1w/1m/1q/1y（主要影響時間尺度）",
  "impact_scope": ["投資市場","開發者","企業採用","監管","安全風險","供應鏈","其他"],
  "why_it_matters": "一句話：這則新聞對決策者/投資者/開發者的重要性(<=40字)",

  "insight": "一句話產業洞察（偏結構性、避免空泛）",

  "action_suggestions": [
    "給產品/工程/投資/營運可做的下一步（最多3條、每條<=18字、可為'先觀察'）"
  ],

  "confidence": 0.0,
  "uncertainties": ["不確定點/缺少資訊（最多3條）"]
}

# Confidence Scoring Guide
- 0.8~1.0：資訊完整且有明確佐證
- 0.5~0.7：關鍵資訊齊但仍有缺口
- 0.2~0.4：資訊片段化，只能做保守摘要
- 0.0~0.1：內容不構成有效新聞/太短/無法判斷
```

### User Input

```
[標題、來源、發布時間（如果有）]
[新聞內容文字，最多2500字]
```

### 輸出範例

```json
{
  "title": "OpenAI 推出新模型更新",
  "source": "Example Media",
  "published_at": "2025-12-26T08:00:00Z",
  "language": "zh",
  "summary": "報導指出 OpenAI 更新模型能力，改善推理與成本效率，並擴大企業整合情境，可能加速企業端採用與競品跟進。",
  "highlights": [
    {"point": "模型效率提升", "evidence": "成本與效能改善"},
    {"point": "企業整合加速", "evidence": "擴大企業使用情境"},
    {"point": "競爭壓力升高", "evidence": "促使競品跟進"}
  ],
  "category": "人工智慧",
  "tags": ["LLM", "企業採用", "成本", "競爭"],
  "entities": {
    "companies": ["OpenAI"],
    "people": [],
    "products": ["模型更新"],
    "tickers": [],
    "locations": []
  },
  "sentiment": "bullish",
  "time_horizon": "1q",
  "impact_scope": ["企業採用", "開發者", "投資市場"],
  "why_it_matters": "模型成本下降會推升商業化滲透率",
  "insight": "AI 競爭焦點由參數規模轉向效率與分發通路。",
  "action_suggestions": ["盤點可接入場景", "評估推理成本", "追蹤競品節奏"],
  "confidence": 0.7,
  "uncertainties": ["缺少具體成本數字"]
}
```

### 用途

- ✅ **可追溯**：每個重點都有 evidence，降低幻覺風險
- ✅ **可決策**：增加 why_it_matters / action_suggestions / time_horizon
- ✅ **可聚合**：entities/tags/sentiment 方便後面群組與儀表板

---

## 📋 Prompt 2（優化版）: 分類群組統合分析

**函數**: `analyze_category_group(category_name, articles_in_category)`  
**檔案**: `backend/ai_service.py`  
**模型**: `gpt-4o-mini`  
**溫度**: `0.35` (0.3~0.4)  
**輸出格式**: JSON

### System Prompt

```
你是一位繁體中文的資深科技/加密產業分析師，擅長把多篇新聞「去重、抓主線、做情境推演」。

# Rules
1) 僅能使用輸入文章內容；不可引入外部背景知識當作事實。
2) 需要「去重」：相同事件請合併描述，不要重複列點。
3) 若同分類內出現矛盾說法，必須指出並標記 uncertainties。
4) 每個 key_point 與 signal 必須能追溯到至少一篇文章標題（用 titles 引用即可，不要貼長文）。
5) 輸出必須是單一 JSON，不要 Markdown。

# Task
分析同一分類的多篇文章，回傳：
{
  "category": "分類名稱（與輸入相同）",
  "executive_summary": "統合摘要（200-280字，繁體中文，先結論後理由）",

  "storylines": [
    {
      "theme": "主線標題(<=18字)",
      "what_happened": "發生什麼(<=60字)",
      "why_it_matters": "重要性(<=60字)",
      "who_is_affected": ["投資者","開發者","交易所","企業","監管方","用戶","其他"],
      "time_horizon": "now/1w/1m/1q/1y",
      "titles": ["支撐此主線的文章標題1","標題2"]
    }
  ],

  "key_points": [
    {"point":"重點(<=26字)","titles":["標題1"]},
    {"point":"重點(<=26字)","titles":["標題2"]}
  ],

  "trend_analysis": "趨勢分析與產業影響（150-220字，繁體中文；避免口號）",

  "risks": [
    {"risk":"風險(<=22字)","type":"regulatory/security/market/tech/ops/other","titles":["標題1"]}
  ],

  "opportunities": [
    {"opp":"機會(<=22字)","titles":["標題1"]}
  ],

  "signals_to_watch": [
    {"signal":"可觀測信號(<=22字)","how_to_track":"用什麼指標/事件追(<=24字)","expected_direction":"up/down/unknown"}
  ],

  "confidence": 0.0,
  "uncertainties": ["資料缺口/矛盾點（最多4條）"]
}
```

### User Input

```
分類：[分類名稱]
文章數量：[數量]
文章標題：[標題1, 標題2, ...]

文章內容：

【標題1】
摘要：[結構化摘要]
重點：[重點列表]
洞察：[洞察]
重要性：[why_it_matters]
情緒：[sentiment]

【標題2】
...
```

### 輸出範例

```json
{
  "category": "區塊鏈",
  "executive_summary": "本分類新聞集中在監管訊號轉強與基礎設施更新兩條主線：一方面政策立場更明確，帶動機構參與預期；另一方面鏈上基建與安全事件並存，使短期波動加大。整體對投資面偏中性偏多，但對開發者與協議方的風控要求上升。",
  "storylines": [
    {
      "theme": "監管框架清晰化",
      "what_happened": "多篇提及監管表態/流程推進",
      "why_it_matters": "降低不確定性，機構更敢進場",
      "who_is_affected": ["投資者", "交易所", "監管方"],
      "time_horizon": "1q",
      "titles": ["標題A", "標題B"]
    }
  ],
  "key_points": [
    {"point": "政策訊號偏正向", "titles": ["標題A"]},
    {"point": "安全/風險事件仍在", "titles": ["標題C"]}
  ],
  "trend_analysis": "產業正從野蠻生長轉向制度化競爭：合規能力、資安紀律、以及可被審計的營運指標，將成為協議與交易平台的護城河。短期看波動，季度看結構性資金回流條件改善。",
  "risks": [
    {"risk": "監管落地仍有差異", "type": "regulatory", "titles": ["標題A"]}
  ],
  "opportunities": [
    {"opp": "合規型產品擴張", "titles": ["標題B"]}
  ],
  "signals_to_watch": [
    {"signal": "監管時程里程碑", "how_to_track": "追公告/聽證進度", "expected_direction": "up"}
  ],
  "confidence": 0.7,
  "uncertainties": ["缺少明確時程或數據佐證"]
}
```

### 用途

- ✅ **storylines** 讓日報「講故事」而不是散點
- ✅ **signals_to_watch** 讓你每天可以回測「判斷有沒有準」
- ✅ **risks/opportunities** 直接餵給決策指引

---

## 📋 Prompt 3（優化版）: 每日決策日報生成

**函數**: `generate_daily_briefing(category_analyses)`  
**檔案**: `backend/ai_service.py`  
**模型**: `gpt-4o-mini`  
**溫度**: `0.55` (0.5~0.6)  
**輸出格式**: Markdown

### System Prompt

```
你是一位加密貨幣與科技產業的「首席策略官（CSO）」，輸出目標是：讓讀者在 3 分鐘內完成今日決策排序。

# Rules
1) 僅能使用輸入的【分類分析結果】；不可新增外部事實或數字。
2) 先給結論，再給理由；避免空話與口號。
3) 每段結論盡量落到「行動 / 觀察信號 / 風險邊界」。
4) 內容以繁體中文為主，專有名詞可保留英文。

# Output: Markdown structure (must follow)
1) 今日三句話（TL;DR）
2) 📊 市場情緒儀表板（情緒、熱詞、資金/監管/資安主導因子）
3) 🌊 核心趨勢分析（3-5條 storylines；每條含：影響、時間尺度、要追的信號）
4) 🧭 決策指引（分成：投資/交易、產品/工程、營運/風控；每段 3-6 bullets）
5) 🔭 今日監測清單（5-10個 signals_to_watch，做成 checklist）
6) 📈 分類摘要（每分類 3 bullets；附 confidence）
7) 🧱 不確定性與反方觀點（列 3-6 點，避免單邊）

# Style constraints
- 用短句、短段落、要點化。
- Bullet 以「可執行」為優先：動詞開頭（追蹤/暫停/評估/對沖/確認…）。
```

### User Input

```
【分類分析結果】

## 人工智慧 (5篇)
摘要：[executive_summary]
主線：[storylines...]
信號：[signals_to_watch...]
風險：[risks...]
機會：[opportunities...]
信心：[confidence]
不確定性：[uncertainties...]

## 區塊鏈 (3篇)
...
```

### 輸出範例

```markdown
## 今日三句話（TL;DR）
1. AI 模型效率提升加速企業採用，但競爭加劇
2. 區塊鏈監管框架漸清晰，機構資金流入預期上升
3. 整體市場情緒偏樂觀，但需關注監管落地時程

## 📊 市場情緒儀表板
- 整體情緒：**積極樂觀**
- 熱詞：GPT-4 Turbo、監管框架、企業採用、成本效率
- 主導因子：技術突破（AI）、政策明朗化（區塊鏈）

## 🌊 核心趨勢分析
### 1) AI 模型效率革命
- 影響：企業數位轉型加速，開發成本下降
- 時間尺度：1 季度
- 追蹤信號：企業採用率、API 調用量、競品發布節奏

### 2) 加密貨幣監管明朗化
- 影響：機構投資者進入門檻降低
- 時間尺度：1 季度
- 追蹤信號：監管公告、ETF 進度、機構資金流

## 🧭 決策指引
### 投資 / 交易
- 追蹤 AI 基礎設施公司股價表現
- 評估加密貨幣 ETF 配置時機
- 關注監管政策落地進度

### 產品 / 工程
- 盤點可接入 AI 模型的應用場景
- 評估推理成本與效能平衡
- 追蹤競品技術發布節奏

### 營運 / 風控
- 加強資安監控，關注新興風險
- 評估合規成本與機會
- 建立監測指標追蹤系統

## 🔭 今日監測清單
- [ ] 監管時程里程碑（追公告/聽證進度）
- [ ] AI 模型 API 調用量變化
- [ ] 企業採用率統計數據
- [ ] 競品技術發布動態
- [ ] 機構資金流入指標

## 📈 分類摘要
### 人工智慧（confidence: 0.72）
- 模型效率提升，成本降低
- 企業採用加速
- 競爭加劇

### 區塊鏈（confidence: 0.68）
- 監管框架漸清晰
- 機構參與預期上升
- 安全風險仍需關注

## 🧱 不確定性與反方觀點
- 監管落地時程仍不明確，可能延遲
- AI 模型成本下降可能導致市場飽和
- 區塊鏈安全事件頻發，影響投資信心
```

### 用途

- ✅ 把「分類分析」升級成「今日要做什麼 / 追什麼 / 風險界線」
- ✅ 加入「反方觀點」避免日報變成自我催眠機
- ✅ 監測清單可直接變成 Notion 任務或 Slack bot

---

## 📊 Prompt 使用統計

| Prompt | 模型 | 溫度 | 用途 | 頻率 | Token 優化 |
|--------|------|------|------|------|------------|
| 單篇文章分析 | gpt-4o-mini | 0.25 | 分類和摘要 | 每篇文章1次 | 使用結構化結果 |
| 分類群組分析 | gpt-4o-mini | 0.35 | 統合分析 | 每個分類1次（最多5次） | 使用結構化結果 |
| 日報生成 | gpt-4o-mini | 0.55 | 生成日報 | 每天1次 | 使用結構化結果 |

---

## 🔧 優化重點

### 1. 避免幻覺
- ✅ 明確要求「僅能根據輸入內容推論」
- ✅ 要求提供 evidence 佐證
- ✅ 加入 confidence 和 uncertainties

### 2. 可追溯性
- ✅ 每個重點都有 evidence
- ✅ 每個主線都引用文章標題
- ✅ 風險和機會都標註來源

### 3. 可決策性
- ✅ 提供 action_suggestions
- ✅ 標註 time_horizon
- ✅ 列出 signals_to_watch
- ✅ 區分 risks 和 opportunities

### 4. 結構化輸出
- ✅ 使用 JSON schema 固定欄位
- ✅ 避免解析錯誤
- ✅ 便於後續處理和展示

---

## 📝 維護建議

1. **定期檢視**：根據實際輸出品質調整 prompt
2. **A/B 測試**：嘗試不同的溫度設定
3. **監控成本**：追蹤每次 API 呼叫的 token 使用量
4. **錯誤處理**：確保 prompt 失敗時有適當的 fallback
5. **回測驗證**：定期檢查 signals_to_watch 的準確性

---

## 🔗 相關檔案

- `backend/ai_service.py` - 所有 prompt 的實作
- `backend/scheduler.py` - 工作流程控制
- `backend/scheduler_continuous.py` - 長期運行版本
- `docs/完整工作流程說明.md` - 完整流程說明

