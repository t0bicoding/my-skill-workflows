# Workflow

This project is developed with a spec-driven workflow. A feature goes through two phases:

1. **Planning** (`/feature`): *what* the feature should do. No technical decisions yet.
2. **Building** (`/slice` → `/implement` → `/close-slice`): the feature is built in small vertical slices. For each slice, the technical decisions are made, implemented and reviewed.

Guiding principle: **the user always keeps the overview of the codebase.** Slices are small enough to follow, every slice delivers something testable where possible, and every decision is written down in a way that can be understood later.

## Flow

```
/skill-setup                once per project: workflow documents, ROADMAP.md via /project-roadmap
      │
/project-setup              new projects: plan the skeleton in an interview, set it up after OK
      │
/new-feature                agree on a name, create the feature folder
      │                     → the user writes the idea into idea.md
/feature <name>             plan: interview → specifications.md → roadmap.md
      │
      ├─► per slice (on the feature branch):
      │     /slice          technical decisions, prototypes, ADRs → scope.md
      │     /implement      builder + reviewer subagents → handoff.md
      │     /human-review   optional: code review in the chat → review/ (fixes → /implement)
      │     /close-slice    remaining deviations, fixes, docs, one commit per slice
      │
      ├─► or fast lane (on the feature branch):
      │     /fast-lane      one interview for all slices, prototypes → all scope.md
      │     /implement all  every slice in one run → one commit + handoff.md each
      │     /human-review   optional, per slice
      │     /close-slice all  all remaining deviations together
      │
      │   /merge            any time: closed slices → main, or only update from main
      │
/close-feature              postponed points, AGENTS.md / README.md, ROADMAP.md next steps, move to closed/, last merge

/one-shot                   small change or bug fix without the feature process
/project-roadmap            any time: plan new features or change the direction of ROADMAP.md
```

## Project setup

### `/skill-setup` and `/project-setup`

`/skill-setup` prepares the workflow documents once per project (README, AGENTS.md, glossary, architecture, ADR folder, this file). First it goes through the picture of the project with `/project-roadmap`, which writes `ROADMAP.md`. For a new project it then only records the planned stack and points to `/project-setup`.

`/project-setup` plans the project skeleton with the user: for the chosen stack, which dependencies, libraries and tools the project needs now and which can wait until a feature needs them. It goes through them in an interview (files in `docs/interview/project-setup/`), guided by the features in `ROADMAP.md`, then shows the complete setup plan with commands, dependencies and scripts. The user can still change anything; only after their confirmation is the project scaffolded, installed and verified.

### Project roadmap

`ROADMAP.md` in the project root points the way for the whole project: a short description, deliberate non-goals, and a table of the features with goal, horizon (`now`, `next`, `later`), dependencies and status. Only `now` and `next` features get a few lines of rough boundary; everything deeper is planned in the feature workflow. It is not to be confused with a feature's `roadmap.md`, which lists the slices of one feature.

- `/project-roadmap` plans it with the user in an interview: the first picture in `/skill-setup`, later new features or a change of direction.
- `maintain-roadmap` keeps it up to date: `/new-feature` sets a feature to `in progress`, `/close-feature` to `done`. The slice skills don't touch it. At the end of a feature it also proposes the next steps from what the feature taught.

## Planning

### `/new-feature`

Starts a feature with a short interview. It proposes the next feature from `ROADMAP.md`; the feature name (kebab-case, e.g. `user-login`) is agreed with the user. Afterwards the folder `docs/features/<feature>/planning/` exists with:

- `idea.md`: a small placeholder. **The user writes the idea here, in any form.** No skill ever changes this file.
- `idea-assets/`: empty, for screenshots, sketches, links or other material of the user.

### `/feature <name>`

Plans the feature from the user's point of view: what it should do, what it should not do, which functions it has, and the user stories. Coding and testing decisions are deliberately left out; they are made per slice.

