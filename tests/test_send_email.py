import os
import json
import subprocess
import sys
import unittest
from pathlib import Path
from unittest.mock import patch

from scripts import send_email

PROJECT_ROOT = Path(__file__).resolve().parent.parent


class SendEmailTests(unittest.TestCase):
    def test_build_message_marks_penalties_as_urgent_notification(self):
        message = send_email.build_message(
            [
                {
                    "title": "Commission fines Google €890 million",
                    "link": "https://example.test/fine",
                    "date": "2026-11-18",
                    "summary": "DMA non-compliance decision",
                }
            ],
            sender="alerts@example.test",
            recipients="owner@example.test",
            run_url="https://github.com/example/run/1",
        )

        self.assertEqual(message["Subject"], "DMA 监测：发现 1 条新处罚")
        self.assertEqual(message["From"], "alerts@example.test")
        self.assertEqual(message["To"], "owner@example.test")
        self.assertEqual(message["Importance"], "high")
        self.assertEqual(message["X-Priority"], "1")
        self.assertIn("Commission fines Google", message.get_content())
        self.assertIn("https://example.test/fine", message.get_content())

    def test_build_message_marks_general_dma_news_without_penalty(self):
        message = send_email.build_message(
            [
                {
                    "title": "Commission publishes DMA guidance",
                    "link": "https://example.test/guidance",
                    "date": "2026-11-18",
                    "summary": "The Commission provides an update.",
                }
            ],
            sender="alerts@example.test",
            recipients="owner@example.test",
            run_url="https://github.com/example/run/2",
        )

        self.assertEqual(message["Subject"], "DMA 监测：发现 1 条新 DMA 动态")

    def test_main_skips_smtp_when_no_new_items(self):
        with patch.dict(os.environ, {"NEW_ITEMS_JSON": "[]"}, clear=True), patch.object(
            send_email, "send_smtp_message"
        ) as send_smtp_message:
            result = send_email.main()

        self.assertEqual(result, 0)
        send_smtp_message.assert_not_called()

    def test_main_sends_one_message_for_new_items(self):
        environment = {
            "NEW_ITEMS_JSON": json.dumps(
                [
                    {
                        "title": "Commission fines Google",
                        "link": "https://example.test/fine",
                        "date": "2026-11-18",
                        "summary": "DMA non-compliance decision",
                    }
                ]
            ),
            "NOTIFY_SMTP_HOST": "smtp.example.test",
            "NOTIFY_SMTP_PORT": "587",
            "NOTIFY_SMTP_USERNAME": "alerts@example.test",
            "NOTIFY_SMTP_PASSWORD": "test-password",
            "NOTIFY_EMAIL_FROM": "alerts@example.test",
            "NOTIFY_EMAIL_TO": "owner@example.test",
            "RUN_URL": "https://github.com/example/run/3",
        }
        with patch.dict(os.environ, environment, clear=True), patch.object(
            send_email, "send_smtp_message"
        ) as send_smtp_message:
            result = send_email.main()

        self.assertEqual(result, 0)
        send_smtp_message.assert_called_once()
        message = send_smtp_message.call_args.args[0]
        self.assertEqual(message["Subject"], "DMA 监测：发现 1 条新处罚")

    def test_main_propagates_smtp_failures(self):
        environment = {
            "NEW_ITEMS_JSON": json.dumps(
                [
                    {
                        "title": "Commission publishes DMA guidance",
                        "link": "https://example.test/guidance",
                        "date": "2026-11-18",
                        "summary": "The Commission provides an update.",
                    }
                ]
            ),
            "NOTIFY_SMTP_HOST": "smtp.example.test",
            "NOTIFY_SMTP_USERNAME": "alerts@example.test",
            "NOTIFY_SMTP_PASSWORD": "test-password",
            "NOTIFY_EMAIL_FROM": "alerts@example.test",
            "NOTIFY_EMAIL_TO": "owner@example.test",
        }
        with patch.dict(os.environ, environment, clear=True), patch.object(
            send_email, "send_smtp_message", side_effect=OSError("SMTP unavailable")
        ):
            with self.assertRaises(OSError):
                send_email.main()

    def test_workflow_entrypoint_runs_as_a_script_without_import_error(self):
        environment = os.environ.copy()
        environment["NEW_ITEMS_JSON"] = "[]"

        result = subprocess.run(
            [sys.executable, "scripts/send_email.py"],
            cwd=PROJECT_ROOT,
            env=environment,
            capture_output=True,
            text=True,
        )

        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn("跳过邮件", result.stdout)


if __name__ == "__main__":
    unittest.main()
