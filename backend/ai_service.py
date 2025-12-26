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

def generate_daily_briefing(articles_data):
    """生成每日決策日報 Markdown"""
    if not articles_data:
        return "⚠️ 資料不足，無法生成日報。"

    # 整理資料給 AI
    input_text = ""
    for a in articles_data:
        # 確保有這些欄位，避免報錯
        category = a.get('category', '未分類')
        title = a.get('title', '無標題')
        insight = a.get('insight', '無洞察')
        input_text += f"- [{category}] {title} (Insight: {insight})\n"
    
    if len(input_text) > 4000: input_text = input_text[:4000] + "..."

    system_prompt = """
    你是一位加密貨幣與科技產業的【首席策略官】。
    請根據提供的新聞清單，撰寫一份 Markdown 格式的【每日決策日報】。
    結構如下：
    ### 📊 市場情緒儀表板
    (判斷整體氣氛與關鍵熱詞)
    ### 🌊 三大核心趨勢
    (歸納今日最重要的三條故事線)
    ### 🧭 決策建議
    (給開發者與投資者的具體建議)
    """

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"【今日情報】\n{input_text}"}
            ],
            temperature=0.5,
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        return f"⚠️ 報告生成失敗: {e}"