- **Interview in rounds.** Each question comes with answer options and a recommendation. The user can ask back at any time. The rounds build on each other.
- **Interview files.** At the end of the interview, the decisions are written by topic into `planning/interview/` (see "Interview files" below), and the user reviews them. If planning is interrupted, a temporary `progress.md` there lets `/feature` pick up in a new chat (e.g. the next day).
- **Spec only on confirmation.** When the feature is clarified enough, the user decides (or the AI recommends) to write `specifications.md` from the interview files. It is only written after the user explicitly confirms.
- **Roadmap.** `roadmap.md` splits the feature into vertical slices following the tracer bullet principle: each slice cuts through all the layers it needs and delivers a testable result. The roadmap is the only place where the status of the slices is tracked (`open`, `in progress`, `done`).

## Building

All building happens on **one branch per feature** (`<feature>`), in the same project folder: the skills switch branches, there are no extra copies of the project. `main` is never touched until the user merges. Slices of a feature run one after another on the same branch. A connected remote such as GitHub serves as backup: the skills offer pushing after each closed slice and after a merge, never on their own.

### `/slice`

Prepares the next slice from the roadmap. On the first slice it creates the feature branch; later it switches to it if needed. If `main` has moved on since, it offers to update the feature branch first.

The technical decisions of the slice are made with the user in an interview: whatever the slice needs, e.g. structure, data, logic, UI, testing, terms and ADRs. At the end they are written by topic into `implementation/slice-<nn>/interview/` (see "Interview files" below), and the user reviews them before `scope.md` is written.

- **Prototypes** clarify uncertain decisions with throwaway code: `ui` (an uncertain UI choice), `logic` (how a flow should behave or feel) or `design` (the look of a new element). They are built in the real code on their own temporary branch (`<feature>-slice-<nn>-proto-<topic>`), so they never end up in the feature code. What a prototype settled is recorded in the interview files, with screenshots in `interview/assets/`.
- **ADRs** are only written for decisions that are hard to reverse, surprising without context and the result of a real trade-off. `interview/adrs.md` only lists them; once the user agrees, the actual ADR is written to `docs/adrs/`.
- At the end, `scope.md` states which part of the spec the slice delivers, its acceptance criteria and what is not part of it. It is written from the interview files, the spec and the roadmap.

### `/fast-lane` (instead of `/slice` for every slice)

For features with clear slices and few technical decisions. `/feature` recommends which way fits; the user decides.

- **One short interview for the whole feature.** The AI decides as much as it can itself and asks only what is important (real trade-offs across slices, what the user sees, what is hard to reverse). The decisions go into `implementation/interview/`, shared by all slices.
- **Prototypes only where they pay off:** when a decision can't be judged on paper and matters a lot. Branch `<feature>-proto-<topic>`, deleted at `/close-feature`.
- **Spec after the prototypes:** if the interview or a prototype changed what the feature does, the spec (and if needed the roadmap) is adjusted first, with an entry under "Changes".
- **All scopes at once**, reviewed together. A scope may still be adjusted until its slice's implementation starts, e.g. when the previous slice's handoff shows a deviation that affects it.

### `/implement`

Builds the slice on the feature branch with independent subagents:

- A **builder** implements the decisions.
- Two **reviewers** check the result right away, each in its own subagent: one against `specifications.md` and `scope.md`, one against the codebase standards.

At the end, `handoff.md` records what was actually built, which acceptance criteria are met, every deviation from `scope.md`, what was postponed, open problems and notes for the next slice.

**`/implement <feature> all`:** after `/fast-lane`, all prepared slices are built in one run, in roadmap order. Each slice gets its own commit `feat(<feature>): slice-<nn> …` and its own `handoff.md` right away. Before each slice, the previous handoff is checked against the next scope. The run only stops when a slice is blocked or a decision affects later slices.

### `/human-review` (optional)

