import os
import json
from openai import OpenAI
from dotenv import load_dotenv
from cache_manager import (
    get_content_hash, 
    get_cached_result, 
    save_cached_result,
    clear_expired_cache
)

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# 啟動時清除過期快取
clear_expired_cache()

def analyze_article(text, title="", source="", published_at=""):
    """
    分析單篇文章，回傳優化版 JSON 結構（帶證據、可決策）
    使用快取避免重複分析相同內容
    
    Args:
        text: 新聞內容
        title: 新聞標題（可選）
        source: 新聞來源（可選）
        published_at: 發布時間 ISO 8601（可選）
    
    Returns:
        JSON 結構包含：summary, highlights, category, entities, sentiment, 
        time_horizon, impact_scope, why_it_matters, insight, 
        action_suggestions, confidence, uncertainties
    """
    if not text: 
        return None
    
    # 檢查快取
    metadata = {'title': title, 'source': source}
    cache_key = get_content_hash(text, metadata)
    cached_result = get_cached_result(cache_key, cache_type="article")
    
    if cached_result:
        return cached_result
    
    # 避免 Token 爆量，截取前 2500 字
    input_text = text[:2500]
    
    system_prompt = """# Role
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
- 0.0~0.1：內容不構成有效新聞/太短/無法判斷"""
    
    # 構建用戶輸入，包含可用的 metadata
    user_content = input_text
    if title or source or published_at:
        metadata_parts = []
        if title:
            metadata_parts.append(f"標題：{title}")
        if source:
            metadata_parts.append(f"來源：{source}")
        if published_at:
            metadata_parts.append(f"發布時間：{published_at}")
        user_content = "\n".join(metadata_parts) + "\n\n" + input_text
    
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_content}
            ],
            temperature=0.25,  # 優化：0.2~0.3，使用 0.25
            response_format={"type": "json_object"}
        )
        result = json.loads(response.choices[0].message.content)
        
        # 儲存到快取
        save_cached_result(
            cache_key, 
            result, 
            cache_type="article",
            metadata={'title': title, 'source': source, 'published_at': published_at}
        )
        
        return result
    except Exception as e:
        print(f"❌ AI 分析失敗: {e}")
        return None

def analyze_category_group(category_name, articles_in_category):
    """
    分析同一分類的多篇文章，生成統合分析（優化版：去重、抽主線、產出可追蹤信號）
    使用快取避免重複分析相同分類組合
    
    Args:
        category_name: 分類名稱
        articles_in_category: 該分類下的文章列表（應包含 analyze_article 的完整結果）
    
    Returns:
        JSON 結構包含：executive_summary, storylines, key_points, trend_analysis,
        risks, opportunities, signals_to_watch, confidence, uncertainties
    """
    if not articles_in_category:
        return None
    
    # 檢查快取（基於分類名稱和文章標題組合）
    article_titles = [art.get('title', '') for art in articles_in_category]
    cache_content = f"{category_name}:{','.join(sorted(article_titles))}"
    cache_key = get_content_hash(cache_content)
    cached_result = get_cached_result(cache_key, cache_type="category")
    
    if cached_result:
        # 更新 article_count 和 article_titles（可能不同）
        cached_result['article_count'] = len(articles_in_category)
        cached_result['article_titles'] = article_titles
        return cached_result
    
    # 準備文章資料（使用結構化結果而非原始內容）
    article_data = []
    article_titles = []
    
    for article in articles_in_category:
        title = article.get('title', '無標題')
        article_titles.append(title)
        
        # 優先使用結構化分析結果
        summary = article.get('summary', '')
        highlights = article.get('highlights', [])
        insight = article.get('insight', '')
        entities = article.get('entities', {})
        sentiment = article.get('sentiment', 'neutral')
        why_it_matters = article.get('why_it_matters', '')
        
        # 如果沒有結構化結果，使用原始內容
        if not summary:
            summary = article.get('content', '')[:500]
        
        article_data.append({
            'title': title,
            'summary': summary,
            'highlights': highlights,
            'insight': insight,
            'entities': entities,
            'sentiment': sentiment,
            'why_it_matters': why_it_matters
        })
    
    # 構建輸入內容（使用結構化資料，更省 token，進一步優化）
    combined_input = ""
    for art in article_data:
        combined_input += f"\n【{art['title']}】\n"
        # 限制摘要長度以節省 token
        summary = art['summary'][:200] if len(art['summary']) > 200 else art['summary']
        combined_input += f"摘要：{summary}\n"
        
        # 只取前 2 個重點
        if art.get('highlights'):
            if isinstance(art['highlights'], list) and len(art['highlights']) > 0:
                if isinstance(art['highlights'][0], dict):
                    highlights_str = "; ".join([h.get('point', '') for h in art['highlights'][:2]])
                else:
                    highlights_str = "; ".join(art['highlights'][:2])
                combined_input += f"重點：{highlights_str}\n"
        
        # 只傳遞關鍵資訊
        combined_input += f"洞察：{art.get('insight', '')[:80]}\n"  # 限制洞察長度
        combined_input += f"重要性：{art.get('why_it_matters', '')}\n"
        combined_input += f"情緒：{art.get('sentiment', 'neutral')}\n"
    
    # 限制總長度
    if len(combined_input) > 8000:
        combined_input = combined_input[:8000] + "..."
    
    system_prompt = """你是一位繁體中文的資深科技/加密產業分析師，擅長把多篇新聞「去重、抓主線、做情境推演」。

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
}"""
    
    user_content = f"""分類：{category_name}
文章數量：{len(articles_in_category)}
文章標題：{', '.join(article_titles[:10])}

文章內容：
{combined_input}
"""
    
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_content}
            ],
            temperature=0.35,  # 優化：0.3~0.4，使用 0.35
            response_format={"type": "json_object"}
        )
        result = json.loads(response.choices[0].message.content)
        result['article_count'] = len(articles_in_category)
        result['article_titles'] = article_titles
        
        # 儲存到快取
        save_cached_result(
            cache_key,
            result,
            cache_type="category",
            metadata={'category': category_name, 'article_count': len(articles_in_category)}
        )
        
        return result
    except Exception as e:
        print(f"❌ 分類分析失敗 ({category_name}): {e}")
        return None

