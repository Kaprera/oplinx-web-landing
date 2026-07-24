# OPLINX SOLUTIONS — website

Single-file static site. `index.html` is the whole thing: inline CSS and JS, no
build step, no external requests (system font stacks, inline SVG graphics), so
it works offline and deploys by copying one file.

Design language referenced from utility.sa.

## Running it

Open `index.html` in a browser. That's all.

## Features

- **Bilingual EN / AR** with a nav toggle. Copy lives in `data-en` / `data-ar`
  attributes on each element — edit both, or the toggle will show stale text.
  Choice persists in `localStorage`.
- **Full RTL support** via logical properties (`inset-inline-start`,
  `margin-inline`, `text-align:start`), so Arabic mirrors properly rather than
  relying on transforms.
- Sticky nav, mobile menu, scroll-reveal animations, all honouring
  `prefers-reduced-motion`.
- Validates clean: 0 errors on the W3C Nu HTML checker and the Jigsaw CSS
  validator.

## Design tokens

Brand colours and layout constants are CSS custom properties in `:root` at the
top of the `<style>` block — `--navy`, `--stone`, `--accent`, `--hero-indent`,
and the neutral ramp. Change them in one place.

## Content

All copy comes from the OPLINX portfolio deck (`portfolio.pdf`): about, mission,
vision, core values, the four service practices, industries served, founder's
insight, success stories, and the "why choose" points. Contact details, brand
navy (`#002349`), warm stone (`#E4DEDE`), and the logo mark are all taken from
the same deck — the logo is an inline base64 PNG extracted from page 2.

Nothing on the page is invented.

The contact form has no backend; it composes a `mailto:` draft. Swap for a real
endpoint when one exists.

## SEO

`index.html` carries a canonical URL, robots directives, Open Graph and Twitter
card tags, and a `ProfessionalService` JSON-LD block listing the four service
practices. Supporting files: `robots.txt`, `sitemap.xml`, `og-image.jpg`
(1200x849, the portfolio cover) and `logo.png`.

**All absolute URLs assume the site ships at `https://oplinx-solutions.com/`.**
Change them in `index.html` (canonical, `og:url`, `og:image`, `twitter:image`,
and the JSON-LD `url`/`logo`/`image`), plus `robots.txt` and `sitemap.xml`.

## Lighthouse

100 / 100 / 100 / 100 (performance, accessibility, best practices, SEO) on both
the mobile and desktop presets. Mobile LCP 1.0s, CLS 0, TBT 0ms.

Two weight-0 diagnostics — "document request latency" and "minify CSS" — are
artifacts of serving over `python -m http.server`, which sends no
`Content-Encoding`. **Serve with gzip or brotli enabled** and both clear; the
page compresses from 71KB to 18.5KB. Verified against a gzip-enabled server.
