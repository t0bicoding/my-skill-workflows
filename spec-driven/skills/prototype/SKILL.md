---
name: prototype
description: Builds a throwaway prototype in the real project, on its own temporary branch - ui (an uncertain UI decision), logic (how a flow should behave or feel) or design (the look of a new element or component). Use from slice or directly to try out an idea quickly.
---

# Prototype

Throwaway code that answers one question, built in the real project so the decision is made on the real thing.

| Kind | Clarifies |
|---|---|
| `ui` | an uncertain UI decision |
| `logic` | how a logic or flow should behave or feel |
| `design` | the look of a new element or component |

If kind or question are unclear, ask briefly.

## 1. Agree on the setup

Before building, say in a few lines where the prototype goes (which page, window or view), which existing components and styles it uses and which data it shows. The user confirms or corrects.

## 2. Temporary branch

Prototypes live on their own branch in the project folder, never in the feature code.

1. Commit open work on the current branch first, e.g. the interview files as `wip(<feature>): slice-<nn> interview` (from `fast-lane`: `wip(<feature>): fast-lane interview`). Otherwise it moves along to the prototype branch.
2. `git switch -c <feature>-slice-<nn>-proto-<topic>` (from `fast-lane`: `<feature>-proto-<topic>`; used directly without a feature: `proto-<topic>`).
3. Build, and commit the prototype on this branch.

## 3. Build

- **In the real app:** the variant sits on the real page, window or view where it will live later, with the real layout, components (controls, widgets) and styles around it. Only the part under decision is new. Change real code freely; it's a throwaway branch.
- **Realistic data:** enough entries, long names, and empty or error states where they matter.
- `ui` and `design`: two or three clearly different variants, switchable. Web: e.g. a URL parameter. Desktop: e.g. a command-line argument (`--variant b`), an environment variable or a small switcher in the window.
- `logic`: make the cases that are hard to judge on paper easy to click through or run.
- No standalone mock page, unless the project has no UI yet; then follow the stack and the decisions so far.
- Keep it as small as the question allows. Give the user one command to start it, and start it if they want.

## 4. Result

- Ask the user what the prototype settled.
- `ui` and `design`: take screenshots while the prototype still runs, saved to `assets/` of the current interview folder (slice: `slice-<nn>/interview/`, fast-lane: `implementation/interview/`; used directly: the interview folder, if there is one). Don't commit them on the prototype branch; uncommitted files move along when switching back.

  | UI | Screenshots by you, if available |
  |---|---|
  | Web | a browser tool or the project's Playwright |
  | Desktop (e.g. Avalonia, WPF, tkinter, Qt) | the framework's headless rendering (e.g. `Avalonia.Headless`), a capture of the app window (e.g. Pillow `ImageGrab`) or a computer-use tool |

  Otherwise name the files and ask the user to save them there. Install new tools or packages for this only after the user's OK.
- Switch back to the original branch. If the prototype added packages, reinstall dependencies.
- In a slice or in `fast-lane`, the result is the answer to an interview question; `interview` keeps it with the other decisions and writes it into the matching topic file with the screenshots at the end. Used directly: ask where to record it.
- The decision must hold without the prototype. The branch stays until `close-slice` (slice prototypes) or `close-feature` (fast-lane prototypes) offers to delete it; to look at it again, switch to it.
