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

## UI/UX Design Principles

All UI work in this repo follows these principles. Optimize for intuitive use over clever design.

### Core Philosophy

- Clarity over cleverness, speed over ornamentation, consistency over novelty, usability over density.
- Primary objective: help users accomplish their goal with minimal cognitive load.

### Visual Hierarchy & Layout

- One clear primary action per screen/view; secondary actions visually de-emphasized.
- Use size, color, and spacing to indicate importance. Group related items.
- 8px base spacing system. Spacing scale: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64.
- Line length ~60–80 characters for readability.
- Use whitespace generously; chunk information.

### Typography

- Limit to 1–2 font families. Avoid excessive font weights.
- Clear heading hierarchy: H1 (page title) → H2 (section) → H3 (subsection) → body → caption.

### Color

- 1 primary color, 1–2 accent colors, neutral grayscale for most UI.
- Semantic colors: green = success, yellow = warning, red = error, blue = primary action.
- Meet WCAG AA contrast minimums.

### Components & Interactions

- Navigation: persistent location awareness, clear current state.
- Buttons: 1 primary per view, destructive actions require confirmation.
- Forms: labels always visible (not just placeholders), inline validation, sensible defaults.
- Modals: use sparingly, must be dismissible, never block critical workflows.

### States & Feedback

- Every action produces visible feedback.
- Design for all states: loading, empty, success, error.
- Empty states should explain what to do next and include a primary action.

### Accessibility

- Sufficient color contrast (WCAG AA).
- Keyboard navigable.
- Clear labels on all inputs.
- Touch targets ≥ 44px.

### Cognitive UX Laws

- **Hick's Law**: reduce choices presented at once.
- **Fitts's Law**: make primary actions large and easy to click/tap.
- **Jakob's Law**: follow common UI patterns users already know.
- **Von Restorff Effect**: important elements should visually stand out.

### Design Quality Checklist

Before finalizing any UI, verify:
- Is the primary user goal obvious?
- Is the primary action obvious?
- Is anything unnecessary on the screen?
- Can a first-time user succeed without instructions?
- Are errors prevented where possible?
- Is the interface accessible?

## Performance (PageSpeed Insights)

All pages should be designed and built with Google PageSpeed Insights scores in mind. Aim for high scores across all four categories: Performance, Accessibility, Best Practices, and SEO.

### Design & Development Guidelines

- Minimize render-blocking resources (inline critical CSS, defer non-critical JS).
- Optimize images: use appropriate formats, compress, and include explicit `width`/`height` attributes to prevent layout shift.
- Keep the DOM simple and shallow.
- Avoid large layout shifts (CLS) — reserve space for dynamic content, images, and fonts.
- Prioritize Largest Contentful Paint (LCP) — ensure the main content loads fast.
- Minimize First Input Delay (FID) / Interaction to Next Paint (INP) — keep JavaScript execution lean.

### Image Best Practices

- Use WebP format for photographs. Convert with `cwebp -q 80 input.png -o output.webp`.
- Size images at 2x their CSS display dimensions for retina screens (e.g., 360x360 for a 180px element).
- Always include `width` and `height` attributes on `<img>` tags to prevent layout shift.
- Add `fetchpriority="high"` to the LCP image (typically the hero/above-the-fold image).
- Keep image file sizes under 50 KiB where possible.

### Accessibility Checklist

- All text must meet WCAG AA contrast minimums (4.5:1 for normal text, 3:1 for large text).
- Verify contrast when using accent colors on dark backgrounds — prefer `--color-accent-bright` over `--color-accent-light` on `--color-primary` backgrounds.
- All images must have descriptive `alt` text.

### Hosting Limitations (GitHub Pages)

- HTTP security headers (CSP, HSTS, COOP, X-Frame-Options, Trusted Types) cannot be configured on GitHub Pages. These will appear as unscored warnings in PageSpeed — they are expected and not actionable.

### PageSpeed Insights API (v5)

