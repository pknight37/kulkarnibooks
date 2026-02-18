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

## Test-Driven Development (Canon TDD)

All code in this repo follows Kent Beck's Canon TDD workflow. Source: https://tidyfirst.substack.com/p/canon-tdd

### The Five Steps

1. **Write a test list** — Before touching code, list all expected behavioral variants for the change: cases where the new behavior should work, plus potential impacts on existing behavior.
2. **Write one test** — Convert exactly one item from the list into a concrete, automated test (setup, invocation, assertions). Make interface design decisions here; minimize implementation decisions.
3. **Make it pass** — Change the code so the new test and all previous tests pass. Fix the code genuinely — do not delete assertions or hard-code expected values.
4. **Refactor (optional)** — Now make implementation design decisions. Never mix refactoring with making a test pass; keep these phases separate.
5. **Repeat** — Return to step 2 until the test list is empty.

### Key Rules

- Write tests one at a time; do not speculatively write all tests upfront. Order matters and shapes the final design.
- Never refactor while a test is failing.
- Duplication in code is a hint, not an automatic trigger — don't abstract prematurely.
