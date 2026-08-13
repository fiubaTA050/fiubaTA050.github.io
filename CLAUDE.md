# CLAUDE.md

Jekyll site for **TA050 Sistemas Distribuidos I** (FIUBA course on distributed systems). Published via GitHub Pages from `main` → https://fiubata050.github.io.

## Running locally

```sh
bundle exec jekyll serve
```

Serves at `http://localhost:4000`.

## Layout

- `calendario.markdown` — class calendar (inline HTML, one `<tr>` per class with notes/video/readings/papers/TPs).
- `programa.markdown` — course syllabus.
- `trabajos-practicos.markdown` — index of practical assignments (TPs).
- `tp1-mapreduce.markdown`, `tp2-raft.markdown`, `tp3-mini-dynamodb.markdown` — TP statements.
- `faq.markdown` — FAQ.
- `_data/docentes.yml` — teaching staff data.
- `_includes/` — `head.html`, `footer.html`.
- `assets/` — CSS, images.
- `_config.yml` — Jekyll config (title, nav, plugins).

## Common tasks

1. **Update the calendar** (most frequent) — add notes/video links per class, shift dates, add readings/papers. A dedicated skill exists for this.
2. **Update TP statements** — edit `tp*.markdown`.
3. **Archive a finished semester** — freeze the site as a static snapshot under `/archive/<cuatri>/`. A dedicated skill exists for this; the procedure has several non-obvious pitfalls, so follow it rather than improvising.

## Conventions

- **Site language**: all user-facing content is written in **Spanish**, formal and academic.
- **Commits**: imperative English, no `feat:`-style prefixes. Examples: `Add video link for Clase 8`, `Shift Clases 10-15 one slot forward`.

## Deploy

GitHub Pages serves directly from `main`. No extra build step — pushing deploys.
