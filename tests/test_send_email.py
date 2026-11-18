import os
import unittest
from unittest.mock import patch

from scripts import send_email


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


if __name__ == "__main__":
    unittest.main()
