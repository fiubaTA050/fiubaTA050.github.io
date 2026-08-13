---
name: archive-semester
description: Use when the user asks to archive a finished semester (cuatrimestre) — freezing the current site as a static snapshot under `/archive/<cuatri>/` so the live site can be reset for the next term. Triggers on phrases like "archivar 2026a", "archivemos el cuatrimestre", "guardar la versión de este semestre", "archive the semester".
---

# Archive a Semester

`archive/<cuatri>/` holds a frozen static snapshot of the whole site as it stood at the end of a semester, served verbatim under `/archive/<cuatri>/`. Snapshots are plain HTML with no front matter, so later Jekyll builds copy them through untouched — no `exclude:` entry is needed.

Naming: `<year><a|b>`, first semester = `a`, second = `b` (`2025b`, `2026a`).

## Procedure

Replace `2026a` with the semester being archived.

**1. Add the `<option>` to `_includes/footer.html` first**, so the snapshot's own selector lists itself and its siblings:

```html
<option value="/archive/2026a">2026a</option>
```

Newest first. **These options must not use `relative_url`** — see Pitfalls.

**2. Build into a temp destination, with the archive baseurl:**

```sh
TMP=$(mktemp -d)
bundle exec jekyll build --baseurl /archive/2026a --destination "$TMP"
rm -rf "$TMP/archive"          # descarta los archivos de cuatrimestres anteriores
```

**3. Copy the snapshot into place:**

```sh
mkdir -p archive/2026a
rsync -a --delete --delete-excluded \
  --exclude 'CLAUDE.md' --exclude 'CLAUDE.html' \
  --exclude 'sitemap.xml' --exclude 'robots.txt' \
  --exclude 'google*.html' \
  "$TMP"/ archive/2026a/
rm -rf "$TMP"
```

**4. Verify** — run `bundle exec jekyll serve` and crawl `/archive/2026a/` checking every link and asset for a 200, including the footer selector's link to sibling archives. Confirm pages render styled (`assets/styles.css` + `assets/theme.js` resolve under the archive prefix), not just that they return 200.

## Pitfalls

Each of these was hit for real while archiving 2026a.

- **`--baseurl` is what rewrites URLs, not `--destination`.** Building with `--destination archive/2026a` alone produces a snapshot whose links all point at the site root. Both flags are needed, and they do different jobs.
- **A running `jekyll serve` will corrupt the snapshot.** Its watcher rebuilds `_site` (without `--baseurl`) whenever a source file changes, racing the copy. Building into `$TMP` instead of `_site` sidesteps this entirely — that's why step 2 uses `--destination`. It also leaves the dev server serving the live site the whole time.
- **`archive/` is part of the source tree**, so Jekyll copies existing snapshots into the build output. Without the `rm -rf "$TMP/archive"` the result nests them: `archive/2026a/archive/2025b/`.
- **`--exclude` alone does not remove files already in the destination**; `--delete` deliberately protects excluded files there. `--delete-excluded` is required to clean up a previous run.
- **The archive `<option>`s use root-absolute paths on purpose.** With `relative_url`, an archived build resolves `/archive/2025b` to `/archive/2026a/archive/2025b` — a 404. Archives always live at the site root and the live site has `baseurl: ""`, so the plain absolute path is correct in both.
- **Internal links must go through `{{ "/..." | relative_url }}`** or they escape the archive prefix. All current pages comply; re-check with:
  ```sh
  grep -rn 'href="/\|](/' --include="*.markdown" --include="*.html" . \
    --exclude-dir=_site --exclude-dir=archive --exclude-dir=.git | grep -v relative_url
  ```

## Precedent

`25a8dc2 Archive 2025b` — first archive, built from the pre-redesign minima theme. It predates the footer selector, so its own footer has no "Cuatrimestres Anteriores" control.
