# UI Prototype

Generate **several radically different UI variations** on a single route of the real app, mounted on the area's [stage](SKILL.md#the-stage) and switchable from a floating bottom bar. The user flips between variants in the browser, picks one (or steals bits from each), then throws the rest away.

Everything around the variants is the real app of today. Only the one subtree the question is about gets rebuilt, and only from building blocks the project already has. That's what makes a variant look like the real thing on the first try.

If the question is about logic/state rather than what something looks like, this is the wrong branch. Use [LOGIC.md](LOGIC.md).

## When this is the right shape

- "What should this page look like?"
- "I want to see a few options for this dashboard before committing."
- "Try a different layout for the settings screen."
- Any time the user would otherwise spend a day picking between three vague mockups in their head.

## Two sub-shapes: strongly prefer sub-shape A

A UI prototype is much easier to judge when it's **butting up against the rest of the app**: real header, real sidebar, real data, real density. A throwaway route on its own is a vacuum: every variant looks fine in isolation. Default to sub-shape A whenever there's a plausible existing page to host the variants. Only reach for sub-shape B if the prototype genuinely has no nearby home.

### Sub-shape A: adjustment to an existing page (preferred)

The route already exists. Variants are rendered **on the same route**, gated by a `?variant=` URL search param. The existing data fetching, params, and auth all stay. Only the rendering swaps. This is the default; pick it unless there's a specific reason not to.

If the prototype is for something that doesn't yet have a page but _would naturally live inside one_ (a new section of the dashboard, a new card on the settings screen, a new step in an existing flow), it's still sub-shape A. Mount the variants inside the host page.

### Sub-shape B: a new page (last resort)

