import os
import json
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def analyze_article(text):
    """分析單篇文章，回傳 JSON 結構"""
    if not text: return None
    # 避免 Token 爆量，截取前 2500 字
    input_text = text[:2500]
    
    system_prompt = """
# Role
你是一位繁體中文的資深科技產業分析師。

# Task
閱讀【新聞內容】，回傳以下 JSON 格式：
{
  "summary": "敘述性摘要(繁體中文)",
  "highlights": "<li><b>重點1：</b>內容</li><li><b>重點2：</b>內容</li><li><b>重點3：</b>內容</li>",
  "category": "分類(如:人工智慧,區塊鏈,硬體,商業,資安,或自訂)",
  "insight": "一句話產業深度洞察"
}
"""
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini", # 或 gpt-3.5-turbo
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": input_text}
            ],
            temperature=0.3,
            response_format={"type": "json_object"}
        )
        return json.loads(response.choices[0].message.content)
    except Exception as e:
        print(f"❌ AI 分析失敗: {e}")
        return None

def analyze_category_group(category_name, articles_in_category):
    """
    分析同一分類的多篇文章，生成統合摘要
    回傳: {
        "category": "分類名稱",
        "summary": "統合摘要",
        "key_points": ["重點1", "重點2", ...],
        "trend_analysis": "趨勢分析"
    }
    """
    if not articles_in_category:
        return None
    
    # 合併所有文章內容
    combined_content = ""
    article_titles = []
    for article in articles_in_category:
        title = article.get('title', '無標題')
        content = article.get('content', '')
        article_titles.append(title)
        combined_content += f"\n\n【{title}】\n{content}\n"
    
    # 限制總長度
    if len(combined_content) > 8000:
        combined_content = combined_content[:8000] + "..."
    
    system_prompt = """
你是一位繁體中文的資深科技產業分析師。

請分析以下同一分類的多篇新聞文章，生成統合分析。

回傳 JSON 格式：
{
  "category": "分類名稱（與輸入相同）",
  "summary": "統合摘要（200-300字，繁體中文）",
  "key_points": ["重點1", "重點2", "重點3", "重點4"],
  "trend_analysis": "趨勢分析與產業影響（150-200字，繁體中文）"
}
"""
    
    user_content = f"""
分類：{category_name}
文章數量：{len(articles_in_category)}
文章標題：{', '.join(article_titles[:10])}  # 最多顯示10個標題

文章內容：
{combined_content}
"""
    
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_content}
            ],
            temperature=0.4,
            response_format={"type": "json_object"}
        )
        result = json.loads(response.choices[0].message.content)
        result['article_count'] = len(articles_in_category)
        result['article_titles'] = article_titles
        return result
    except Exception as e:
        print(f"❌ 分類分析失敗 ({category_name}): {e}")
        return None

def generate_daily_briefing(category_analyses):
    """
    根據分類分析結果生成每日決策日報
    category_analyses: 分類分析結果列表
    """
    if not category_analyses:
        return "⚠️ 資料不足，無法生成日報。"

    # 整理資料給 AI
    input_text = ""
    for cat_analysis in category_analyses:
        category = cat_analysis.get('category', '未分類')
        summary = cat_analysis.get('summary', '')
        key_points = cat_analysis.get('key_points', [])
        trend = cat_analysis.get('trend_analysis', '')
        article_count = cat_analysis.get('article_count', 0)
        
        input_text += f"\n## {category} ({article_count}篇)\n"
        input_text += f"摘要：{summary}\n"
        input_text += f"重點：{', '.join(key_points[:3])}\n"
        input_text += f"趨勢：{trend}\n"
    
    if len(input_text) > 6000: 
        input_text = input_text[:6000] + "..."

    system_prompt = """
你是一位加密貨幣與科技產業的【首席策略官】。

請根據提供的分類分析結果，撰寫一份 Markdown 格式的【每日決策日報】。

結構如下：

## 📊 市場情緒儀表板
(根據所有分類的內容，判斷整體市場氣氛、關鍵熱詞、投資者情緒)

## 🌊 核心趨勢分析
(根據各分類的趨勢分析，歸納出最重要的3-5條故事線，每條包含：
- 趨勢標題
- 簡要說明
- 影響範圍)

## 🧭 決策指引
(給開發者與投資者的具體建議，包含：
- 技術開發建議
- 投資策略建議
- 風險提醒)

## 📈 分類摘要
(簡要列出各分類的核心要點)
"""

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"【分類分析結果】\n{input_text}"}
            ],
            temperature=0.6,
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        return f"⚠️ 報告生成失敗: {e}"