Once the site is live, test any page with the PageSpeed Insights API.

- **Endpoint**: `https://www.googleapis.com/pagespeedonline/v5/runPagespeed`
- **Required parameter**: `url` — the page to analyze.
- **Useful optional parameters**:
  - `category` — one or more of: `performance`, `accessibility`, `best-practices`, `seo` (can repeat the parameter for multiple categories).
  - `strategy` — `mobile` (default) or `desktop`.
- **API key**: recommended for frequent/automated use; obtain from Google Cloud Console.

Example curl:

```bash
curl "https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=https://YOUR-DOMAIN.com&category=performance&category=accessibility&strategy=mobile"
```

Reference: https://developers.google.com/speed/docs/insights/v5/get-started

## Security

This site follows a security checklist adapted from the [Cloudflare Website Security Guide](https://www.cloudflare.com/learning/security/glossary/website-security-checklist/). Because this is a static site on GitHub Pages with no backend, many enterprise concerns (authentication, DDoS mitigation, WAF) are handled at the hosting/infrastructure level. The guidelines below cover what is controllable in the codebase.

### No Exposed APIs or Secrets

- **Never commit API keys, tokens, passwords, or credentials** to this repo.
- The site makes **zero client-side API calls** — no `fetch()`, `XMLHttpRequest`, or AJAX. All data is hardcoded in JS data files (`*-data.js`). Keep it this way.
- Utility scripts (e.g., `scripts/fetch-publication-links.py`) that call external APIs are offline one-time tools, never served to users. They must not contain real credentials — use environment variables or placeholder identifiers.

### No Third-Party Scripts or Cookies

- The site loads **no external JavaScript** — no CDNs, analytics, tracking, or third-party dependencies. This eliminates an entire class of supply-chain and client-side attacks (Magecart, XSS via compromised CDNs, etc.).
- The site sets **no cookies**. If cookies are ever introduced, they must use `Secure`, `HttpOnly`, and `SameSite` attributes.
- Before adding any third-party script or service, evaluate the security implications. Prefer self-hosted alternatives over CDN-loaded scripts.

### XSS Prevention

- All dynamic HTML rendering uses `escapeHtml()` before inserting data via `innerHTML`. This function escapes `&`, `<`, `>`, and `"`.
- **Never** use `eval()`, `document.write()`, or `new Function()` with dynamic input.
- **Never** insert user-controlled or external data into `innerHTML` without escaping.
- Keep all rendering logic in the `*-renderer.js` IIFE modules where escaping is centralized and tested.

### Form Security

- The report-issue form uses Formspree (POST endpoint), which handles CSRF protection server-side.
- Client-side validation in `scripts/form-validation.js` supplements (but does not replace) server-side validation.
- Never add forms that submit sensitive data without HTTPS (GitHub Pages enforces this automatically).

### HTTPS / TLS

- GitHub Pages provides automatic HTTPS with managed SSL/TLS certificates. All traffic is encrypted in transit.
- All external links in data files should use `https://` URLs, never `http://`.

### Hosting Limitations (GitHub Pages)

The following security measures are handled at the infrastructure level and cannot be configured in the codebase. They may appear as warnings in security audits — this is expected and not actionable:

- HTTP security headers (CSP, HSTS, COOP, X-Frame-Options, Trusted Types)
- DDoS protection and rate limiting (GitHub provides baseline protection)
- Bot management and traffic filtering
- DNS security (DNSSEC) — depends on domain registrar
- Origin IP hiding — GitHub Pages abstracts this

### Security Checklist for Code Changes

Before merging any change, verify:
- No API keys, tokens, or credentials added to any file.
- No new third-party scripts introduced without justification.
- All dynamic HTML content is escaped via `escapeHtml()`.
- No `eval()`, `document.write()`, or `new Function()` usage.
- All external URLs use `https://`.
- `.gitignore` excludes sensitive files (`.env`, credentials, editor configs).
