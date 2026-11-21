---
name: prototype
description: Build a throwaway prototype to answer a design question, handed over with a decision page whose choices come back as one copyable prompt. Use when the user wants to sanity-check whether a state model or logic feels right, or explore what a UI should look like.
---

# Prototype

A prototype is **throwaway code that answers a question**. The question decides the shape.

## Pick a branch

Identify which question is being answered, using the user's prompt, the surrounding code, or by asking if the user is around:

- **"Does this logic / state model feel right?"** → [LOGIC.md](LOGIC.md). Build a single shareable HTML file (free-play buttons plus tabbed guided walkthroughs) that pushes the state machine through cases that are hard to reason about on paper, and that a non-developer can drive.
- **"What should this look like?"** → [UI.md](UI.md). Generate several radically different UI variations inside the real app, on the area's stage, switchable via a URL search param and a floating bottom bar.

Both branches end the same way: the prototype is handed over with a **decision page** ([DECISIONS.md](DECISIONS.md)), a /to-html page that says what the prototype settles, asks each open decision with options and your recommendation, and turns the user's choices into one prompt to copy back into the chat. Both are delivered **open**: the page and the running prototype are on the user's screen when you hand over ([Deliver it open](#deliver-it-open)).

The two branches produce very different artifacts, so getting this wrong wastes the whole prototype. If the question is genuinely ambiguous and the user isn't reachable, default to whichever branch better matches the surrounding code (a backend module → logic; a page or component → UI) and state the assumption at the top of the prototype.

## Where prototypes live

Every prototype lives in one fixed place, so the next prototype in the same area finds what the last one left. The place is the project's call, recorded in `AGENTS.md › Prototypes` (or `CLAUDE.md` where the project keeps its conventions there):

- **Root**: the folder all prototypes live under, e.g. `prototypes/`.
- **In-tree code folder**, only when the UI framework can't import from outside its source tree (bare imports such as `react` resolve only below the app's own `node_modules`): the folder inside that tree where variant code goes, e.g. `web/src/prototype/`. Never committed to the main branch; keep it in `.gitignore`.
- **Isolated start**: how the app runs without touching real data (a scratch database, a stub backend, a demo account). One line; the stages build on it.

Read it before anything else. If the section is missing, propose a root next to the project's other top-level folders, ask the user once, and write the section into `AGENTS.md` in the project's documentation language. Don't put a prototype anywhere else, and don't move an existing one in.

Under the root, one folder per **area**, the part of the product a prototype is about (a page, a screen, a panel, a backend module), named the way the project's vocabulary (`CONTEXT.md`) names it:

```
<root>/
  <area>/
    STAGE.md          ← the area's stage (UI prototypes only), see below
    .gitignore        ← ignores the stage's scratch output and reference image
    <data script>     ← fills the stage's scratch data
    <start script>    ← runs the real app on the stage
    <question-slug>/  ← one folder per prototype: its plan line, notes, a logic demo's HTML file
      decisions.html  ← the decision page, see DECISIONS.md
```

An area is coarser than a feature: features come and go, areas stay. Pick an existing area folder when one fits; open a new one only for a part of the product no folder covers yet.

## The stage

A **stage** is what an area keeps between UI prototypes: the real app, started with realistic scratch data, with one known place where a variant can be mounted. It is the reason a UI prototype looks like the real thing: everything around the variant is the real code of today.

A stage holds no copy of the UI. What it keeps, written down in `STAGE.md` from [stage-template.md](stage-template.md):

- **The area and its host**: which page, route or screen shows it, and the one subtree a variant replaces (the **mount point**).
- **Start**: one command that brings the app up on the stage, isolated from real data, and puts everything back on exit, also after a hard kill (a closed console, a stopped background task, a crash): it saves the originals of every file it hooks to disk, and the next start restores them before it hooks again. A run in the background can be stopped cleanly from outside too (a stop command or a stop file the run watches), because a background task can't be sent Ctrl+C. If the app is a web frontend inside a desktop shell (Tauri, Electron, Wails and the like), the start also has a **browser mode** that serves the frontend against the isolated backend without the shell.
- **Scratch data**: where it comes from and how dense it is, enough rows, pages and long names that panels overflow the way they do in real use.
- **Reference**: how to take the reference image of the real area (window size, which record is open, the URL). The image itself is regenerated each time and ignored by git.

The scripts are the project's own: any language, any runner. This skill prescribes what a stage contains, never how it's built.

A stage is built once per area, by the first UI prototype that needs it ([UI.md › Set up or refresh the stage](UI.md#1-set-up-or-refresh-the-stage)), and kept for the next. Logic prototypes don't need one.

## Deliver it open

The hand-over isn't a set of instructions; it's the prototype and its decision page already open in front of the user. Do both yourself, as the last step before the hand-over message:

1. **Open the decision page.** Published through the host (an Artifact tool or similar): open that page with the host's open action. Not published: open the file in the default browser (`start ""` on Windows, `open` on macOS, `xdg-open` on Linux).
2. **Start the prototype and bring it to the question.**
   - **Logic demo:** open its HTML file in the default browser.
   - **UI prototype with a web frontend**, whether a web app or a web view inside a desktop shell (Tauri, Electron, Wails, Capacitor and the like): start the stage in its browser mode and open the default browser on the host route with `?variant=` set to your recommended variant, or the first one if you recommend none. The browser comes up in seconds without building the shell, and the URL carries record and variant. Name the shell start as the alternative for what only the shell shows (native window, menus, file dialogs).
   - **UI prototype without a web frontend** (native desktop, mobile, terminal UI): start the app on the stage and take it to the area through whatever the app offers: a deep link, a start argument, an environment variable, an initial route. Without such a way, say in one line which clicks lead there.
3. **Keep the session free.** A start that keeps running (dev server, app) goes into the background, so you and the user can keep talking while it runs. Stop it only through the stage's clean exit (its stop command, Ctrl+C, closing the window), never by killing it hard, unless the stage restores its hooks after a hard kill. Stop it yourself when the prototype is captured ([Rules](#rules-that-apply-to-both), rule 7).
4. **Say what's open, and how to reopen it.** The hand-over message names the page's link or path, the URL or screen the prototype stands on, and the start command for later. If something couldn't be opened (no display, the start failed, a port was taken), say which and why. The user then does that one step by hand.

## Rules that apply to both

1. **Throwaway from day one, and clearly marked as such.** Prototype code lives only under the root and, for UI variants, the in-tree code folder from `AGENTS.md › Prototypes`, in the area's folder, and is named so a casual reader can see it's a prototype, not production. A hook into production code (the mount point, a route) is at most a couple of lines that the stage's start script adds and removes again.
2. **Trivial to run, and already running.** A UI prototype starts from the stage's one start command. A logic demo is a single HTML file the user double-clicks. Either way, no thinking required to start it, and at hand-over you have started it already ([Deliver it open](#deliver-it-open)).
3. **No persistence by default.** State lives in memory. Persistence is the thing the prototype is _checking_, not something it should depend on. The stage's scratch data is the one exception, and it never touches real data: it lives in the stage's ignored output folder or another place with a clear "PROTOTYPE, wipe me" name.
4. **Skip the polish.** No tests, no error handling beyond what makes the prototype _runnable_, no abstractions. The point is to learn something fast. The stage is the exception in one respect: it's reused, so its start command must work and must clean up after itself every time.
5. **Surface the state.** After every action (logic) or on every variant switch (UI), print or render the full relevant state so the user can see what changed.
6. **Ask on one page.** Every hand-over comes with the decision page from [DECISIONS.md](DECISIONS.md), and every change to the prototype updates it. The user's answer comes back as the prompt it generates; don't ask the same decisions again in the chat.
7. **Capture it when done.** Stop a stage still running from the hand-over through its clean exit. Fold any validated decision into the real code, then capture the prototype itself as a **primary source**: commit its question folder and its variant code to a throwaway branch, out of main, and leave a context pointer to that branch on the ticket that requested it. Capture the answer too (the verdict and the question it settled) in the ticket or a commit. The main branch keeps only the validated decision, and the area's stage: `STAGE.md`, its `.gitignore` and its scripts stay on main for the next prototype.
