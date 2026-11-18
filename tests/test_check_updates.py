import json
import io
import os
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from scripts import check_updates


class CheckUpdatesTests(unittest.TestCase):
    def test_fetch_rss_retries_a_transient_timeout(self):
        with patch.object(
            check_updates.urllib.request,
            "urlopen",
            side_effect=[TimeoutError("temporary timeout"), io.BytesIO(b"<rss />")],
        ) as urlopen, patch("time.sleep") as sleep:
            payload = check_updates.fetch_rss("https://example.test/rss")

        self.assertEqual(payload, b"<rss />")
        self.assertEqual(urlopen.call_count, 2)
        sleep.assert_called_once_with(2)

    def test_fetch_from_sources_uses_fallback_after_primary_failure(self):
        sources = (
            ("primary", "https://primary.example.test/rss"),
            ("fallback", "https://fallback.example.test/rss"),
        )
        with patch.object(
            check_updates,
            "fetch_rss",
            side_effect=[TimeoutError("primary unavailable"), b"<rss />"],
        ) as fetch_rss:
            payload, source = check_updates.fetch_from_sources(sources)

        self.assertEqual(payload, b"<rss />")
        self.assertEqual(source, "https://fallback.example.test/rss")
        self.assertEqual(
            fetch_rss.call_args_list[0].args,
            ("https://primary.example.test/rss",),
        )
        self.assertEqual(
            fetch_rss.call_args_list[1].args,
            ("https://fallback.example.test/rss",),
        )

    def test_merge_items_deduplicates_links_and_sorts_new_items_first(self):
        self.assertTrue(callable(getattr(check_updates, "merge_items", None)))

        existing = [
            {"title": "Older", "link": "https://example.test/older", "date": "2026-01-01"},
            {"title": "Existing", "link": "https://example.test/existing", "date": "2026-01-03"},
        ]
        incoming = [
            {"title": "New", "link": "https://example.test/new", "date": "2026-01-05"},
            {"title": "Duplicate", "link": "https://example.test/existing", "date": "2026-01-06"},
        ]

        merged = check_updates.merge_items(existing, incoming)

        self.assertEqual(
            [item["link"] for item in merged],
            ["https://example.test/new", "https://example.test/existing", "https://example.test/older"],
        )

    def test_is_penalty_item_distinguishes_fines_from_general_dma_news(self):
        self.assertTrue(callable(getattr(check_updates, "is_penalty_item", None)))

        self.assertTrue(
            check_updates.is_penalty_item(
                {"title": "Commission fines Google €890 million", "summary": "DMA decision"}
            )
        )
        self.assertFalse(
            check_updates.is_penalty_item(
                {"title": "Commission provides guidance to Google", "summary": "DMA specification"}
            )
        )

    def test_is_penalty_item_recognizes_french_penalty_terms_from_fallback_feed(self):
        self.assertTrue(
            check_updates.is_penalty_item(
                {"title": "La Commission inflige une amende", "summary": "Marchés numériques"}
            )
        )

    def test_parse_items_accepts_french_dma_terms_from_fallback_feed(self):
        xml = """
        <rss><channel><item>
          <title>La Commission publie des orientations sur les marchés numériques</title>
          <link>https://example.test/french-dma</link>
          <description>Information sur les services de plateforme essentiels.</description>
          <pubDate>Wed, 18 Nov 2026 08:00:00 GMT</pubDate>
        </item></channel></rss>
        """.encode()

        items = check_updates.parse_items(xml)

        self.assertEqual([item["link"] for item in items], ["https://example.test/french-dma"])

    def test_write_github_outputs_reports_change_and_penalty_count(self):
        self.assertTrue(callable(getattr(check_updates, "write_github_outputs", None)))

        items = [
            {"title": "Commission fines Google", "link": "https://example.test/fine", "date": "2026-01-05"},
            {"title": "Commission provides guidance", "link": "https://example.test/guidance", "date": "2026-01-04"},
        ]
        with tempfile.TemporaryDirectory() as temp_dir:
            output_path = Path(temp_dir) / "github-output"
            with patch.dict(os.environ, {"GITHUB_OUTPUT": str(output_path)}):
                check_updates.write_github_outputs(items)

            output = output_path.read_text(encoding="utf-8")

        self.assertIn("changed=true", output)
        self.assertIn("new_count=2", output)
        self.assertIn("penalty_count=1", output)
        self.assertIn('"title": "Commission fines Google"', output)

    def test_write_github_outputs_reports_source_and_last_successful_fetch(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            output_path = Path(temp_dir) / "github-output"
            with patch.dict(os.environ, {"GITHUB_OUTPUT": str(output_path)}):
                check_updates.write_github_outputs(
                    [],
                    source_used="https://fallback.example.test/rss",
                    last_successful_fetch="2026-11-18T06:17:00+00:00",
                )

            output = output_path.read_text(encoding="utf-8")

        self.assertIn("source_used=https://fallback.example.test/rss", output)
        self.assertIn("last_successful_fetch=2026-11-18T06:17:00+00:00", output)

    def test_main_does_not_rewrite_output_when_no_new_items(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            output_path = Path(temp_dir) / "updates.json"
            existing_payload = {
                "updated_at": "2026-01-01T00:00:00+00:00",
                "source": "https://example.test/rss",
                "items": [
                    {"title": "Known", "link": "https://example.test/known", "date": "2026-01-01"}
                ],
            }
            output_path.write_text(json.dumps(existing_payload) + "\n", encoding="utf-8")
            original = output_path.read_text(encoding="utf-8")

            with patch.object(check_updates, "OUTPUT", output_path), patch.object(
                check_updates, "fetch_rss", return_value=b"<rss><channel /></rss>"
            ), tempfile.TemporaryDirectory() as output_dir, patch.dict(
                os.environ, {"GITHUB_OUTPUT": str(Path(output_dir) / "github-output")}
            ):
                check_updates.main()
                monitor_output = (Path(output_dir) / "github-output").read_text(encoding="utf-8")

            self.assertEqual(output_path.read_text(encoding="utf-8"), original)
            self.assertIn("changed=false", monitor_output)
            self.assertIn("source_used=https://ec.europa.eu/commission/presscorner/api/rss?language=en", monitor_output)
            self.assertIn("last_successful_fetch=", monitor_output)


if __name__ == "__main__":
    unittest.main()
