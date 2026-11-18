#!/usr/bin/env python3
"""Send a plain-text DMA monitor notification over authenticated SMTP."""

import json
import os
import smtplib
import ssl
from email.message import EmailMessage

if __package__:
    from scripts.check_updates import is_penalty_item
else:
    from check_updates import is_penalty_item


def _clean_text(value: object) -> str:
    return " ".join(str(value or "").split())


def build_message(
    items: list[dict],
    *,
    sender: str,
    recipients: str,
    run_url: str,
) -> EmailMessage:
    if not items:
        raise ValueError("至少需要一条新动态才能发送邮件")

    penalty_count = sum(1 for item in items if is_penalty_item(item))
    general_count = len(items) - penalty_count
    if penalty_count and general_count:
        subject = f"DMA 监测：发现 {penalty_count} 条新处罚及 {general_count} 条新 DMA 动态"
    elif penalty_count:
        subject = f"DMA 监测：发现 {penalty_count} 条新处罚"
    else:
        subject = f"DMA 监测：发现 {general_count} 条新 DMA 动态"

    message = EmailMessage()
    message["Subject"] = subject
    message["From"] = sender
    message["To"] = recipients
    if penalty_count:
        message["Importance"] = "high"
        message["X-Priority"] = "1"

    lines = [
        "DMA 动态监测发现新内容。",
        "",
        f"新处罚：{penalty_count} 条",
        f"新 DMA 动态：{general_count} 条",
        "",
    ]
    for item in items:
        label = "处罚" if is_penalty_item(item) else "动态"
        title = _clean_text(item.get("title", "未命名动态"))
        date = _clean_text(item.get("date", ""))
        link = _clean_text(item.get("link", ""))
        lines.append(f"- [{label}] {title}" + (f"（{date}）" if date else ""))
        if link:
            lines.append(f"  {link}")

    if run_url:
        lines.extend(["", f"运行详情：{_clean_text(run_url)}"])
    message.set_content("\n".join(lines) + "\n")
    return message


def send_smtp_message(
    message: EmailMessage,
    *,
    host: str,
    port: int,
    username: str,
    password: str,
) -> None:
    context = ssl.create_default_context()
    if port == 465:
        with smtplib.SMTP_SSL(host, port, timeout=30, context=context) as smtp:
            smtp.login(username, password)
            smtp.send_message(message)
        return

    with smtplib.SMTP(host, port, timeout=30) as smtp:
        smtp.ehlo()
        smtp.starttls(context=context)
        smtp.ehlo()
        smtp.login(username, password)
        smtp.send_message(message)


def _required_env(name: str) -> str:
    value = os.environ.get(name, "").strip()
    if not value:
        raise RuntimeError(f"缺少邮件配置：{name}")
    return value


def main() -> int:
    items = json.loads(os.environ.get("NEW_ITEMS_JSON", "[]"))
    if not isinstance(items, list):
        raise ValueError("NEW_ITEMS_JSON 必须是 JSON 数组")
    if not items:
        print("没有新增动态，跳过邮件")
        return 0

    message = build_message(
        items,
        sender=_required_env("NOTIFY_EMAIL_FROM"),
        recipients=_required_env("NOTIFY_EMAIL_TO"),
        run_url=os.environ.get("RUN_URL", ""),
    )
    send_smtp_message(
        message,
        host=_required_env("NOTIFY_SMTP_HOST"),
        port=int(os.environ.get("NOTIFY_SMTP_PORT", "587")),
        username=_required_env("NOTIFY_SMTP_USERNAME"),
        password=_required_env("NOTIFY_SMTP_PASSWORD"),
    )
    print(f"邮件已发送：{message['Subject']}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