def generate_daily_briefing(category_analyses):
    """
    根據分類分析結果生成每日決策日報（優化版：更貼近投資/產品/風控/行動清單）
    
    Args:
        category_analyses: 分類分析結果列表（應包含 analyze_category_group 的完整結果）
    
    Returns:
        Markdown 格式的決策日報
    """
    if not category_analyses:
        return "⚠️ 資料不足，無法生成日報。"

    # 整理資料給 AI（使用結構化結果）
    input_text = ""
    for cat_analysis in category_analyses:
        category = cat_analysis.get('category', '未分類')
        executive_summary = cat_analysis.get('executive_summary', cat_analysis.get('summary', ''))
        storylines = cat_analysis.get('storylines', [])
        key_points = cat_analysis.get('key_points', [])
        trend_analysis = cat_analysis.get('trend_analysis', '')
        risks = cat_analysis.get('risks', [])
        opportunities = cat_analysis.get('opportunities', [])
        signals_to_watch = cat_analysis.get('signals_to_watch', [])
        confidence = cat_analysis.get('confidence', 0.0)
        uncertainties = cat_analysis.get('uncertainties', [])
        article_count = cat_analysis.get('article_count', 0)
        
        input_text += f"\n## {category} ({article_count}篇)\n"
        input_text += f"摘要：{executive_summary}\n"
        
        if storylines:
            input_text += f"主線：{len(storylines)}條\n"
            for sl in storylines[:2]:  # 最多顯示2條主線
                input_text += f"  - {sl.get('theme', '')}: {sl.get('what_happened', '')}\n"
        
        if key_points:
            if isinstance(key_points[0], dict):
                points_str = "; ".join([kp.get('point', '') for kp in key_points[:3]])
            else:
                points_str = "; ".join(key_points[:3])
            input_text += f"重點：{points_str}\n"
        
        input_text += f"趨勢：{trend_analysis}\n"
        
        if risks:
            risks_str = "; ".join([r.get('risk', '') if isinstance(r, dict) else r for r in risks[:2]])
            input_text += f"風險：{risks_str}\n"
        
        if opportunities:
            opps_str = "; ".join([o.get('opp', '') if isinstance(o, dict) else o for o in opportunities[:2]])
            input_text += f"機會：{opps_str}\n"
        
        if signals_to_watch:
            signals_str = "; ".join([s.get('signal', '') if isinstance(s, dict) else s for s in signals_to_watch[:3]])
            input_text += f"信號：{signals_str}\n"
        
        input_text += f"信心度：{confidence}\n"
        if uncertainties:
            input_text += f"不確定性：{'; '.join(uncertainties[:2])}\n"
    
    if len(input_text) > 6000: 
        input_text = input_text[:6000] + "..."

    system_prompt = """你是一位加密貨幣與科技產業的「首席策略官（CSO）」，輸出目標是：讓讀者在 3 分鐘內完成今日決策排序。

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
- Bullet 以「可執行」為優先：動詞開頭（追蹤/暫停/評估/對沖/確認…）。"""

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"【分類分析結果】\n{input_text}"}
            ],
            temperature=0.55,  # 優化：0.5~0.6，使用 0.55
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        return f"⚠️ 報告生成失敗: {e}"
