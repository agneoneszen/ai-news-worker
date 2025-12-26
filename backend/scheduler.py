import os
import datetime
import firebase_admin
from firebase_admin import credentials, firestore
from dotenv import load_dotenv
from concurrent.futures import ThreadPoolExecutor, as_completed

# 引入模組
from ai_service import analyze_article, analyze_category_group, generate_daily_briefing
from scraper import get_today_news  # 使用剛剛修改過的嚴格版爬蟲
from collections import defaultdict

load_dotenv()

# ---------------------------------------------------------
# 1. 初始化 Firebase
# ---------------------------------------------------------
CRED_PATH = os.path.join(os.path.dirname(__file__), "serviceAccountKey.json")
if not firebase_admin._apps:
    cred = credentials.Certificate(CRED_PATH)
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

    # B. 單篇分類分析（並行處理以提升效率）
    print(f"🧠 [2/5] 正在分類 {len(raw_news_list)} 篇新聞（並行處理）...")
    
    categorized_articles = defaultdict(list)
    
    # 使用並行處理加速分析（最多 5 個並行）
    with ThreadPoolExecutor(max_workers=5) as executor:
        futures = {
            executor.submit(
                analyze_article,
                text=news.get("content", ""),
                title=news.get("title", ""),
                source=news.get("source", ""),
                published_at=news.get("published_at", "")
            ): news
            for news in raw_news_list
        }
        
        completed = 0
        for future in as_completed(futures):
            news = futures[future]
            completed += 1
            try:
                analysis_result = future.result()
                
                if analysis_result:
                    # 合併 AI 分析結果
                    processed_news = {**news, **analysis_result}
                    category = analysis_result.get('category', '未分類')
                    categorized_articles[category].append(processed_news)
                    confidence = analysis_result.get('confidence', 0.0)
                    print(f"  [{completed}/{len(raw_news_list)}] 已分類: {news['title'][:30]}... -> {category} (信心度: {confidence:.2f})")
                else:
                    print(f"  [{completed}/{len(raw_news_list)}] 分析失敗跳過: {news['title'][:30]}...")
            except Exception as e:
                print(f"  [{completed}/{len(raw_news_list)}] 分析異常: {news['title'][:30]}... - {e}")

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

    # D. 生成每日決策日報（傳遞原始文章列表以包含來源連結）
    print("📝 [4/5] 正在撰寫每日決策日報...")
    # 收集所有已處理的文章（包含 URL）
    all_processed_articles = []
    for articles in categorized_articles.values():
        all_processed_articles.extend(articles)
    daily_briefing_md = generate_daily_briefing(category_analyses, source_articles=all_processed_articles)

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
        
        # 準備寫入資料
        doc_data = {
            'date_str': today_str,
            'content': daily_briefing_md,
            'article_count': total_articles,
            'category_count': len(category_analyses),
            'categories': [cat.get('category') for cat in category_analyses],
            'category_summaries': category_summaries,  # 新增：分類摘要
            'created_at': firestore.SERVER_TIMESTAMP,
            'status': 'published'
        }
        
        print(f"💾 準備寫入資料到: daily_news/{today_str}")
        print(f"   - 內容長度: {len(daily_briefing_md)} 字元")
        print(f"   - 文章數: {total_articles}")
        print(f"   - 分類數: {len(category_analyses)}")
        
        # 寫入 Firestore
        doc_ref = db.collection('daily_news').document(today_str)
        doc_ref.set(doc_data)
        
        # 驗證寫入
        verify_doc = doc_ref.get()
        if verify_doc.exists:
            print(f"✅ 任務成功！真實日報已存入: daily_news/{today_str}")
            print(f"   📊 統計: {total_articles} 篇文章，{len(category_analyses)} 個分類")
            print(f"   ✅ Firestore 寫入驗證成功")
        else:
            print(f"⚠️  警告: 寫入後驗證失敗，請檢查 Firestore 權限")

    except Exception as e:
        print(f"❌ Firestore 寫入錯誤: {e}")

if __name__ == "__main__":
    job_pipeline()