# AGENTS.md

Guide for AI coding agents (and humans) working on this repository.

## What this is

Victor Pacheco's personal portfolio: a **static, dependency-free site** (HTML + CSS + vanilla JS)
deployed with **GitHub Pages** from `main` at <https://vichuge.github.io/personal_porfolio/>.

There is no build step, no package manager and no framework. Keep it that way unless the owner
explicitly asks otherwise.

## Design intent (do not break this)

The whole site must look like **a Safari window on a macOS desktop**, and it should feel premium and
Apple-grade. Every change has to keep that illusion:

| Piece | Where | Notes |
|---|---|---|
| Desktop wallpaper | `--wallpaper` token, `body` | Soft radial gradients; separate light/dark versions |
| Menu bar | `.menubar` | Translucent (vibrancy), 28 px, live clock, appearance toggle |
| Safari window | `.safari` | Rounded 12 px, big soft shadow; sticky toolbar with traffic lights, address field and reading-progress bar |
| Terminal window | `.terminal` | The portfolio's original idea: a Node REPL showing `Victor.*` objects, typed out on load |
| Launchpad tiles | `.apps` | Tech stack as app icons (squircle, 22.5% radius) |
| About This Mac | `.about` | Spec sheet with a `<dl>` |
| Dock | `.dock` | Fixed bottom, magnification on hover, tooltips |
| Notifications | `.toast` | macOS-style banner, top right |

Rules of the visual language:

- **Typography:** system SF Pro stack (`--font-sans`), Inter as the non-Apple fallback; mono is
  `--font-mono`. Tight negative letter-spacing on large headings, sentence case.
- **Colour:** use the tokens in `css/styles.css` §1 only. Accent = Apple system blue. No new
  hard-coded colours in components — add a token (in light **and both** dark blocks).
- **Materials:** translucency via `backdrop-filter: saturate(180%) blur(…)`; hairlines are 0.5 px.
- **Motion:** subtle, eased (`--ease`, `--ease-spring`). Everything must respect
  `prefers-reduced-motion` (already handled globally) and `prefers-reduced-transparency`.
- **Restraint:** no emoji, no neon, no heavy gradients on content, no stock icon fonts. Whitespace
  is the luxury.
- Do **not** use Apple's logo or trademarked artwork; the Dock "Portfolio" compass is an original SVG.

## Files

```
index.html          All markup; SVG icon sprite at the top of <body>
css/styles.css      Single stylesheet, numbered sections (tokens → base → components → responsive)
js/main.js          All behaviour, one IIFE, progressive enhancement only
favicon.svg         Traffic-lights + "VP" monogram
images/avatar-*     Portrait (320/640 WebP + 640 JPEG fallback); 640 JPEG is also the og:image
images/projects/    Project screenshots, WebP, 402×360 source size
```

## Conventions

- **HTML:** semantic landmarks (`header`, `main`, `section[aria-labelledby]`, `nav`), one `h1`.
  Every `target="_blank"` link gets `rel="noopener noreferrer"`. Decorative toolbar glyphs are
  `aria-hidden` `<span>`s — never fake focusable buttons. Images always have `width`, `height`,
  `alt`, and `loading="lazy"` below the fold.
- **No inline `style=""` or inline event handlers.** A Content-Security-Policy `<meta>` forbids them.
  The only inline script is the theme bootstrap in `<head>`, allowed by its **sha256 hash in the
  CSP**. If you edit that script you must recompute the hash:
  ```sh
  printf '%s' "<script body>" | openssl dgst -sha256 -binary | openssl base64
  ```
- **CSS:** BEM-ish class names (`.block__element--modifier`), tokens via custom properties,
  mobile breakpoints at 1080 / 960 / 720 px. Dark tokens are duplicated on purpose (system
  preference + manual `data-theme="dark"` override) — keep both blocks in sync.
- **JS:** vanilla ES2020+, no globals, hook elements with `data-*` attributes (`data-action`,
  `data-filter`, …) rather than styling classes. The page must remain fully readable with JS off.
  Wrap `localStorage` in try/catch (see `storage` helper).
- **Third-party:** only Google Fonts and Devicon (pinned `devicon@2.16.0` with SRI). If you bump
  Devicon, update the `integrity` hash and verify class names exist in the new CSS.

## Common tasks

### Add a project

1. Save a screenshot to `images/projects/<slug>.webp` (≈402×360 or larger at the same ratio;
   the card crops to 16:10 from the top).
2. Copy an existing `<li class="card reveal">` in `#work`, set `data-category` to
   `frontend`, `backend` or `other` (drives the segmented filter), update kicker, title, text,
   chips and links.
3. If the live demo is gone, replace the demo link with `<span class="card__offline">Demo offline</span>`.

### Add a skill tile

Add an `<li class="app">` in `#stack` with a Devicon class (`devicon-<name>-<variant> colored`).
Check the class exists: `curl -s https://cdn.jsdelivr.net/npm/devicon@2.16.0/devicon.min.css | grep devicon-<name>`.

### Change contact details

Email and social URLs appear in several places: terminal, contact section, Dock, JSON-LD and
`twitter:site`. Search for the old value and replace all of them.

## Checking your work

There are no automated tests. Before finishing:

1. Serve locally: `python3 -m http.server 8000` and open <http://localhost:8000>.
2. Check desktop (≥1280 px), tablet (~900 px) and phone (390 px) widths: no horizontal scroll,
   Dock doesn't cover content at the end of the page.
3. Toggle light/dark with the menu-bar button and with the OS setting.
4. Open DevTools → Console: no CSP violations or errors.
5. Try keyboard-only navigation (skip link, focus rings, filter buttons, window controls).
6. Validate links still resolve (`curl -sI <url>`), especially project demos.

## Content

Copy is in **English**. Keep project descriptions factual — don't invent features. The owner's
Heroku demos (Investment Groups, Alpha Blog, Track Water API) went offline when Heroku retired its
free tier; they are labelled "Demo offline" until redeployed.
