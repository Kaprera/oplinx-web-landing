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
top of the `<style>` block — `--primary` (navy), `--secondary` (orange),
`--hero-indent`, and the neutral ramp. Change them in one place.

## ⚠ Placeholder content

Real: phone, location, email, Instagram link.

Still placeholder, tagged inline with `<!-- PH -->` comments:

- Hero headline and subcopy
- Vision / Mission / Approach
- All six service card titles and descriptions
- **The four statistics** (10+ years, 150+ projects, 40+ clients) are invented
  numbers sitting next to real contact details. Replace or remove them before
  this goes public.
- LinkedIn link (`#`)
- Commercial registration line in the footer
- Brand colours are the reference site's, not OPLINX's

The contact form has no backend; it composes a `mailto:` draft. Swap for a real
endpoint when one exists.
