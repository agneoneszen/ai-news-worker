"""
長期運行的排程器版本
適用於 Railway、Render 等需要持續運行的平台
"""
import schedule
import time
import os
import json
import datetime
import firebase_admin
from firebase_admin import credentials, firestore
from dotenv import load_dotenv

# 引入模組
from ai_service import analyze_article, analyze_category_group, generate_daily_briefing
from scraper import get_today_news
from collections import defaultdict

load_dotenv()

# ---------------------------------------------------------
# 1. 初始化 Firebase（支援環境變數或檔案）
# ---------------------------------------------------------
if not firebase_admin._apps:
    # 優先從環境變數讀取（適用於 Railway Secrets）
    if os.getenv("SERVICE_ACCOUNT_KEY"):
        try:
            cred_dict = json.loads(os.getenv("SERVICE_ACCOUNT_KEY"))
            cred = credentials.Certificate(cred_dict)
            print("✅ 從環境變數載入 Firebase 服務帳號金鑰")
        except json.JSONDecodeError:
            print("❌ 環境變數 SERVICE_ACCOUNT_KEY 格式錯誤")
            raise
    else:
        # 從檔案讀取（本地開發或傳統部署）
        CRED_PATH = os.path.join(os.path.dirname(__file__), "serviceAccountKey.json")
        if os.path.exists(CRED_PATH):
            cred = credentials.Certificate(CRED_PATH)
            print(f"✅ 從檔案載入 Firebase 服務帳號金鑰: {CRED_PATH}")
        else:
            raise FileNotFoundError(
                "找不到 serviceAccountKey.json 且未設定 SERVICE_ACCOUNT_KEY 環境變數"
            )
    
    firebase_admin.initialize_app(cred)

db = firestore.client()

# ---------------------------------------------------------
# 2. 主流程
# ---------------------------------------------------------
def job_pipeline():
    today_str = datetime.datetime.now().strftime("%Y-%m-%d")
    print(f"🚀 開始執行每日任務：{today_str}")

    # A. 獲取原料 (過去24小時的新聞)
    raw_news_list = get_today_news()

    # 🔥 關鍵檢查：如果沒有新聞，直接終止
    if not raw_news_list:
        print("⚠️ 警告：過去24小時內無法抓取到任何新聞 (或來源網站掛了)。")
        print("🛑 任務終止，未寫入任何資料，以確保無幻覺。")
        return

    # B. 單篇分類分析
    print(f"🧠 [2/5] 正在分類 {len(raw_news_list)} 篇新聞...")
    
    categorized_articles = defaultdict(list)
    
    for news in raw_news_list:
        # 呼叫 AI 分析獲取分類（傳入 metadata）
        analysis_result = analyze_article(
            text=news.get("content", ""),
            title=news.get("title", ""),
            source=news.get("source", ""),
            published_at=news.get("published_at", "")
        )
        
        if analysis_result:
            # 合併 AI 分析結果
            processed_news = {**news, **analysis_result}
            category = analysis_result.get('category', '未分類')
            categorized_articles[category].append(processed_news)
            confidence = analysis_result.get('confidence', 0.0)
            print(f"  - 已分類: {news['title'][:30]}... -> {category} (信心度: {confidence:.2f})")
        else:
            print(f"  - 分析失敗跳過: {news['title'][:30]}...")

    if not categorized_articles:
        print("❌ 所有新聞分析皆失敗，終止任務。")
        return

    # 限制分類數量最多5個（選擇文章數最多的5個分類）
    if len(categorized_articles) > 5:
        print(f"⚠️ 發現 {len(categorized_articles)} 個分類，將保留文章數最多的5個分類")
        sorted_categories = sorted(
            categorized_articles.items(), 
            key=lambda x: len(x[1]), 
            reverse=True
        )
        categorized_articles = dict(sorted_categories[:5])
        print(f"✅ 保留分類: {', '.join(categorized_articles.keys())}")

    # C. 統合同類文章並分析
    print(f"📚 [3/5] 正在統合並分析 {len(categorized_articles)} 個分類...")
    category_analyses = []
    
    for category, articles in categorized_articles.items():
        print(f"  - 分析分類「{category}」({len(articles)}篇)...")
        category_analysis = analyze_category_group(category, articles)
        if category_analysis:
            category_analyses.append(category_analysis)
            print(f"    ✅ 完成")
        else:
            print(f"    ❌ 分析失敗")

    if not category_analyses:
        print("❌ 所有分類分析皆失敗，終止任務。")
        return

    # D. 生成每日決策日報
    print("📝 [4/5] 正在撰寫每日決策日報...")
    daily_briefing_md = generate_daily_briefing(category_analyses)

    # E. 寫入 Firestore
    print("💾 [5/5] 正在寫入資料庫...")
    try:
        # 計算總文章數
        total_articles = sum(len(articles) for articles in categorized_articles.values())
        
        # 準備分類摘要資料（使用優化版結構）
        category_summaries = []
        for cat_analysis in category_analyses:
            category_summaries.append({
                'category': cat_analysis.get('category'),
                'article_count': cat_analysis.get('article_count', 0),
                'executive_summary': cat_analysis.get('executive_summary', cat_analysis.get('summary', '')),
                'storylines': cat_analysis.get('storylines', []),
                'key_points': cat_analysis.get('key_points', []),
                'risks': cat_analysis.get('risks', []),
                'opportunities': cat_analysis.get('opportunities', []),
                'signals_to_watch': cat_analysis.get('signals_to_watch', []),
                'confidence': cat_analysis.get('confidence', 0.0)
            })
        
        db.collection('daily_news').document(today_str).set({
            'date_str': today_str,
            'content': daily_briefing_md,
            'article_count': total_articles,
            'category_count': len(category_analyses),
            'categories': [cat.get('category') for cat in category_analyses],
            'category_summaries': category_summaries,  # 新增：分類摘要
            'created_at': firestore.SERVER_TIMESTAMP,
            'status': 'published'
        })
        
        print(f"✅ 任務成功！真實日報已存入: daily_news/{today_str}")
        print(f"   📊 統計: {total_articles} 篇文章，{len(category_analyses)} 個分類")

    except Exception as e:
        print(f"❌ Firestore 寫入錯誤: {e}")

# ---------------------------------------------------------
# 3. 排程設定
# ---------------------------------------------------------
# 每天 09:00 UTC 執行（可根據需求調整）
schedule.every().day.at("09:00").do(job_pipeline)

# 也可以設定每小時執行（測試用，部署時請移除）
# schedule.every().hour.do(job_pipeline)

# 立即執行一次（可選，用於測試）
# print("🧪 立即執行一次測試...")
# job_pipeline()

if __name__ == "__main__":
    print("=" * 60)
    print("⏰ AI News Worker 排程器已啟動")
    print("=" * 60)
    print(f"📅 下次執行時間: {schedule.next_run()}")
    print(f"🔄 檢查間隔: 每 60 秒")
    print("=" * 60)
    print("")
    
    # 主循環
    while True:
        schedule.run_pending()
        time.sleep(60)  # 每分鐘檢查一次