Only use this when the thing being prototyped genuinely has no existing page to live inside (e.g. an entirely new top-level surface, or a flow that can't be embedded anywhere sensible).

Create a **throwaway route** following whatever routing convention the project already uses. Don't invent a new top-level structure. Name it so it's obviously a prototype (e.g. include the word `prototype` in the path or filename). Same `?variant=` pattern. The route still lives inside the real app shell (its header, navigation, theme), and its stage's mount point is that route.

Before committing to sub-shape B, sanity-check: is there really no existing page this could be embedded in? An empty route hides design problems that a populated one would expose.

In both sub-shapes the floating bottom bar is identical, and both run on a stage.

## Process

### 1. Set up or refresh the stage

Read `AGENTS.md › Prototypes` for the root and the in-tree code folder ([SKILL › Where prototypes live](SKILL.md#where-prototypes-live)), then open the area's folder.

**No stage yet** → build it, once, from [stage-template.md](stage-template.md):

1. Find the host page and the one subtree the question is about; that's the mount point.
2. Write the data script: scratch data at real-use density, never written to real data. Copying a real data set read-only is fine where the project allows it; otherwise generate it.
3. Write the start script: isolated start (from `AGENTS.md › Prototypes`), the hook that mounts the variants, and putting the hook back on exit, also when the app is closed or the script fails.
4. Start it once without variants, take the reference image, and write `STAGE.md` and the area's `.gitignore`.

**Stage exists** → bring it up to today, before touching the question:

1. Start it against the current code. It must come up without manual steps.
2. Check that the host, the mount point and the hook in `STAGE.md` still exist under those names. Data shape changed? Rebuild the scratch data.
3. Take a fresh reference image of the real area, without variants.
4. Repair only what broke, and note it under *Last refreshed*. Don't redesign the stage for this question.

If the area can't be shown without a mutation the question doesn't need (a login, a lock, a running device), the stage stubs it, and `STAGE.md` says so.

### 2. State the question and pick N

Default to **3 variants**. More than 5 stops being radically different and starts being noise, so cap there.

Write down the plan in one line, in the question folder (`<root>/<area>/<question-slug>/`) and as a top-of-file comment on the switcher:

> "Three variants of the settings page, switchable via `?variant=`, on the existing `/settings` route."

This works whether the user is here to push back or not.

### 3. Generate radically different variants

Draft each variant in the in-tree code folder, under the area and the question (`<code folder>/<area>/<question-slug>/`). Hold each one to:

- The page's purpose and the data it has access to.
- **Building blocks the project already has**: its components, its component library / styling system (TailwindCSS, shadcn, MUI, plain CSS, whatever) and its design tokens. No new colours, spacings, font sizes or shadows as raw values, unless that value is what the question is about. Look at how the host page builds the same kind of element before writing one.
- A clear exported component name, e.g. `VariantA`, `VariantB`, `VariantC`.

Variants must be **structurally different**: different layout, different information hierarchy, different primary affordance, not just different colours. Three slightly-tweaked card grids isn't a UI prototype, it's wallpaper. If two drafts come out too similar, redo one with explicit "do not use a card grid" guidance.

### 4. Wire them together

Create a single switcher component on the route:

```tsx
// pseudo-code, adapt to the project's framework
const variant = searchParams.get("variant") ?? "A";
return (
  <>
    {variant === "A" && <VariantA {...data} />}
    {variant === "B" && <VariantB {...data} />}
    {variant === "C" && <VariantC {...data} />}
    <PrototypeSwitcher variants={["A", "B", "C"]} current={variant} />
  </>
);
```

For sub-shape A (existing page): the switcher sits at the stage's mount point; keep all the existing data fetching above it; only the rendered subtree changes per variant.

For sub-shape B (new page): the throwaway route under `/prototype/<name>` mounts the same switcher.

### 5. Build the floating switcher

A small fixed-position bar at the bottom-centre of the screen with three pieces:

- **Left arrow**: cycles to the previous variant (wraps around).
- **Variant label**: shows the current variant key and, if the variant exports a name, that name too. e.g. `B (Sidebar layout)`.
- **Right arrow**: cycles forward (wraps around).

Behaviour:

- Clicking an arrow updates the URL search param (use the framework's router, e.g. `router.replace` on Next, `navigate` on React Router, etc) so the variant is shareable and reload-stable.
- Keyboard: `←` and `→` arrow keys also cycle. Don't intercept arrow keys when an `<input>`, `<textarea>`, or `[contenteditable]` is focused.
- Visually distinct from the page (e.g. high-contrast pill, subtle shadow) so it's obviously not part of the design being evaluated.
- Hidden in production builds: gate on `process.env.NODE_ENV !== 'production'` or an equivalent check, so a stray prototype merge can't ship the bar to users.

Put the switcher in a single shared component in the in-tree code folder (`<code folder>/PrototypeSwitcher`), so every area and both sub-shapes reuse it.

### 6. Compare against the reference

Before handing over, check each variant against the real area. Take an image of each variant with the stage's reference settings (same window size, same record, same data) and set it beside the fresh reference image:

- **Everything outside the mount point is identical.** If the header, navigation or margins moved, the variant leaks out of its subtree; fix the mount.
- **Inside it, the details match the host page**: the same type sizes and weights, the same spacing steps, the same row height and density, the same control styles. A variant may differ in structure, never in craft.

Fix what's off, once per variant, then hand over. If the session can't take images, say so and ask the user for one look at the variant beside the real page instead.

### 7. Hand it over

Build the decision page ([DECISIONS.md](DECISIONS.md)): one option card per variant in its picture, the start command, URL and `?variant=` keys under *How to try it*, what step 6 showed under *What it clarifies*, and the open choices with your recommendation. Then deliver both open ([SKILL › Deliver it open](SKILL.md#deliver-it-open)): the decision page opened, the stage started in the background (in its browser mode if the app is a web frontend) and the variant you recommend on screen. Hand it over with the stage's start command for later. The user will flip through whenever they get to it. The interesting feedback is usually **"I want the header from B with the sidebar from C"**, which is the actual design they want; the page's *Other* field and notes are there for exactly that.

### 8. Capture the answer and clean up

Once a variant has won (usually the prompt from the decision page comes back), stop the stage if it is still running from the hand-over (through its clean exit, so its hooks come out), capture the answer (which variant and why), then capture the prototype the way the [SKILL](SKILL.md) describes. Fold the winner into the real code and move the rest onto the throwaway branch, not into main:

- **Sub-shape A**: fold the winner into the existing page; drop the losing variants and the switcher from main.
- **Sub-shape B**: promote the winning variant to a real route; drop the throwaway route and the switcher from main.

The full set of variants is the primary source, so it lands on the throwaway branch, not the bin, since variant components and the switcher left in the main branch rot fast and confuse the next reader. The in-tree code folder is git-ignored, so add its files to the throwaway branch explicitly (`git add -f`). The stage stays on main; if the winner changed the host page, update the mount point in `STAGE.md`.

## Anti-patterns

- **Rebuilding the surroundings.** A hand-made copy of the header, sidebar, toolbar or page frame, in the prototype or as a "replica" kept per area, drifts from the real one with every feature and is exactly why a prototype stops looking real. Mount the real page; rebuild only the subtree in question.
- **Freehand styling.** Raw colours, pixel spacings and ad-hoc fonts make a variant look foreign next to the real page. Use the project's components and tokens.

- **Variants that differ only in colour or copy.** That's a tweak, not a prototype. Real variants disagree about structure.
- **Sharing too much code between variants.** A shared `<Header>` is fine; a shared `<Layout>` defeats the point. Each variant should be free to throw out the layout.
- **Wiring variants to real mutations.** Read-only prototypes are fine. If a variant needs to mutate, point it at a stub: the question is "what should this look like", not "does the backend work".
- **Promoting the prototype directly to production.** The variant code was written under prototype constraints (no tests, minimal error handling). Rewrite it properly when you fold it in.
