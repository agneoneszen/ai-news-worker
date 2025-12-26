import feedparser
import datetime
import time
from dateutil import parser as date_parser

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
    },
    {
        "source": "TechCrunch",
        "url": "https://techcrunch.com/feed/",
        "category": "Tech"
    },
    {
        "source": "Ars Technica",
        "url": "https://feeds.arstechnica.com/arstechnica/index",
        "category": "Tech"
    },
    {
        "source": "Wired",
        "url": "https://www.wired.com/feed/rss",
        "category": "Tech"
    },
    {
        "source": "CoinTelegraph",
        "url": "https://cointelegraph.com/rss",
        "category": "Crypto"
    },
    {
        "source": "Decrypt",
        "url": "https://decrypt.co/feed",
        "category": "Crypto"
    },
    {
        "source": "The Block",
        "url": "https://www.theblock.co/rss.xml",
        "category": "Crypto"
    },
    {
        "source": "Hacker News",
        "url": "https://hnrss.org/frontpage",
        "category": "Tech"
    },
    {
        "source": "VentureBeat",
        "url": "https://venturebeat.com/feed/",
        "category": "Tech"
    }
]

def get_today_news():
    """
    主函式：抓取過去24小時內的新聞 (嚴格模式)
    - 成功：回傳新聞列表
    - 失敗：回傳空列表 [] (絕對不回傳假資料)
    """
    news_list = []
    print("🕷️ [Scraper] 開始抓取外部 RSS（過去24小時）...")
    
    # 計算24小時前的時間
    now = datetime.datetime.now(datetime.timezone.utc)
    twenty_four_hours_ago = now - datetime.timedelta(hours=24)
    print(f"   📅 時間範圍: {twenty_four_hours_ago.strftime('%Y-%m-%d %H:%M:%S UTC')} 至現在")

    try:
        for feed_info in RSS_FEEDS:
            print(f"   - 正在讀取: {feed_info['source']}...")
            feed = feedparser.parse(feed_info['url'])
            
            if feed.bozo: # bozo=1 代表解析有錯誤 (非標準 XML 或連線問題)
                print(f"     ⚠️ {feed_info['source']} 解析警告: {feed.bozo_exception}")
                continue

            # 遍歷所有文章，過濾24小時內的
            for entry in feed.entries:
                # 解析發布時間
                try:
                    # feedparser 會自動解析時間，轉換為 UTC
                    published_time = entry.get('published_parsed')
                    if published_time:
                        # 轉換為 datetime 物件
                        published_dt = datetime.datetime(*published_time[:6], tzinfo=datetime.timezone.utc)
                    else:
                        # 如果沒有 published_parsed，嘗試解析 published 字串
                        published_str = entry.get('published', '')
                        if published_str:
                            published_str = date_parser.parse(published_str)
                            if published_str.tzinfo is None:
                                published_str = published_str.replace(tzinfo=datetime.timezone.utc)
                        else:
                            # 如果完全沒有時間資訊，跳過
                            continue
                    
                    # 檢查是否在過去24小時內
                    if published_dt < twenty_four_hours_ago:
                        continue  # 超過24小時，跳過
                        
                except Exception as e:
                    print(f"     ⚠️ 時間解析失敗: {entry.get('title', 'Unknown')[:30]}... - {e}")
                    continue
                
                # 提取內容
                content = ""
                if 'content' in entry:
                    content = entry.content[0].value
                elif 'summary' in entry:
                    content = entry.summary
                else:
                    content = entry.title

                # 清理 HTML
                import re
                clean_content = re.sub('<[^<]+?>', '', content)[:2000]  # 增加到2000字以保留更多內容

                news_item = {
                    "title": entry.title,
                    "url": entry.link,
                    "content": clean_content,
                    "source": feed_info['source'],
                    "published_at": published_dt.isoformat(),
                    # 預設類別，稍後 AI 會重新分類
                    "category": feed_info['category'] 
                }
                news_list.append(news_item)
                
            # 禮貌性延遲，避免被擋
            time.sleep(1)
        
        print(f"✅ [Scraper] 成功抓取 {len(news_list)} 篇過去24小時內的真實新聞。")
        return news_list

    except Exception as e:
        print(f"❌ [Scraper] 發生嚴重錯誤: {e}")
        return [] # 發生錯誤直接回傳空，不造假
