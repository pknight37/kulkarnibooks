# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Kulkarni Books is a simple static website. There is no build step, framework, or package manager — just plain HTML, CSS, and JavaScript served directly from the repo root.

## Development

Open `index.html` directly in a browser, or use any static file server. For example:

```bash
# Python (no install needed)
python3 -m http.server 8080

# Node (if npx is available)
npx serve .
```

## Conventions

- All pages are plain `.html` files in the repo root or subdirectories.
- CSS lives in a `styles/` directory; JavaScript in a `scripts/` directory (create these as needed).
- No minification, bundling, or compilation is expected.