A code review in the chat, in question rounds like the interview. Not a raw diff: the AI goes through the diff and picks the spots worth a human look, e.g. deviations from the scope, spots where it was unsure, things that are hard to reverse or risky, test gaps, new patterns and visible details no test can judge. Mechanical changes are left out.

- **Overview first:** what was built, how to try it, the planned stops with the reason for each. The user can add or drop stops.
- **One stop per round:** how the code is reached (flow), why it exists, the decisive diff, a clickable link to the code, the AI's assessment and options with a recommendation, including "keep as is" when the spot is good. The user picks an option, asks about the spot or describes their own change. Complex spots get an extra file that explains the options in detail.
- Deviations from `handoff.md` are stops too: accepted or fixed.
- **Result:** `review/review.md` records every stop and decision. If changes are wanted, `review/review-scope.md` lists them with "done when", and `/implement` builds them in a fix run. Afterwards `/human-review` can check the result once more.

### `/close-slice`

Closes the slice. If no human review was done yet, it offers one first.

- Every deviation from `handoff.md` the review has not decided yet is decided by the user: **accepted** (marked in `handoff.md`; an affected ADR is updated) or **fixed** (a fix run of `/implement`, `handoff.md` is extended).
- `scope.md` is not changed once its slice is implemented: the plan stays the plan, reality goes into `handoff.md`.
- Once everything is clarified, `GLOSSARY.md`, `GLOSSARY-MAP.md` and `ARCHITECTURE.md` are updated.
- The prototype branches of the slice can be deleted.
- All commits of the slice are squashed into **one commit**, e.g. `feat(user-login): slice-02 form validation`.
- If a remote is connected, pushing the feature branch is offered.
- Finally: "Merge now or continue with the next slice?"

**`/close-slice <feature> all`:** after `/implement all`, all implemented slices are closed in one pass: reviews for the slices the user picks, remaining deviations grouped by slice, fixes folded into the commit of the slice they belong to, project documents updated once. It stays one commit per slice.

## Merging

### `/merge`

The user decides when closed slices go to `main`: after one slice or after several.

- **Merge:** shows which slices go to `main`, rebases the feature branch onto the current `main`, runs lint, typecheck and tests, and fast-forwards `main`. `main` keeps one commit per slice; pushing `main` is offered. The feature branch stays as long as the feature runs.
- **Update only:** rebases the feature branch onto the current `main` without merging. Useful when another feature or a one-shot was merged in the meantime: the feature sees the new state early, and conflicts come in small portions.

**Conflicts** only appear when `main` changed while the feature branch was open, and always in the branch that is merged later. Typical spots and how they are resolved:

| Spot | Resolution |
|---|---|
| `GLOSSARY.md`, `ARCHITECTURE.md`, `AGENTS.md`, `README.md` | Usually both sides added something: keep both. |
| ADR numbers in `docs/adrs/` | Git reports no conflict, but a number may be taken twice: the ADRs of the feature are renumbered and all links updated. |
| Lock files | Regenerate, never resolve by hand. |
| Code | Both sides are shown, the user decides. |
| Logical conflicts | Git merges cleanly but the code no longer fits together: caught by the checks after the rebase. |

Working on several features in parallel is the user's choice, and so are the conflicts it brings.

## Closing a feature

### `/close-feature`

1. **Check:** are all slices in `roadmap.md` done? If not, the user decides whether to close anyway.
2. **Postponed points:** everything postponed or left open in the slice handoffs is listed. For each point the user decides: new feature, `/one-shot` or drop it.
3. **Project documents:** `AGENTS.md` and `README.md` are updated.
4. **Project roadmap:** the feature is set to `done`, postponed points that become new features are added, and the next steps are proposed: which features are now unblocked, what moves closer.
5. **Move:** the feature folder moves to `docs/features/closed/<feature>/`. Nothing in `closed/` is edited afterwards.
6. **Last merge** to `main`, then the feature branch is deleted.

