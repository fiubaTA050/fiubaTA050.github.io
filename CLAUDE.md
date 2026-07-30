# CLAUDE.md

Jekyll site for **TA050 Sistemas Distribuidos I** (FIUBA course on distributed systems). Published via GitHub Pages from `main` → https://fiubata050.github.io.

## Running locally

```sh
bundle exec jekyll serve
```

Serves at `http://localhost:4000`.

## Content

- `calendario.markdown` — class calendar (inline HTML, one `<tr>` per class with notes/video/readings/papers/TPs).
- `programa.markdown` — course syllabus.
- `trabajos-practicos.markdown` — index of practical assignments (TPs).
- `tp1-mapreduce.markdown`, `tp2-raft.markdown`, `tp3-mini-dynamodb.markdown` — TP statements.
- `faq.markdown` — FAQ.
- `index.markdown` — home (announcements, course info, teaching staff).
- `_data/docentes.yml` — teaching staff. `_data/archivo.yml` — archived terms in the footer dropdown.
- `archive/<term>/` — prebuilt static snapshots of past terms. Self-contained, with
  their own CSS. Do not touch when changing the theme.

## Theme

There is no `theme:` gem — the theme is local, and modeled on
[CMU 15-445](https://15445.courses.cs.cmu.edu/fall2025/): dark frame, floating light
card, black `fixed-top` navbar, full-bleed hero.

- `_layouts/` — `default`, `home`, `page`.
- `_includes/` — `head`, `navbar`, `banner`, `footer`, `docentes-section`.
- `_sass/` — `_tokens`, `_base`, `_navbar`, `_banner`, `_content`, `_personnel`,
  `_calendario`, `_footer`.
- `assets/css/main.scss` — imports the partials, compiles to `/assets/css/main.css`.
- `_config.yml` → `course:` — code, term, links, and `banner_title` (hero title variant).

Constraints worth knowing before editing styles:

- **Bootstrap 5.2.3 comes compiled from a CDN**, so the SCSS has no access to its Sass
  variables or mixins. Breakpoints are written by hand: 576/768/992/1200/1400.
- **Sass is old**: the `github-pages` gem pins `jekyll-sass-converter 1.5.2`
  (Ruby Sass 3.7.4). `@import` only, no `@use`, no modules.
- **Design tokens are CSS custom properties, not Sass variables**, so they stay
  tweakable in the browser inspector. Fonts are `--header-font` / `--text-font` /
  `--mono-font` in `_sass/_tokens.scss` (changing one also means editing the Google
  Fonts `<link>` in `_includes/head.html`).
- **Two accents, not interchangeable**: `--main-color` (`#046b7d`) for text on the light
  card; `--glow-color` (`#25f6fe`) only over dark — it drops to 1.2:1 on the card.
- Editing `_config.yml` requires restarting `jekyll serve`; SCSS and content hot-reload.

## Common tasks

1. **Update the calendar** (most frequent) — add notes/video links per class, shift dates, add readings/papers. A dedicated skill exists for this.
2. **Update TP statements** — edit `tp*.markdown`.
3. **Change the look** — edit `_sass/`, never inline styles in the content markdown.
4. **Archive a finished semester** — freeze the site as a static snapshot under `/archive/<cuatri>/`. A dedicated skill exists for this; the procedure has several non-obvious pitfalls, so follow it rather than improvising.

## Design samples and screenshot tooling

Lives in a sibling directory, **not in git** (~23MB of PNGs; this is a Pages repo):

```sh
open ../ta050-design/index.html        # annotated index of all samples
cat  ../ta050-design/README.md         # how to regenerate them
```

`../ta050-design/tools/` holds a dependency-free CDP toolkit: `capture.mjs` regenerates
every screenshot, and `overflow.mjs` sweeps all pages for horizontal overflow and exits
non-zero if it finds any — worth running before pushing layout changes.

## Conventions

- **Site language**: all user-facing content is written in **Spanish**, formal and academic.
- **Commits**: imperative English, no `feat:`-style prefixes. Examples: `Add video link for Clase 8`, `Shift Clases 10-15 one slot forward`.

## Deploy

GitHub Pages serves directly from `main`. No extra build step — pushing deploys.
