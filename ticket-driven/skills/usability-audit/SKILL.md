---
name: usability-audit
description: Audits an app's user interface — an area, a view, a feature, or all of it — for places where operating it could be easier or easier to understand while its function stays exactly the same, walks the user through each evidenced finding one at a time (where it is, how it works today, why it is hard, several options with a recommendation), and turns the decisions into a new feature — spec plus clarification tickets (such as a prototype) where something is still open, ready for /clarify-ticket or /approval. Use to find what makes a UI hard to use or understand; not for a visual redesign or new functions, not for bugs (/hunt-bugs), slowness (/performance-audit), or code structure (/refactor-audit).
disable-model-invocation: true
---

You read the UI from the user's seat, judge, and walk the user through what you found; the UI itself changes in a later run (`/clarify-ticket` for what's still open, then `/approval` and `/implement`). This run ends with a feature folder holding the user's decisions — not a change.

## Language

All labels in this skill and its template are written in English. Write them in the chat language the project sets in `CLAUDE.md` / `AGENTS.md` (default: English); the signs (`🧭 📍 🔁 😕 ➡️ 🧪 ⚠️ ⭐ ✅ ↪ ⏭`) stay as they are. Spec and tickets go in the documentation language set there (default: English).

## The Priority

**Function, then deliberate friction, then ease.** This order decides every doubt in this run:

- **The function stays.** What the user can do, the results, the data stored, and the rules checked stay as they are. A suggestion changes *how* — wording, placement, order of steps, defaults, feedback, shortcuts, hints — never *what*. A suggestion that drops a capability, adds one, or changes stored data is not usability; it's a feature request and leaves this run.
- **Deliberate friction stays.** A confirmation, a lock, a required field, a disabled button the project keeps on purpose. A suggestion that removes it is a trade-off, not a finding. Making it *clearer* — a reason next to the disabled button, a confirmation that names what gets lost — is allowed and often the best option.
- **A concrete path beats taste.** A finding names the user's task and the steps they go through. "Looks cluttered" or "I'd do it differently" is not a finding.
- **In doubt, it's not a finding.** A suspicion costs one line; a wrong finding costs the user's trust in the whole list.

A **finding** is a usability hurdle with five parts:

