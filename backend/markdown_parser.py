"""
Markdown 解析器：將每日報告的 Markdown 內容拆解成結構化格式
"""
import re
from typing import Dict, List, Optional


def parse_daily_briefing(markdown_content: str) -> Dict:
    """
    解析每日報告的 Markdown 內容，拆解成結構化格式
    
    Args:
        markdown_content: Markdown 格式的每日報告
        
    Returns:
        結構化的字典，包含各個區塊
    """
    if not markdown_content:
        return {}
    
    result = {
        'tldr': [],  # 今日三句話
        'sentiment': {},  # 市場情緒儀表板
        'trends': [],  # 核心趨勢分析
        'decisions': {  # 決策指引
            'investment': [],
            'product': [],
            'operations': []
        },
        'monitoring': [],  # 今日監測清單
        'categories': [],  # 分類摘要
        'uncertainties': [],  # 不確定性與反方觀點
        'sources': {}  # 資訊來源
    }
    
    # 解析「今日三句話（TL;DR）」
    tldr_match = re.search(r'##\s*今日三句話[^\n]*\n(.*?)(?=\n##|\Z)', markdown_content, re.DOTALL)
    if tldr_match:
        tldr_content = tldr_match.group(1).strip()
        # 提取列表項
        tldr_items = re.findall(r'^-\s*(.+)$', tldr_content, re.MULTILINE)
        if not tldr_items:
            # 如果沒有列表格式，嘗試提取段落
            paragraphs = [p.strip() for p in tldr_content.split('\n') if p.strip() and not p.strip().startswith('（')]
            tldr_items = [p for p in paragraphs if len(p) > 10][:3]
        result['tldr'] = tldr_items[:3]
    
    # 解析「市場情緒儀表板」
    sentiment_match = re.search(r'##\s*[📊]*\s*市場情緒儀表板[^\n]*\n(.*?)(?=\n##|\Z)', markdown_content, re.DOTALL)
    if sentiment_match:
        sentiment_content = sentiment_match.group(1).strip()
        # 提取各個項目
        sentiment_items = re.findall(r'^-\s*([^:]+):\s*(.+)$', sentiment_content, re.MULTILINE)
        for key, value in sentiment_items:
            key = key.strip()
            value = value.strip()
            if '情緒' in key:
                result['sentiment']['mood'] = value
            elif '熱詞' in key:
                result['sentiment']['hot_words'] = [w.strip() for w in value.split('、') if w.strip()]
            elif '資金' in key:
                result['sentiment']['capital_factor'] = value
            elif '監管' in key:
                result['sentiment']['regulatory_factor'] = value
            elif '資安' in key:
                result['sentiment']['security_factor'] = value
    
    # 解析「核心趨勢分析」
    trends_match = re.search(r'##\s*[🌊]*\s*核心趨勢分析[^\n]*\n(.*?)(?=\n##|\Z)', markdown_content, re.DOTALL)
    if trends_match:
        trends_content = trends_match.group(1).strip()
        # 提取列表項
        trend_items = re.findall(r'^-\s*(.+?):\s*(.+)$', trends_content, re.MULTILINE)
        for title, description in trend_items:
            result['trends'].append({
                'title': title.strip(),
                'description': description.strip()
            })
        # 如果沒有標題格式，提取所有列表項
        if not trend_items:
            trend_list = re.findall(r'^-\s*(.+)$', trends_content, re.MULTILINE)
            result['trends'] = [{'title': '', 'description': item.strip()} for item in trend_list]
    
    # 解析「決策指引」
    decisions_match = re.search(r'##\s*[🧭]*\s*決策指引[^\n]*\n(.*?)(?=\n##|\Z)', markdown_content, re.DOTALL)
    if decisions_match:
        decisions_content = decisions_match.group(1).strip()
        # 解析各個子區塊
        investment_match = re.search(r'###\s*投資/交易[^\n]*\n(.*?)(?=\n###|\n##|\Z)', decisions_content, re.DOTALL)
        if investment_match:
            investment_items = re.findall(r'^-\s*(.+)$', investment_match.group(1), re.MULTILINE)
            result['decisions']['investment'] = [item.strip() for item in investment_items]
        
        product_match = re.search(r'###\s*產品/工程[^\n]*\n(.*?)(?=\n###|\n##|\Z)', decisions_content, re.DOTALL)
        if product_match:
            product_items = re.findall(r'^-\s*(.+)$', product_match.group(1), re.MULTILINE)
            result['decisions']['product'] = [item.strip() for item in product_items]
        
        operations_match = re.search(r'###\s*營運/風控[^\n]*\n(.*?)(?=\n###|\n##|\Z)', decisions_content, re.DOTALL)
        if operations_match:
            operations_items = re.findall(r'^-\s*(.+)$', operations_match.group(1), re.MULTILINE)
            result['decisions']['operations'] = [item.strip() for item in operations_items]
    
    # 解析「今日監測清單」
    monitoring_match = re.search(r'##\s*[🔭]*\s*今日監測清單[^\n]*\n(.*?)(?=\n##|\Z)', markdown_content, re.DOTALL)
    if monitoring_match:
        monitoring_content = monitoring_match.group(1).strip()
        # 提取 checkbox 列表項
        monitoring_items = re.findall(r'^-\s*\[([\sx])\]\s*(.+)$', monitoring_content, re.MULTILINE)
        result['monitoring'] = [{'checked': item[0].strip() == 'x', 'text': item[1].strip()} for item in monitoring_items]
        # 如果沒有 checkbox，提取普通列表項
        if not monitoring_items:
            monitoring_list = re.findall(r'^-\s*(.+)$', monitoring_content, re.MULTILINE)
            result['monitoring'] = [{'checked': False, 'text': item.strip()} for item in monitoring_list]
    
    # 解析「分類摘要」
    categories_match = re.search(r'##\s*[📈]*\s*分類摘要[^\n]*\n(.*?)(?=\n##|\Z)', markdown_content, re.DOTALL)
    if categories_match:
        categories_content = categories_match.group(1).strip()
        # 提取各個分類區塊
        category_blocks = re.findall(r'###\s*(.+?)\n(.*?)(?=\n###|\n##|\Z)', categories_content, re.DOTALL)
        for category_name, category_content in category_blocks:
            # 提取列表項
            category_items = re.findall(r'^-\s*(.+)$', category_content, re.MULTILINE)
            # 提取信心度
            confidence_match = re.search(r'（信心度：([\d.]+)）', category_content)
            confidence = float(confidence_match.group(1)) if confidence_match else 0.0
            
            result['categories'].append({
                'name': category_name.strip(),
                'items': [item.strip() for item in category_items],
                'confidence': confidence
            })
    
    # 解析「不確定性與反方觀點」
    uncertainties_match = re.search(r'##\s*[🧱]*\s*不確定性與反方觀點[^\n]*\n(.*?)(?=\n##|\Z)', markdown_content, re.DOTALL)
    if uncertainties_match:
        uncertainties_content = uncertainties_match.group(1).strip()
        uncertainty_items = re.findall(r'^-\s*(.+)$', uncertainties_content, re.MULTILINE)
        result['uncertainties'] = [item.strip() for item in uncertainty_items]
    
    # 解析「資訊來源」
    sources_match = re.search(r'##\s*[🔗]*\s*資訊來源[^\n]*\n(.*?)(?=\n##|\Z)', markdown_content, re.DOTALL)
    if sources_match:
        sources_content = sources_match.group(1).strip()
        # 提取各個分類的來源
        source_blocks = re.findall(r'###\s*(.+?)\n(.*?)(?=\n###|\n##|\Z)', sources_content, re.DOTALL)
        for category_name, source_list in source_blocks:
            # 提取連結
            links = re.findall(r'^-\s*\[([^\]]+)\]\(([^\)]+)\)\s*-\s*\*?([^\*]+)\*?', source_list, re.MULTILINE)
            result['sources'][category_name.strip()] = [
                {'title': link[0].strip(), 'url': link[1].strip(), 'source': link[2].strip()}
                for link in links
            ]
    
    return result