Moving the folder loses nothing later features need: ADRs live in `docs/adrs/`, terms in `GLOSSARY.md`, structure in `ARCHITECTURE.md`.

## Small changes

### `/one-shot`

For a bug fix, a small feature or any other small change without the feature process.

- A short interview if something is unclear. If the change turns out bigger than expected (several slices, many open questions), the AI recommends `/new-feature` instead.
- Built on its own branch (`one-shot-<topic>`) with the same builder and reviewers as `/implement`. An optional human review runs in the chat, without files; changes are fixed directly.
- No document of its own: the commit is the record. Project documents (glossary, architecture, AGENTS, README) and ADRs are only updated if the change affects them.
- Merged with the same steps as `/merge`, after the user's OK.

### `/interview` and `/prototype`

Also usable on their own: `/interview` to clarify any topic in question rounds (its files go to `docs/interview/<topic>/`), `/prototype` to quickly try out a UI, logic or design idea.

## Interview files

Every interview ends with an `interview/` folder that holds its decisions, sorted by topic, so each decision can be found where you would look for it:

| File | Content |
|---|---|
| `README.md` | Entry point: one line and a link per topic, decisions the AI made itself, what was left open |
| `<topic>.md` | One file per topic, named freely after the content (e.g. `editor-layout.md`, `saving.md`): each decision with reason and rejected alternative, with flows, wireframes or tables where they help |
| `adrs.md` | Only if ADRs were agreed: which ADRs are created or changed |
| `glossary.md` | Only if terms were introduced or sharpened |
| `assets/` | Screenshots, e.g. from a prototype |

The files are short and factual. While the interview runs, the folder also holds temporary files (`progress.md` to continue in a new chat, `q<n>-….md` as visual aids for single questions); they are deleted at the end. Diagrams use Mermaid; the VS Code preview shows them with a Mermaid extension (e.g. `bierner.markdown-mermaid`).

## Where things live

```
docs/
  adrs/                         architecture decision records, project-wide
  interview/<topic>/            interviews without a feature (direct, one-shot, project-setup, project-roadmap)
  workflow/README.md            this file
  features/
    closed/                     finished features, no longer edited
    <feature>/
      planning/
        idea.md                 the user's idea, owned by the user
        idea-assets/
        interview/              decisions of the planning interview, by topic
        specifications.md       what the feature must do
        roadmap.md              slices and their status
      implementation/
        interview/              fast-lane only: decisions for all slices, by topic
        slice-<nn>/
          interview/            decisions of the slice interview, by topic
          scope.md              what the slice delivers
          handoff.md            what actually happened
          review/               optional human review: review.md, review-scope.md (changes)
ROADMAP.md                      planned features of the project
GLOSSARY.md                     domain terms (areas may have their own GLOSSARY.md)
GLOSSARY-MAP.md                 areas and how they relate
ARCHITECTURE.md                 how the code is structured
AGENTS.md                       commands, conventions, project context for agents
```

**IDs connect the documents:** `US-n` (user story) and `F-n` (function) in the spec, `AC-n` (acceptance criterion of the feature), `SC-n` (acceptance criterion of a slice, pointing to an `AC`), `D-n` (deviation in the handoff), `R-n` (stop in the review, and the change it asks for). Every criterion can be traced from the user story to its test.

## Rules

- **Nothing is built on `main`.** `main` only gets what the user accepted.
- **The user decides** when the spec is written, which ADRs are created, whether deviations are accepted and when to merge.
- **Plan stays plan.** `idea.md` and `scope.md` are not rewritten to match what happened; reality goes into `handoff.md` and `roadmap.md`. Only a scope whose slice has not started yet may still be adjusted (e.g. after `/fast-lane`).
- **One place per fact.** Documents link to each other instead of repeating content.
- **No empty files.** A file is only created when it has real content.
- **All documents are in English**, regardless of the conversation language.
