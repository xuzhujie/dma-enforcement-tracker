#!/usr/bin/env python3
"""DMA 动态监测脚本

抓取欧盟委员会 Press Corner 官方 RSS，筛选与《数字市场法》(DMA) 相关的
执法新闻，合并去重后写入 public/data/updates.json。
由 GitHub Actions 每日定时运行（见 .github/workflows/monitor.yml）。
仅使用 Python 标准库。
"""

import json
import os
import re
import time
import urllib.error
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from email.utils import parsedate_to_datetime
from pathlib import Path

RSS_URL = "https://ec.europa.eu/commission/presscorner/api/rss?language=en"
OUTPUT = Path(__file__).resolve().parent.parent / "public" / "data" / "updates.json"
MAX_ITEMS = 50
RSS_FETCH_ATTEMPTS = 3
RSS_FETCH_TIMEOUT = 30

# DMA 相关关键词（标题或正文命中其一即收录）
KEYWORD_PATTERNS = [
    re.compile(r"digital markets act", re.I),
    re.compile(r"\bDMA\b"),
    re.compile(r"gatekeeper", re.I),
    re.compile(r"core platform service", re.I),
]

PENALTY_PATTERNS = [
    re.compile(r"\bfines?\b", re.I),
    re.compile(r"\bfined\b", re.I),
    re.compile(r"penalt", re.I),
    re.compile(r"non-compliance decision", re.I),
    re.compile(r"罚款"),
]


def fetch_rss(url: str) -> bytes:
    req = urllib.request.Request(url, headers={"User-Agent": "dma-tracker-bot/1.0"})
    for attempt in range(RSS_FETCH_ATTEMPTS):
        try:
            with urllib.request.urlopen(req, timeout=RSS_FETCH_TIMEOUT) as resp:
                return resp.read()
        except (TimeoutError, urllib.error.URLError) as error:
            if attempt == RSS_FETCH_ATTEMPTS - 1:
                raise
            delay = 2 ** (attempt + 1)
            print(
                f"RSS 获取失败（第 {attempt + 1}/{RSS_FETCH_ATTEMPTS} 次）："
                f"{error}；{delay} 秒后重试"
            )
            time.sleep(delay)

    raise RuntimeError("RSS 获取重试逻辑异常结束")


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


def merge_items(existing_items: list[dict], incoming_items: list[dict]) -> list[dict]:
    """Merge unseen RSS items into the existing bounded, date-sorted list."""
    known_links = {item.get("link") for item in existing_items}
    new_items = []
    for item in incoming_items:
        link = item.get("link")
        if not link or link in known_links:
            continue
        known_links.add(link)
        new_items.append(item)

    merged = new_items + list(existing_items)
    merged.sort(key=lambda item: item.get("date", ""), reverse=True)
    return merged[:MAX_ITEMS]


def is_penalty_item(item: dict) -> bool:
    text = f"{item.get('title', '')} {item.get('summary', '')}"
    return any(pattern.search(text) for pattern in PENALTY_PATTERNS)


def write_github_outputs(new_items: list[dict]) -> None:
    """Expose stable monitor metadata to GitHub Actions when running there."""
    output_path = os.environ.get("GITHUB_OUTPUT")
    if not output_path:
        return

    penalty_count = sum(1 for item in new_items if is_penalty_item(item))
    with Path(output_path).open("a", encoding="utf-8") as output:
        output.write(f"changed={'true' if new_items else 'false'}\n")
        output.write(f"new_count={len(new_items)}\n")
        output.write(f"penalty_count={penalty_count}\n")
        output.write("new_items_json<<DMA_ITEMS\n")
        output.write(json.dumps(new_items, ensure_ascii=False))
        output.write("\nDMA_ITEMS\n")


def main() -> None:
    existing: dict = {"items": []}
    if OUTPUT.exists():
        existing = json.loads(OUTPUT.read_text(encoding="utf-8"))

    existing_items = existing.get("items", [])
    incoming_items = parse_items(fetch_rss(RSS_URL))
    existing_links = {item.get("link") for item in existing_items}
    new_items = [item for item in incoming_items if item.get("link") not in existing_links]
    merged = merge_items(existing_items, incoming_items)
    write_github_outputs(new_items)

    # Keep the data file stable when the monitor finds nothing new. This avoids
    # an empty daily commit caused only by a refreshed timestamp.
    if not new_items:
        print(f"新增 0 条，累计 {len(merged)} 条")
        return

    payload = {
        "updated_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "source": existing.get("source", RSS_URL),
        "items": merged,
    }
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    penalty_count = sum(1 for item in new_items if is_penalty_item(item))
    print(f"新增 {len(new_items)} 条（其中处罚 {penalty_count} 条），累计 {len(merged)} 条")


if __name__ == "__main__":
    main()
