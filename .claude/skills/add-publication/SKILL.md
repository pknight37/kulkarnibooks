---
name: add-publication
description: Add a journal article or academic publication to the Publications page
argument-hint: [DOI, title, or URL]
---

# Add Publication

Add a new entry to `scripts/publications-data.js` in the `KULKARNI_PUBLICATIONS` array.

## Gathering Information

If a **DOI** is provided (e.g., `10.1234/example`), look up metadata via the CrossRef API:

```
https://api.crossref.org/works/DOI_HERE
```

If a **URL** is provided, fetch the page to extract publication details. If a **title** is provided, search CrossRef:

```
https://api.crossref.org/works?query.bibliographic=TITLE+Kulkarni&rows=3
```

Ask the user for any details that can't be determined automatically.

Every entry needs these fields:

| Field | Required | Format | Example |
|-------|----------|--------|---------|
| `title` | Yes | Article title, sentence case | `"Testing the Gravity Model for Kazakhstan's Exports"` |
| `year` | Yes | Integer | `2024` |
| `coAuthors` | Yes | Comma-separated names (empty string if sole author) | `"Amitabh S. Dutta, Kun Peng Lai"` or `""` |
| `link` | Optional | DOI URL preferred (`https://doi.org/...`) | `"https://doi.org/10.2139/ssrn.4856481"` or omit field entirely |

## Formatting Rules

- **Title**: Use the title as published. Do not alter capitalization unless it is clearly wrong (e.g., ALL CAPS).
- **Co-authors**: List co-authors only (Dr. Kulkarni is always implied). Use the format `"Firstname Lastname"` or `"F. Lastname"` matching how the name appears in the publication.
- **Link**: If a DOI exists, always use the `https://doi.org/` form. If no DOI, use a direct URL or omit the `link` field.
- **Year**: Use the publication year, not the submission or preprint year.

## Inserting the Entry

- The array is sorted **by year descending** (newest first).
- Within the same year, insert at the end of that year's block.
- Match the exact JS object format of existing entries:
  - Entries WITH a link: `title`, `year`, `coAuthors`, `link`
  - Entries WITHOUT a link: `title`, `year`, `coAuthors` (no link field)

## After Adding

- Confirm the entry details with the user before committing.
- If the user asks to commit/push, follow normal commit conventions.
