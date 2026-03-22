# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Build minified distribution file
npm run build

# No automated tests — test manually by opening index.html in a browser
```

## Architecture

This is a zero-dependency vanilla JavaScript Web Component library published to npm and webcomponents.org.

**Source:** `wc-pie-chart.js` — defines two custom elements:
- `<wc-pie-chart>` — the container component. Reads `width`, `duration`, `delay`, `thickness` attributes, calculates segment proportions, and instantiates `<wc-pie-slice>` children inside its shadow DOM.
- `<wc-pie-slice>` — renders a single animated slice using CSS conic gradients and a mask for the donut effect. Accepts `width`, `duration`, `delay`, `color`, `thickness`, and `rotate` attributes (all set programmatically by the parent).

**Build:** `rollup.config.js` bundles `wc-pie-chart.js` → `dist/wc-pie-chart.min.js` (IIFE, inline sourcemap, terser-minified).

**Demo:** `index.html` loads `dist/wc-pie-chart.min.js` and shows four usage examples. `main.js` generates random charts and tests dynamic attribute changes at runtime.

## Key Behaviours

- `thickness` attribute: `0` to `1`, where `0.5` produces a half-donut and `0` produces a full pie. Default `0.2`.
- Slices auto-generate a random hex color if none is supplied.
- All rendering is driven by `attributeChangedCallback` — mutating observed attributes triggers a re-render.
- The CSS custom property `--p` is registered on the parent's shadow root with `@property` to allow animated transitions of conic gradients.
