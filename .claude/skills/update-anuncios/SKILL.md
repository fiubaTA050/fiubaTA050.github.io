---
name: update-anuncios
description: Use when the user asks to change the announcements block at the top of the home page (`index.markdown`) — adding or removing fechas de finales, posting a start-of-term notice, or clearing the block. Triggers on phrases like "poner las fechas de finales", "actualizar los anuncios", "agregar una mesa", "reprogramar el final del 15", "sacar los anuncios de la home".
---

# Update Anuncios

The home page opens with `<section class="anuncios">` in `index.markdown`, right
after the front matter and before the first `<div class="row">`. It is raw HTML
inside a Markdown page, so **no blank lines inside the section** — a blank line
makes Kramdown wrap the following HTML in a `<p>` and the layout breaks.

All styling lives in `_sass/_content.scss` under the "Anuncios" heading. Never
add inline styles here; if a new kind of announcement needs styling, add a class
to the partial.

## The two modes

The block swaps content twice a year and is never deleted outright — an empty
`.anuncios` card renders as a stray bordered box.

| When | Content |
|---|---|
| Start of term | First class date, enrolment notice, anything students need before week 1 |
| End of term / exam period | `Fechas de finales` list |

## Shell

Constant across both modes:

```html
<section class="anuncios" aria-labelledby="anuncios-heading">
  <h2 id="anuncios-heading" class="anuncios-title"><i class="fa-solid fa-bullhorn"></i> Anuncios</h2>
  ...bloques...
</section>
```

A block is a `<p class="anuncios-subtitle">` heading followed by either a
`<ul class="anuncios-fechas">` or a `<p class="anuncios-texto">`. Several blocks
can stack inside one section.

## Fechas de finales

```html
  <p class="anuncios-subtitle"><i class="fa-solid fa-graduation-cap"></i> Fechas de finales</p>
  <ul class="anuncios-fechas">
    <li><span class="anuncios-fecha">1 de julio</span> <span class="anuncios-hora">· 19:00 hs</span> <span class="anuncios-aula">· Aula 418</span></li>
    <li class="anuncios-tachada"><span class="anuncios-fecha">15 de julio</span> <span class="anuncios-hora">· 19:00 hs</span> <span class="anuncios-aula">· Aula 418</span> <span class="anuncios-reprogramada">Reprogramada al viernes 17</span></li>
  </ul>
```

Rules:

- One date per `<li>`, chronological. Date as text (`1 de julio`), no year.
- Finals are normally `19:00 hs`; the aula is announced per date.
- **A rescheduled date is struck through, never removed.** Put `anuncios-tachada`
  on the `<li>` and append a `<span class="anuncios-reprogramada">` with the
  reason. The new date gets its own `<li>` in its chronological position.
- The three spans are separated by a literal `·` inside each span, not by CSS.

## Anuncios de cursada

Same shell, one block per topic. A date list:

```html
  <p class="anuncios-subtitle"><i class="fa-solid fa-calendar-day"></i> Primera clase</p>
  <ul class="anuncios-fechas">
    <li><span class="anuncios-fecha">Miércoles 19 de agosto</span> <span class="anuncios-hora">· 19 a 22 h</span> <span class="anuncios-aula">· Presencial en la facultad</span></li>
  </ul>
```

Or free prose:

```html
  <p class="anuncios-subtitle"><i class="fa-solid fa-envelope"></i> Alta al curso</p>
  <p class="anuncios-texto">...</p>
```

`.anuncios-fecha` has `min-width: 7em`, so short and long labels stay aligned in
a list. Keep the class times consistent with the `course-info` block further down
the same page (`Miércoles 19 a 22 h · Viernes 18 a 21 h`).

## Swapping modes

When replacing one mode with the other, **save the outgoing block first** — it
comes back next term. Paste it into the chat, or leave it in a commit whose
message names it, so it can be recovered with `git log -S 'anuncios-fechas'`.

## Verification

```sh
curl -s http://localhost:4000/ | grep -c 'anuncios-'
```

Then look at the rendered page: the card must have the teal left border, no
stray empty `<p>`, and no `<p>` wrapping a `<ul>` (the blank-line bug above).
