#!/usr/bin/env python3
"""
One-time script to enrich publications-data.js with DOI links from CrossRef.

Parses the JS file, queries CrossRef for each publication, validates matches
via fuzzy title comparison, and writes back the file with link fields added.

Usage:
    python3 scripts/fetch-publication-links.py
"""

import json
import os
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from difflib import SequenceMatcher

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------
CROSSREF_API = "https://api.crossref.org/works"
MAILTO = "kulkarnibooks@example.com"  # polite pool identifier
MATCH_THRESHOLD = 0.85  # minimum fuzzy-match ratio to accept
REQUEST_DELAY = 1.0  # seconds between API calls
MAX_RETRIES = 2

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.join(SCRIPT_DIR, "publications-data.js")

# ---------------------------------------------------------------------------
# Parsing
# ---------------------------------------------------------------------------

def parse_publications(js_text):
    """Extract publication objects from the JS source text."""
    pubs = []
    # Match each object block: { title: "...", year: ..., coAuthors: "..." }
    pattern = re.compile(
        r'\{\s*'
        r'title:\s*"((?:[^"\\]|\\.)*)"\s*,\s*'
        r'year:\s*(\d+)\s*,\s*'
        r'coAuthors:\s*"((?:[^"\\]|\\.)*)"\s*'
        r'\}',
        re.DOTALL,
    )
    for m in pattern.finditer(js_text):
        pubs.append({
            "title": m.group(1).replace('\\"', '"').replace("\\'", "'"),
            "year": int(m.group(2)),
            "coAuthors": m.group(3).replace('\\"', '"').replace("\\'", "'"),
            "link": "",
        })
    return pubs


# ---------------------------------------------------------------------------
# CrossRef lookup
# ---------------------------------------------------------------------------

def normalize_title(title):
    """Lowercase and strip non-alphanumeric chars for comparison."""
    return re.sub(r"[^a-z0-9 ]", "", title.lower()).strip()


def titles_match(a, b, threshold=MATCH_THRESHOLD):
    """Check whether two titles are a fuzzy match."""
    na = normalize_title(a)
    nb = normalize_title(b)
    ratio = SequenceMatcher(None, na, nb).ratio()
    return ratio >= threshold, ratio


def query_crossref(title, year):
    """Query CrossRef for a publication and return the best DOI URL or None."""
    # Build query: title + "Kulkarni" (always an author)
    query_text = title + " Kulkarni"
    params = {
        "query.bibliographic": query_text,
        "rows": "3",
        "mailto": MAILTO,
    }
    url = CROSSREF_API + "?" + urllib.parse.urlencode(params)

    req = urllib.request.Request(url)
    req.add_header("User-Agent", f"KulkarniBooks/1.0 (mailto:{MAILTO})")

    for attempt in range(MAX_RETRIES + 1):
        try:
            with urllib.request.urlopen(req, timeout=15) as resp:
                data = json.loads(resp.read().decode("utf-8"))
            break
        except (urllib.error.URLError, urllib.error.HTTPError, OSError) as e:
            if attempt < MAX_RETRIES:
                time.sleep(2 ** attempt)
                continue
            print(f"  [ERROR] Network error: {e}")
            return None

    items = data.get("message", {}).get("items", [])
    if not items:
        return None

    for item in items:
        # CrossRef titles are returned as a list
        cr_titles = item.get("title", [])
        if not cr_titles:
            continue
        cr_title = cr_titles[0]

        matched, ratio = titles_match(title, cr_title)
        if matched:
            doi = item.get("DOI", "")
            if doi:
                return f"https://doi.org/{doi}"

    return None


# ---------------------------------------------------------------------------
# Write back
# ---------------------------------------------------------------------------

def rebuild_js(pubs):
    """Reconstruct the publications-data.js content from the pub list."""
    lines = [
        "/* eslint-disable no-unused-vars */",
        "/*",
        " * Publication catalog for Dr. Kulkarni's journal articles.",
        " * Edit this array to add, remove, or update publications.",
        " * Each entry needs: title, year. Optional: journal, coAuthors, link.",
        " * Sorted by year descending (newest first).",
        " */",
        "var KULKARNI_PUBLICATIONS = [",
    ]

    for i, pub in enumerate(pubs):
        # Escape double quotes in strings
        title_escaped = pub["title"].replace('"', '\\"')
        co_escaped = pub["coAuthors"].replace('"', '\\"')
        link = pub.get("link", "")

        lines.append("  {")
        lines.append(f'    title: "{title_escaped}",')
        lines.append(f'    year: {pub["year"]},')
        lines.append(f'    coAuthors: "{co_escaped}"' + ("," if link else ""))
        if link:
            lines.append(f'    link: "{link}"')
        trailing = "," if i < len(pubs) - 1 else ""
        lines.append("  }" + trailing)

    lines.append("];")
    lines.append("")  # trailing newline
    return "\n".join(lines)


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    if not os.path.isfile(DATA_FILE):
        print(f"Error: {DATA_FILE} not found.")
        sys.exit(1)

    with open(DATA_FILE, "r", encoding="utf-8") as f:
        js_text = f.read()

    pubs = parse_publications(js_text)
    total = len(pubs)
    print(f"Parsed {total} publications from {DATA_FILE}\n")

    if total == 0:
        print("No publications found. Check the parser.")
        sys.exit(1)

    matched = 0
    skipped = 0
    unmatched_titles = []

    for i, pub in enumerate(pubs):
        label = f"[{i + 1}/{total}]"
        title_short = pub["title"][:70] + ("..." if len(pub["title"]) > 70 else "")

        # Skip entries with year=0 (undated) — unlikely to match well
        if pub["year"] == 0:
            print(f"{label} SKIP (no year): {title_short}")
            skipped += 1
            continue

        print(f"{label} Querying: {title_short}")
        link = query_crossref(pub["title"], pub["year"])

        if link:
            pub["link"] = link
            matched += 1
            print(f"       -> {link}")
        else:
            unmatched_titles.append(pub["title"])
            print(f"       -> No match")

        # Polite rate limiting
        if i < total - 1:
            time.sleep(REQUEST_DELAY)

    # Write enriched data back
    new_js = rebuild_js(pubs)
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        f.write(new_js)

    # Summary
    print("\n" + "=" * 60)
    print(f"DONE — {matched} matched, {len(unmatched_titles)} unmatched, {skipped} skipped (no year)")
    print(f"Updated: {DATA_FILE}")

    if unmatched_titles:
        print(f"\nUnmatched titles ({len(unmatched_titles)}):")
        for t in unmatched_titles:
            print(f"  - {t}")


if __name__ == "__main__":
    main()
