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
from ai_service import analyze_article, generate_daily_briefing
from scraper import get_today_news

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

    # A. 獲取原料 (真實來源)
    raw_news_list = get_today_news()

    # 🔥 關鍵檢查：如果沒有新聞，直接終止
    if not raw_news_list:
        print("⚠️ 警告：今日無法抓取到任何新聞 (或來源網站掛了)。")
        print("🛑 任務終止，未寫入任何資料，以確保無幻覺。")
        return

    processed_articles = []

    # B. 單篇分析
    print(f"🧠 [2/4] 正在分析 {len(raw_news_list)} 篇新聞...")
    
    for news in raw_news_list:
        # 呼叫 AI 分析
        analysis_result = analyze_article(news.get("content", ""))
        
        if analysis_result:
            # 合併 AI 分析結果
            processed_news = {**news, **analysis_result}
            processed_articles.append(processed_news)
            print(f"  - 已分析: {news['title'][:20]}... -> {analysis_result.get('category')}")
        else:
            print(f"  - 分析失敗跳過: {news['title'][:20]}...")

    if not processed_articles:
        print("❌ 所有新聞分析皆失敗，終止任務。")
        return

    # C. 生成總結日報
    print("📝 [3/4] 正在撰寫每日決策日報...")
    daily_briefing_md = generate_daily_briefing(processed_articles)

    # D. 寫入 Firestore
    print("💾 [4/4] 正在寫入資料庫...")
    try:
        db.collection('daily_news').document(today_str).set({
            'date_str': today_str,
            'content': daily_briefing_md,
            'article_count': len(processed_articles),
            'tags': list(set([a['category'] for a in processed_articles])),
            'created_at': firestore.SERVER_TIMESTAMP,
            'status': 'published'
        })
        
        print(f"✅ 任務成功！真實日報已存入: daily_news/{today_str}")

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

