import feedparser
import datetime
import time

# RSS 來源清單
RSS_FEEDS = [
    {
        "source": "The Verge",
        "url": "https://www.theverge.com/rss/index.xml",
        "category": "Tech"
    },
    {
        "source": "CoinDesk",
        "url": "https://www.coindesk.com/arc/outboundfeeds/rss/",
        "category": "Crypto"
    }
]

def get_today_news():
    """
    主函式：抓取今日新聞 (嚴格模式)
    - 成功：回傳新聞列表
    - 失敗：回傳空列表 [] (絕對不回傳假資料)
    """
    news_list = []
    print("🕷️ [Scraper] 開始抓取外部 RSS...")

    try:
        for feed_info in RSS_FEEDS:
            print(f"   - 正在讀取: {feed_info['source']}...")
            # 設定 timeout 避免卡死
            # 注意：feedparser 本身不支援 timeout 參數，通常依賴 socket 設定，
            # 但這裡我們簡單處理，若失敗會被 Exception 捕捉
            feed = feedparser.parse(feed_info['url'])
            
            if feed.bozo: # bozo=1 代表解析有錯誤 (非標準 XML 或連線問題)
                print(f"     ⚠️ {feed_info['source']} 解析警告: {feed.bozo_exception}")
                continue

            # 只取前 5 篇，避免資料過舊
            for entry in feed.entries[:5]:
                # 簡單過濾：只抓 24 小時內的新聞 (可選)
                # 這裡先不做時間過濾，確保有資料可測
                
                content = ""
                if 'content' in entry:
                    content = entry.content[0].value
                elif 'summary' in entry:
                    content = entry.summary
                else:
                    content = entry.title

                # 簡單清理 HTML
                import re
                clean_content = re.sub('<[^<]+?>', '', content)[:1000]

                news_item = {
                    "title": entry.title,
                    "url": entry.link,
                    "content": clean_content,
                    "source": feed_info['source'],
                    "published_at": entry.get('published', datetime.datetime.now().isoformat()),
                    # 預設類別，稍後 AI 會重新分析
                    "category": feed_info['category'] 
                }
                news_list.append(news_item)
                
            # 禮貌性延遲，避免被擋
            time.sleep(1)
        
        print(f"✅ [Scraper] 成功抓取 {len(news_list)} 篇真實新聞。")
        return news_list

    except Exception as e:
        print(f"❌ [Scraper] 發生嚴重錯誤: {e}")
        return [] # 發生錯誤直接回傳空，不造假