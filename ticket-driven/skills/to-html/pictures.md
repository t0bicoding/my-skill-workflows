# Pictures

Every page holds one picture in section 2. It is what the reader takes in first, so it shows the
change itself — what is different afterwards — not a decoration. Choose the form by what the
subject is about; the classes are all in [page-template.html](page-template.html).

## General Rules

- **One picture, one idea.** A form may have two halves (today | after), never two forms side by
  side. Exception: *sizes to scale* may sit above *twice → once* when both show the same change, as
  for a refactor that both shrinks files and removes a copy.
- **The reader's words** on every label. A code name only where nothing else names the thing, set
  in `<code>`, small.
- **Real numbers or none.** Every number comes from a source; a derived one is marked `~` or "ca."
  and the source names what it was derived from. Bars and positions are drawn to scale:
  `width = value / largest value × 100 %`, one scale per picture.
- **Today is today.** The *today* half shows how things are; the *after* half is the plan and is
  labeled as such while nothing is built.
- **Theme tokens only.** No literal color in the markup; the screen tokens (`--screen-*`) are the
  one place a dark surface stays dark in both themes, because a device screen is dark.
- **Phone width.** Every form stacks or wraps at 400 px; nothing gets a fixed width in px.
- **Motion only where motion is the point** — a signal that moves, a flow that runs — at most one
  animated element, and none under `prefers-reduced-motion`. Small inline script; generate path
  data with a loop rather than hand-writing long SVG paths.
- **Accessible.** The figure container gets `role="img"` and an `aria-label` that says what the
  picture shows, in one sentence.

## Choose the Form

| The subject is about … | Form |
|---|---|
| something a person sees or uses — a screen, a device, a dialog, a report | **Screen** |
| things getting smaller or faster — files, waiting time, clicks, queries | **Sizes to scale** |
| something built twice that becomes one | **Twice → once** |
| a sequence from a trigger to a result, with a branch that matters | **Flow** |
| a choice between options (a decision record, a spike result) | **Options** |
| what happens in which order — a plan, several tickets, a roadmap | **Timeline** |

Two forms fit → take the one that shows the gain named first under *What it brings*.

## Screen

Two `.side` columns in a `.compare`: *Today* and *After*, each a small illustration and a short
`<ul>` of two or three lines that say what the reader experiences.

- **A device** (instrument, machine, phone): a `.screen` with `.screen-head` (the device's own
  readouts — units, scales, a timestamp) and an SVG or canvas drawing its typical content. The
  *today* screen may be `.frozen`; the *after* screen may carry the one motion (`.rec` for a
  recording, a moving trace).
- **An app view** (a window, a dialog, a list): a `.window` with `.window-bar` (the view's real
  title) and a `.window-body` of a few `.mock-line` rows and the real labels that matter; mark the
  new part with `.mock-new`.
- Draw only what tells today from after. A detail only this subject has — its units, its grid, its
  real button label — belongs in; generic chrome stays out.

```html
<div class="compare">
  <div class="side">
    <span class="side-label">Today</span>
    <div class="screen frozen"> <div class="screen-head"><span>CH1 500 mV/div</span><span>STILL 13:42:07</span></div> <svg id="before" viewBox="0 0 200 160"></svg> </div>
    <ul><li>…</li></ul>
  </div>
  <div class="side"> … After … </div>
</div>
```

## Sizes to Scale

A `.box` with a `.legend` (today / after / moves out) and one `.size` per thing that changes,
each with a *today* and an *after* `.bar-row`. After-bars split into `.bar.new` (what stays) and
`.bar.moved` (what moves to its own place). The `.num` shows the real figures. Under the bars, one
`.note` that gives the scale a meaning ("the typical file in the project has 108 lines").

Three to five rows. Sort by the size of the gain, largest first.

```html
<div class="box" role="img" aria-label="…">
  <div class="legend"><span><i style="background: var(--old)"></i>today</span> …</div>
  <div class="size">
    <span class="size-name">Document service <small>largest file in the project</small></span>
    <div class="bar-row"><span>today</span><div class="track"><div class="bar old" style="width:78.5%"></div><span class="num">1892</span></div></div>
    <div class="bar-row"><span>after</span><div class="track"><div class="bar new" style="width:61%"></div><div class="bar moved" style="width:9.5%"></div><span class="num">~1470 + 230</span></div></div>
  </div>
  <p class="note">…</p>
</div>
```

## Twice → Once

A `.compare` of two halves. *Today*: a `.copies` grid, one `.copy` per place, each holding the
same `.dup` label. *After*: the same `.copy` boxes without it, and one `.shared` bar under them.
Under each half one line led by a `.count` (`2×` in `.bad`, `1×` in `.good`) that says what it
cost or what it saves — with the source's example if there is one ("one fix already had to go into
both copies").

## Flow

An `<ol class="flow">` of `.node` items, four to seven, arrows drawn by the list itself. The step
the subject changes is `.node.hot`; a step that can fail and matters is `.node.fail`. One
`.branch` under the flow for the single side path that matters ("if the device is unplugged → …").
For a before/after of a flow: two flows under *Today* and *After* labels, the changed nodes `.hot`.

## Options

A `.options` grid, one `.option` per alternative the source weighs, the chosen one `.chosen` with
its `.tag` saying so. Each carries two to four `<li class="pro">` / `<li class="con">` lines taken
from the source. An option the source rejected without a reason gets no invented one — leave its
list short.

## Timeline

An `<ol class="timeline">` in real order; each `<li>` holds the step's name in `<strong>`, a
`.when` line (its state, or a date only if the source has one) and, if it waits on something, a
`.waits` line naming it. `.done` for finished steps, `.next` for the one that comes next. Five to
eight entries; group tickets that belong together into one entry.
