---
name: update-calendar
description: Use when the user asks to modify `calendario.markdown` — moving, deleting, inserting, or renumbering Clases (lectures), or adding/updating class metadata such as Notas (Drive), Video (YouTube), Lecturas, Paper, or Trabajo práctico links. Triggers on phrases like "mover Clase N", "eliminar clase", "agregar video a Clase N", "insertar una clase", "actualizar el calendario".
---

# Update Calendar

The calendar lives in `calendario.markdown` as an inline HTML `<table class="calendario">`. Each `<tr>` is a fixed date slot — **the `<td>` with the date is never modified**. All edits move content between rows or change the activity cell.

## Row taxonomy

| Type | Marker | Date column | Accepts a class? | Behavior on shift |
|---|---|---|---|---|
| Class row | no `class=` on `<tr>`, has `<span class="lecture-title">` | fixed | already has one | source/target of moves |
| Buffer row | activity cell is `<td></td>` (empty) | fixed | yes | absorbs cascades; cascade stops here |
| `cal-feriado` | `<tr class="cal-feriado">` | fixed | **no** | skipped during shifts; title is fixed, do not edit |
| `cal-entrega` (TP-only) | `<tr class="cal-entrega">`, only TP content | fixed | yes | absorbs cascades; cascade stops here. **TP entrega entry never moves** |
| `cal-entrega` + class | `<tr class="cal-entrega">` with both class and TP entries | fixed | already has one | class portion can move out; TP entry stays |

## Lecture numbering invariant

Lecture numbers must be strictly consecutive starting at Clase 1 (no gaps). After any structural change, walk the table top-to-bottom and renumber every `<span class="lecture-title">Clase N — …</span>` accordingly.

- **Move** (forward or backward) does **not** renumber: each class keeps its identity.
- **Delete** renumbers (subsequent classes typically decrement).
- **Insert** renumbers (subsequent classes increment).

## Operations

### Delete a class
1. If the row is plain class → set the activity cell to `<td></td>` (becomes a buffer).
2. If the row is `cal-entrega` + class → keep `cal-entrega` and the TP `<dt>/<dd>` block; remove the lecture-title span and any class-only metadata.
3. Reset Notas/Video columns to `<td>—</td>` if they belonged to the removed class.
4. Renumber all subsequent classes (decrement by 1).

### Move a class forward
"Moving Clase N forward" means cascading: Clase N goes to the next eligible slot; if that slot already has a class, that class also cascades forward, and so on.

1. Walk down from the source row, skipping `cal-feriado` rows.
2. Eligible landing slots: **buffer rows** and **`cal-entrega`-only rows**. The cascade terminates as soon as one of these is reached.
3. While walking past class-bearing rows, those classes also shift forward by the same rule (cascade).
4. If the cascade would push a class off the end of the table (no buffer/entrega-only slot remains), **stop and ask the user** before proceeding.
5. The source row becomes empty: if it was a plain class row → activity cell to `<td></td>`; if it was `cal-entrega` + class → keep `cal-entrega` and the TP entry, drop the class portion.
6. Notas/Video column links travel with the class (move them too). Reset abandoned columns to `<td>—</td>`.
7. **Never move TP entrega `<dd>` entries** — they stay anchored to their original date.
8. No renumbering.

### Move a class backward (rare)
Mirror of forward: scan upward for the next eligible slot, same row-type rules. Always confirm with the user since this is unusual.

### Insert a new class
1. Ask the user for: target date, title (`Clase N — Tema`), and any initial metadata.
2. If the target slot is already occupied by a class, run a forward cascade to make room.
3. Renumber all classes top-to-bottom afterwards (the new class takes the number determined by its position).

### Update class metadata
Add or replace entries inside the class's `<dl class="cal-activity-dl">`. Keep this canonical order:

1. **Notas** (mobile-only `<dt>/<dd>`)
2. **Video** (mobile-only `<dt>/<dd>`)
3. **Lecturas** (`fas fa-book`)
4. **Paper** (`fas fa-scroll`)
5. **Trabajo práctico** (`fa fa-bullhorn`) — enunciado or entrega

When adding **Notas**: also replace the row's third `<td>—</td>` with the PDF icon link.
When adding **Video**: also replace the row's fourth `<td>—</td>` with the video icon link.

For metadata categories not listed here, ask the user for the icon and label, then follow the same `<dt>/<dd>` pattern.

## HTML snippets

### Empty / buffer activity cell
```html
<td></td>
```

### Lecture-title span
```html
<span class="lecture-title">Clase N — Tema</span>
```

### Notas (mobile-only block, inside `<dl class="cal-activity-dl">`)
```html
<dt class="cal-mobile-only"><i class="fas fa-file-pdf"></i> Notas:</dt>
<dd class="cal-mobile-only"><a href="{drive-url}" class="schedule-badge">Descargar <i class="fas fa-arrow-circle-down"></i></a></dd>
```

### Video (mobile-only block)
```html
<dt class="cal-mobile-only"><i class="fas fa-file-video"></i> Video:</dt>
<dd class="cal-mobile-only"><a href="{youtube-url}" target="_blank" rel="noopener noreferrer" class="schedule-badge">Ver <i class="fas fa-external-link-alt"></i></a></dd>
```

### Lecturas (single)
```html
<dt><i class="fas fa-book"></i> Lecturas:</dt>
<dd><a href="{url}">{title}</a></dd>
```

### Lecturas (multiple)
```html
<dt><i class="fas fa-book"></i> Lecturas:</dt>
<dd>
  <ul class="cal-reading-list">
    <li><a href="{url}">{title}</a></li>
    <li>...</li>
  </ul>
</dd>
```

### Paper
```html
<dt><i class="fas fa-scroll"></i> Paper:</dt>
<dd><a href="{url}">{title}</a></dd>
```

### Trabajo práctico — enunciado
```html
<dt><i class="fa fa-bullhorn"></i> Trabajo práctico:</dt>
<dd><a href="{{ "/trabajos-practicos/{tp-slug}/" | relative_url }}">{TP title}</a> — enunciado</dd>
```

### Trabajo práctico — entrega
```html
<dt><i class="fa fa-bullhorn"></i> Trabajo práctico:</dt>
<dd><a href="{{ "/trabajos-practicos/{tp-slug}/" | relative_url }}">{TP title}</a> — <span style="color: #c00;">{entrega description}</span></dd>
```

### Notas / Video columns (replacing `—`)
```html
<td><a href="{drive-url}"><i class="fas fa-file-pdf fa-lg"></i></a></td>
<td><a href="{youtube-url}"><i class="fas fa-file-video fa-lg"></i></a></td>
```

## Verification

After any edit:

1. Count lecture-title spans and confirm they are 1..N consecutively:

   ```sh
   grep -oE 'Clase [0-9]+' calendario.markdown | sort -u
   ```

2. If a Jekyll dev server is already running, sanity-check the rendered page:

   ```sh
   curl -s http://localhost:4000/calendario/ | grep -c 'lecture-title'
   ```

3. Confirm no `cal-feriado` row was modified and no TP entrega `<dd>` was relocated.

## Out of scope

- Modifying the date `<td>` (first column).
- Modifying `cal-feriado` rows (their title is fixed).
- Moving TP entrega entries between rows.
- Editing the bibliography section (`<ol class="cal-bibliografia">`) below the table.
