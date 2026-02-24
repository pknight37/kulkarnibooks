---
name: add-news
description: Add a news article or media appearance to the In the News page
argument-hint: [URL, PDF path, or description]
---

# Add News Entry

Add a new entry to `scripts/news-data.js` in the `KULKARNI_NEWS` array.

## Gathering Information

If a **URL** is provided, fetch the page to extract the headline, outlet name, and publication date. If a **PDF** is provided, read it. If the fetch fails or content is unclear, ask the user for the missing details.

Every entry needs these four fields:

| Field | Required | Format | Example |
|-------|----------|--------|---------|
| `title` | Yes | Article headline as published | `"Small businesses face uncertainty as Trump warns of additional tariffs"` |
| `source` | Yes | Outlet name (short form) | `"9NEWS"`, `"The Denver Post"`, `"Colorado Public Radio"` |
| `date` | Yes | ISO 8601 (`YYYY-MM-DD`) | `"2026-02-23"` |
| `link` | Optional | Full URL to the article/video | `"https://www.9news.com/..."` or `""` if unavailable |

## Inserting the Entry

- The array is sorted **newest first** (date descending).
- Insert the new entry at the correct position to maintain date order.
- Use the exact JS object format matching the existing entries — no trailing commas after the last property in an object.

## After Adding

- Confirm the entry details with the user before committing.
- If the user asks to commit/push, follow normal commit conventions.