- **Hurdle** — exactly one class from [Hurdle Classes](#hurdle-classes).
- **Path** — the concrete task and the steps a user goes through today, with what they see at the step where it gets hard: the label, the message, the missing feedback — read from the code, told in the user's words.
- **Location** — the view or dialog as the user would name it, plus file and line.
- **Cost** — what it costs the user: extra steps (counted), a wrong guess and what follows from it, waiting without knowing, input entered twice, a dead end — and how often the path runs, from the task list.
- **Options** — two to four ways to make it easier, each keeping the function, one of them recommended.

Without a concrete path it's a **suspicion** — collected and listed separately.

## Preparation

`/usability-audit <area | view | feature>`
If the user names an area or a view ("the settings dialog", a path), every beat below lives inside it. If they name a feature, its folder under `docs/features/` (or `docs/features/closed/`) and the commits of its tickets define the area: the UI files it touched. If they name nothing, the whole UI is in scope.

Find the UI first: the frontend folder, its routes, pages, dialogs, and strings or translation files. The UI can be web, desktop, mobile, or a command line — the classes below hold for all of them. No user interface in scope → say so and stop.

Read the product description (README, product docs), the rules in `CLAUDE.md` / `AGENTS.md`, the ADRs under `docs/adr/` that touch the UI, and `CONTEXT.md` — or the relevant file via `CONTEXT-MAP.md` in a multi-context repo — for the words the users know. The hunters get no other access to these.

Then build three things before cutting any beat.

### Users and Tasks

Who uses the UI and the few tasks they do most. Per task: one line in the user's words, how often it runs (**frequent** — daily or several times a session, **occasional**, **rare** — setup, once a year), and its source. This list weighs every finding: the same hurdle on a frequent path costs many times more than on a rare one. Where the docs are silent, derive the tasks from the UI's entry points (the start view, the main menu, the most prominent buttons) and mark each as an **assumption**.

### Deliberate Friction

Every place the project makes operating harder on purpose: a confirmation a rule demands, a lock that turns others away, a required field, a disabled state that guards a rule, a second step before something irreversible, a shortcut deliberately left out. Per entry: the promise quoted, its source, and the UI it governs.

Where rules and ADRs are silent, these count as deliberate by default:

- a confirmation before something that can't be undone (deleting, overwriting, sending)
- checks that guard security, access, or data integrity
- legal, safety, or compliance texts and steps

### UI Conventions

The patterns a suggestion has to fit: the component library, where the main action sits, how dialogs, notifications, and errors look, the wording style (form of address, tone, language), the domain terms from `CONTEXT.md`, the keyboard shortcuts in use, where texts live (strings files, translations). Per entry: the pattern and two or three places it's used. A suggestion that breaks a convention says so in its options.

### Seeing It (optional)

If the project documents a way to start the app isolated from real data — a `Prototypes` section with an isolated start in `AGENTS.md` / `CLAUDE.md`, a prototype stage (`STAGE.md`), or a project skill that runs the app — you may start it that way and take screenshots of the views in scope to check a finding. Never start the app against real data. If no isolated way is documented, read only, and say in the coverage that the findings come from the code.

Show the user the task list, the deliberate friction, and the UI conventions **in one message**. They know their users better than any document — they may add, strike, or re-weigh entries; their word stands. Then cut the beats.

## Stake Out the Beats

A **beat** is an area times one hurdle class, sized to a single context window — the views of the most frequent task times *Effort* is one beat, all dialogs times *Consistency* a second. Cut so each hunter carries one class in mind, not all seven.

Cut along the tasks: the views a frequent task passes through get beats for every class that fits; views only rare tasks touch get fewer. *Consistency* beats span several views on purpose — that's where it shows. A class the UI can't have (no lists → no empty lists) gets no beat; name it in the coverage.

Write the beats as a numbered list before sending anyone out. This list is your completion criterion: **the audit is done when every beat has its report** — not when enough findings are in hand.

## Hurdle Classes

The fixed set beats get cut from. Each class reads as _what to look for_ → _how to recognize it_; hand the hunter their class verbatim.

- **Feedback**: the user can't tell what is happening or what just happened. → No sign of loading or saving, a save without confirmation, a background job without progress, a state that matters (locked, unsaved, filtered, offline, read-only) not shown, a click with no visible effect, a disabled control with no reason given.
- **Wording**: the UI speaks the code's language, not the user's. → Technical or internal terms, unexplained abbreviations, one thing under two names, button labels that don't say what happens ("OK", "Submit", "Process"), icon-only buttons without a label or tooltip, error messages showing codes or exceptions, words that differ from the domain vocabulary.
- **Effort**: a task takes more steps than it needs. → Many clicks to a common action, the same input asked twice, no sensible default and no memory of the last choice, a form that empties itself after a mistake, no keyboard path (Enter, Escape, tab order) for a repeated task, one-at-a-time where users regularly do many.
- **Error handling**: mistakes are easy to make and hard to recover from. → Validation only after submit, a message that doesn't say what to do next, input lost on an error, an irreversible action without a warning or undo, a destructive button next to a frequent one and looking just like it.
- **Orientation**: the user doesn't know where they are or where something is. → An important action hidden in a menu, behind hover, or a right-click only, a function reachable only one way, no sign of the current location or selection, fields or sections in a different order than the task, the main action not set apart from the rest.
- **Consistency**: the same thing works differently in different places. → Button order changing between dialogs, the same action with different labels or icons, a shortcut that works in one view only, different date or number formats, one list sortable or searchable and the next not.
- **Empty and edge states**: the UI only works for the average case. → An empty list with no hint what to do, a first start with no guidance, long names cut off without a way to read them, many entries without search or filter, a small window that breaks the layout.

## Send the Hunters

Launch one instance of the Hunter Subagent [hunter.md](../../agents/hunter.md) per beat, all **in a single message** so they run in parallel. It reads only — no worktree, same tree.

Give each one its beat: the paths and the **one** class, verbatim from Hurdle Classes; the tasks that pass through those paths with their frequency; the deliberate friction and UI conventions that touch them; and these extra instructions, verbatim:

> For this audit, a finding is a usability hurdle, not a bug. Its **Trigger** is the user's path: the task, the steps through the UI as the user sees them (labels, buttons, messages — quoted from the code), and the step where it gets hard. It additionally needs a **Cost** (extra steps counted, the wrong guess a user could make and what follows from it, input that has to be repeated, waiting without feedback, and how often the task runs according to the task list you were given) and one **Direction** line: what would make it easier while keeping the function. Taste alone is not a finding. A direction that removes one of the deliberate frictions is not a finding — report it as a **trade-off**, one line, naming the entry; making the friction clearer is allowed. If the direction would change what the user can do, the data stored, or a rule, mark it **changes function**. If whether it's easier can only be judged by trying it — how a drag, a layout, or a flow feels — mark it **needs trying**.

Let each report.

## Cross-Check

Hunter reports are raw material, not findings. Launch one instance of the Verifier Subagent [verifier.md](../../agents/verifier.md) per reported finding, all **in a single message** so they run in parallel — give each only that finding's Title, Trigger, Location, Cost, and Direction, never the hunter's own reasoning, plus these two questions, verbatim, with the entries filled in:

> 1. Does the path hold in the code — are these the labels, steps, and messages the user really sees, and is there no other way (a shortcut, a second entry point, a default, a remembered value) that already makes it easy?
> 2. Would the direction change what the user can do, the stored data, or a rule, remove one of these deliberate frictions: <entries>, or break one of these UI conventions: <entries>? If yes, say which.

A downgraded verdict on question 1 makes the finding a suspicion instead of dropping it. A yes on question 2 makes it a **trade-off** when a deliberate friction is hit, moves it to **changes function** (listed, never walked) when the function is hit, and becomes a warning in its options when a convention is hit.

Then, yourself:

- **Merge duplicates.** One cause is one finding: five dialogs labelled "OK" are one *Wording* finding with five locations; two beats hitting the same button from two directions are one finding with two angles.
- **Weigh it.** Assign the severity (below) from the cost and the task's frequency.
- **Find the tests that pin today's UI.** Tests that assert a label, a message, or a step order the options would change — name them; the ticket will have to update them on purpose, which is a text change, not a function change. Tests of the function itself must stay green untouched.
- **Check for overlap.** An open feature under `docs/features/` that touches the same views gets named with the finding.
- **Write the options.** Two to four per finding, each keeping the function and fitting the UI conventions (or saying which one it breaks), each with its consequence for the user and its effort (**small** — a text or a default, **medium** — a changed component or flow, **large** — a new element or several views). Recommend one and say why. Prefer the smallest option that removes most of the cost.

You're done when **every reported finding** has been through a verifier and the five checks above.

## Overview

Sort by severity, in this order:

1. **Misuse** — the UI invites a wrong action with real consequence: the wrong record edited, something overwritten through a misunderstanding, the user believing something happened that didn't.
2. **Dead end** — the user gets stuck or gives up and has to ask someone.
3. **Frequent friction** — a frequent task takes needless steps or makes the user hesitate.
4. **Occasional friction** — the same on a rare path, or wording that grates but doesn't mislead.

Walk **twelve findings at most**. If more qualify, keep the twelve with the highest severity on the most frequent tasks, and list the rest under *Further findings* — the user can pull any of them into the walk.

Present in one message:

- the findings as a numbered table — number, title, view, class, severity;
- *Further findings*, *Suspicions*, *Trade-offs*, and *Changes function*, one line each;
- **Coverage** — the beats searched, the views without a beat and why, the classes skipped, and whether screenshots backed the findings or the code alone.

**No finding is a valid result too.** Report the coverage, the suspicions, and the trade-offs, and create **no** feature.

Otherwise present finding 1 right below, in the same message.

## Walk the Findings

One finding per turn, as a card from [finding-card-template.md](finding-card-template.md) — about one screen, in plain language, from the user's seat: the words on screen, not the component names. Code appears only as the link in *Where*. When placement is the point, add a today/recommended sketch in the form of [ui-sketch-template.md](../brainstorming/ui-sketch-template.md).

Every card ends its options with the fixed fallback `🧪 P: settle it in a prototype`, so a decision never has to be forced from text. When the hunter marked the finding **needs trying** — whether it's easier depends on how a layout, a drag, or a flow feels — `P` is the recommendation (`⭐ P`), and the card says which options the prototype would compare.

After each user reply:

- **Choice** (A, B, C …) → confirm it in one line (`✅ <decision>`) and present the next finding.
- **Own variant** → check it honestly before adopting it: does the function stay, does it remove a deliberate friction, does it break a convention, does it clash with an earlier decision? Say so plainly. If it holds up, adopt it.
- **Leave it** → `⏭ <finding>` with the user's reason, if they give one; it goes into the spec's *Out of Scope*.
- **Settle it in a prototype** (`P`) → the fallback for every finding the user can't decide from text alone: the options become variants in a prototype, and the decision moves to its ticket. Record it as a prototype handoff in the form of [handoff-template.md](../brainstorming/handoff-template.md): the question (which of the variants is easier for this task in the real view), the variants to compare (the card's options, plus the user's own if they named one), the recommendation as the starting favourite, what is already settled, what waits for it. Confirm with `↪ <finding> → prototype`.
- **Can't decide** ("don't know", "hard to say", "how would that look?", hesitating between two options) → don't push for a letter. Answer what can be answered, then offer `P` explicitly in one line and name which options would go into the prototype. The user may also narrow down first ("only A or B") — then only those become variants.
- **Think it over** → a brainstorming handoff, same form; findings that hang together (same view, or one decision changes the other) share one.
- **Question or doubt** → answer it and stay on the same finding. If the doubt is about how an option would look or feel, it can't be settled in the chat — offer `P`.
- **A choice that changes the function** → it's the user's call, but say plainly that it's a feature request, recommend `/new-feature` for it, and if they still want it here, mark it **changes function** in the spec.
- **Stop** ("that's enough", "let's finish") → end the walk; the findings not yet walked are listed as **not discussed**.

Close every card with the progress line: `✅ <n> decided · ↪ <n> handed off · ⏭ <n> left · ▢ <n> to go`.

Keep a running log in the scratchpad — one line per decided finding: number, choice, handoff type — so a long walk loses nothing.

## Create the Feature

When the walk ends, show the summary in one message: per finding its decision (option, handoff with type, left, not discussed). Propose the feature's **slug** — short, English, kebab-case, ASCII — and get both confirmed. Nothing decided and nothing handed off → create **no** feature; the summary is the result.

Create the feature folder `docs/features/<slug>/`, exactly like `/new-feature` — minus its interview and user-story rounds: the walk already holds the decisions.

Write `specifications.md` with the `/write-spec` skill. The walk fills it as:

- **Problem Statement** — what users go through today on the chosen findings: the task, the steps, the hurdle — from their perspective, not the code's.
- **Solution** — the chosen options, together.
- **User Stories** — per decided finding, the path once it's done ("as a <user> doing <task>, I …"), and that the function behind it stays the same.
- **Implementation Decisions** — per decided finding, the chosen option with its views, texts, and defaults; a sketch where one was drawn.
- **Testing Decisions** — the tests that pin today's texts or step order and get updated on purpose; the tests of the function stay green untouched.
- **Relevant Conventions** — the UI conventions the options follow.
- **Out of Scope** — always: no change of function, no new function, no removal of a deliberate friction, no restyling beyond the decided points; plus every finding left, with its reason.
- **Further Notes** — first the open questions: each handoff's question with its ticket type. Then the task list, the deliberate friction nearby, the trade-offs, the suspicions, the further findings, the findings not discussed, the audit's coverage, its date and commit, and one line: `Geprüft per /usability-audit (<n> Befunde, <d> entschieden, <h> übergeben, <l> gelassen).` — in the documentation language.

Then write the clarification tickets with `/write-clarification-tickets`:

- **Prototype** for every `P`. Findings handed to a prototype that sit in the same view share one ticket — one prototype per area, as `/prototype` builds them. Per finding the ticket carries: the task and today's path from the card, the variants to compare (the options as the user left them), the recommended favourite, what's settled, and the question the prototype must answer. `/clarify-ticket` then runs `/prototype`, which settles the choice in the chat and brings it back into the spec.
- **Brainstorming** for "think it over"; findings that hang together share one.
- **Research** where a fact is missing (can the component library do this, what does the platform allow).

Settled decisions go into the spec, never into a ticket.

Implementation tickets are not written here: the decided options often share components and views, and cutting them into tracer-bullet slices with blocking edges is `/approval`'s job, once the clarification tickets are resolved.

## Final Step

Commit the new feature on the current branch — stage only its folder, never `git add -A`. Never push — pushing is the user's call alone.

Report where the feature landed, the decisions in one line each, and the clarification tickets created. Then give the ready-to-paste command for the next chat: `/clarify-ticket <feature> <NN>` (first open ticket) if clarification tickets exist, otherwise `/approval <feature>`.
