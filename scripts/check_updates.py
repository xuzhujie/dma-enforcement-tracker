#!/usr/bin/env python3
"""DMA 动态监测脚本

抓取欧盟委员会 Press Corner 官方 RSS，筛选与《数字市场法》(DMA) 相关的
执法新闻，合并去重后写入 public/data/updates.json。
由 GitHub Actions 每日定时运行（见 .github/workflows/monitor.yml）。
仅使用 Python 标准库。
"""

import json
import re
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from email.utils import parsedate_to_datetime
from pathlib import Path

RSS_URL = "https://ec.europa.eu/commission/presscorner/api/rss?language=en"
OUTPUT = Path(__file__).resolve().parent.parent / "public" / "data" / "updates.json"
MAX_ITEMS = 50

# DMA 相关关键词（标题或正文命中其一即收录）
KEYWORD_PATTERNS = [
    re.compile(r"digital markets act", re.I),
    re.compile(r"\bDMA\b"),
    re.compile(r"gatekeeper", re.I),
    re.compile(r"core platform service", re.I),
]


def fetch_rss(url: str) -> bytes:
    req = urllib.request.Request(url, headers={"User-Agent": "dma-tracker-bot/1.0"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        return resp.read()


def parse_items(xml_bytes: bytes) -> list[dict]:
    root = ET.fromstring(xml_bytes)
    items = []
    for item in root.iter("item"):
        title = (item.findtext("title") or "").strip()
        link = (item.findtext("link") or "").strip()
        desc = (item.findtext("description") or "").strip()
        pub = (item.findtext("pubDate") or "").strip()
        if not title or not link:
            continue
        text = f"{title} {desc}"
        if not any(p.search(text) for p in KEYWORD_PATTERNS):
            continue
        try:
            date = parsedate_to_datetime(pub).date().isoformat()
        except (TypeError, ValueError):
            date = ""
        # 摘要截断，避免 JSON 过大
        summary = re.sub(r"\s+", " ", desc)[:300]
        items.append({"title": title, "link": link, "date": date, "summary": summary})
    return items


def main() -> None:
    existing: dict = {"items": []}
    if OUTPUT.exists():
        existing = json.loads(OUTPUT.read_text(encoding="utf-8"))

    known_links = {it["link"] for it in existing.get("items", [])}
    new_items = [it for it in parse_items(fetch_rss(RSS_URL)) if it["link"] not in known_links]

    merged = new_items + existing.get("items", [])
    merged.sort(key=lambda x: x.get("date", ""), reverse=True)
    merged = merged[:MAX_ITEMS]

    payload = {
        "updated_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "source": RSS_URL,
        "items": merged,
    }
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"新增 {len(new_items)} 条，累计 {len(merged)} 条")


if __name__ == "__main__":
    main()
