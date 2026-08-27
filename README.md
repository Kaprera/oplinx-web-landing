# OPLINX SOLUTIONS — website

Static site, no build step. `index.html` carries all the CSS and JS inline and
pulls in exactly one sub-resource (`logo.png`); everything else is system font
stacks and inline SVG, so there are no third-party requests at all.

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
the same deck — the logo mark (`logo.png`) was extracted from page 2.

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

## Security headers

`netlify.toml` sets HSTS, CSP, `X-Content-Type-Options`, `X-Frame-Options`,
`Referrer-Policy`, `Permissions-Policy`, COOP and CORP. (No COEP — it buys
nothing without SharedArrayBuffer, and CSP already blocks every cross-origin
load.) The CSP carries **no
`'unsafe-inline'`**: the one inline `<style>` and the three inline `<script>`
blocks are each pinned by SHA-256 hash instead, so an injected inline script
would not match a hash and would not run.

That means the policy has to be kept in step with the markup by hand. **After
editing anything inside an inline `<style>` or `<script>`, run:**

```sh
node tools/csp-hashes.mjs
```

Skip it and the browser blocks whichever block changed — the page renders
unstyled and inert. `node tools/csp-hashes.mjs --check` fails without writing,
which is the form to put in CI or a pre-commit hook. The same script refuses to
run if a `style="…"` attribute has crept into the markup, since hashes cannot
cover those.

## Lighthouse

100 / 100 / 100 / 100 (performance, accessibility, best practices, SEO) on both
the mobile and desktop presets. Mobile FCP 0.9s, LCP 1.0s, TBT 0ms, CLS 0,
Speed Index 2.1s. HTML validates with 0 errors on the W3C Nu checker; the CSS
validates with 0 errors on Jigsaw.

Measure against a server that sends `Content-Encoding` — `python -m
http.server` does not, which shows up as phantom "document request latency" and
"minify CSS" diagnostics. Netlify serves brotli automatically; the page goes
out at ~15.7KB brotli / ~19.4KB gzip.

## Deploying

Netlify publishes the repo root (`publish = "."`), and a git-linked deploy ships
only what is committed — `portfolio.pdf` and `.DS_Store` are in `.gitignore` and
stay out. A **manual `netlify deploy` from this directory does not read
`.gitignore`** and would upload the 182MB source deck to a public URL. Deploy
from git, or move `portfolio.pdf` outside the folder first.
