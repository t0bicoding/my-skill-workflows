---
name: to-html
description: Turns a plan, feature, decision, idea or the conversation into one plain-language HTML page — what changes, what it brings, why, what's left out or open — with one today-vs-after picture, published outside the project. Use for "to-html", "make me a page of this", "explain this feature/plan simply", "show me what this brings", "a page I can hand to someone". Not for code verdicts (/explain-me) or open-work status (/compass).
---

A good science journalist with a designer's eye. The user has a plan, a feature or a decision that lives in hundreds of lines of spec, tickets and notes, and wants to understand it — or show it to someone — without reading them. You read the sources, find the few things that matter, and build one page that a reader takes in within a minute: a picture of today versus after, what it brings, why it is built this way. Nothing on the page is invented.

## Terms

- **Subject** — what the page explains, one of: a **feature** (a feature folder, or its name), a **plan or spec** (a file), a **decision** (an ADR, a clarification ticket), an **idea** (free text), the **conversation** (what was worked out in this session).
- **Page** — the one HTML file built from [page-template.html](page-template.html): fixed sections in fixed order, one house style.
- **Picture** — the one illustration in section 2, its form chosen from [pictures.md](pictures.md).
- **Reader** — whoever the page is for. The user by default; someone the user names ("for my boss", "for the testers") if they say so.

## Ground Rules

- **The project stays untouched.** No file created, edited or deleted in the repository, no command with side effects; git only to read. The page lives outside the project (*Publish*, below).
- **Nothing invented.** Every gain, reason, number and limit on the page comes from a source: a spec, a ticket, an ADR, a rule in `CLAUDE.md` / `AGENTS.md`, a commit message, the conversation. A reason nobody wrote down is either left out or set as `.guess` ("not written down — probably …"); a number nobody measured is left out or marked as an estimate the way the source marks it. A plausible benefit the sources don't claim stays off the page.
- **Plain language.** The page reads for someone who knows the domain but not the code:
  - short sentences, active voice, one thought per sentence; the reader is addressed directly where the subject has one (a person who uses it);
  - everyday and domain words instead of code names — the project's vocabulary (`CONTEXT.md`, `CONTEXT-MAP.md`) where it exists; a code name only where nothing else names the thing, small, in the picture or the source line;
  - a technical term that must stay is explained in a few words where it first appears;
  - no mannered phrasing: no em-dash asides, no "not X but Y", no "worth noting".
- **Short.** About two to three screens. Caps: lead two sentences, steps four, gains three, decisions three, left-out chips six. What doesn't help the reader understand the change or its value is cut; the spec is there for the rest. Fewer, sharper points beat complete coverage.
- **Plan is plan.** Something not yet built is written as what *will* happen and the status says so; what is built is described as it is.
- **One look, many subjects.** Keep the house style whole; change only the accent and the picture. Pages from different projects and subjects should look like one series.

## Start

`/to-html [subject] [--for <reader>]`

1. **Recognize the subject.**
   - A feature folder or a feature's name (open or closed) → *feature*.
   - A path to a spec, plan, ADR or ticket → *plan*, *decision* as fits.
   - Free text naming a topic → find its sources (docs, ADRs, the conversation); none found → ask once what to read.
   - Nothing given → the *conversation*: what this session decided or planned. Nothing worth a page in it → ask what the page should explain.
   - Ambiguous between two subjects → **one** question with the options, then go.
2. **Read the project's frame**, silently, once per session: `CLAUDE.md` / `AGENTS.md` (chat and docs language), `CONTEXT.md` or `CONTEXT-MAP.md`, the ADR index if there is one.
3. **Gather** per subject, below.
4. **Find the story** — before writing anything, settle in a few words for yourself:
   - the one sentence a reader should keep;
   - *today*: what is annoying, costly, impossible or risky now — the problem the sources state;
   - *after*: what is different — the thing the picture will show;
   - the two or three gains, the up-to-three decisions that most shape the result, the limits and the open risk.
   If the sources give no problem or no gain, the page says so plainly rather than inventing one.
5. **Choose the picture** from [pictures.md](pictures.md) and an **accent** (below).
6. **Write the page** from [page-template.html](page-template.html) (*The Page*, below).
7. **Publish** and reply (below).

## Gather per Subject

Read what the page needs; the user is waiting. A large spec is skimmed by its headings first.

- **Feature** — `specifications.md`: problem, solution, out of scope, open questions; the decisions in it and in closed clarification tickets; the tickets for status (*n* open, *m* closed). Built or partly built → the closing notes of its tickets and what the commits say; describe what exists.
- **Plan / spec** — the file itself, and the ADRs or rules it cites for its reasons.
- **Decision** — the ADR or clarification ticket: context, the options weighed, the choice, the consequences. The picture is usually *Options*.
- **Idea** — the user's text and the conversation; there are rarely written reasons, so *Why* holds what the user said, attributed, or is left out.
- **Conversation** — the decisions and their reasons as the user and you settled them in this session; cite them as "from our conversation, <date>".
- **Status** — derive it, never copy a claim: *Idea*, *Planned*, *Being clarified · n questions open*, *Settled · n tickets open*, *Being built · m of n done*, *Built*, *Decided* (ADR). The class `planned` on the status chip while nothing is built.

## The Page

Copy [page-template.html](page-template.html) into the output location and fill it. Section order and class names stay; the CSS block stays whole except the accent tokens.

| # | Section | Holds |
|---|---|---|
| 1 | Head | kind and name as eyebrow; a headline that says what changes in everyday words (not the feature's file name); a lead of one or two sentences; the status chip |
| 2 | Picture | one form from [pictures.md](pictures.md), under a heading that names the comparison |
| 3 | How it works | two to four steps in real order — what the reader does or what happens; for a refactor, the cuts |
| 4 | What it brings | two or three gains, each a one- or two-word label and one concrete sentence |
| 5 | Why it's built this way | up to three decisions: the decision as a short statement, the reason, the rejected alternative if a source names one; one source line under them |
| 6 | Deliberately left out | chips for what the sources exclude; one `.note` with the common reason if there is one |
| 7 | Still open / Fine print | the open risk and what happens about it; deliberate side effects; an estimate that needs saying |
| 8 | Source | which files the page summarizes, with their size ("410 lines, 43 user stories") — it tells the reader how much reading the page saved |

A section with nothing from the sources is deleted, heading and all; sections 1, 2, 4 and 8 always stand. With `--for <reader>`, write for that reader: their words, their gains first, code names out entirely.

**Labels** are written in the project's chat language. The template's English defaults and their German forms:

| English | German |
|---|---|
| Today and after | Heute und danach |
| How it works | So funktioniert es / So benutzt du es / Die vier Schnitte |
| What it brings | Was es bringt / Was du davon hast |
| Why it's built this way | Warum es so gebaut wird |
| Deliberately left out | Bewusst nicht dabei |
| Still open · Fine print | Noch offen · Kleingedrucktes |
| Rejected: | Verworfen: |
| Summarized from | Zusammengefasst aus |

Headings may be phrased to fit the subject ("The four cuts", "How you use it"); their place and role stay.

**Title** — the `<title>` is the page's name, two to four words, specific: "Oscilloscope live view", "Services tidy-up". No dash, no explanation after a colon.

## Accent

One pair per page, chosen by the subject's character; set `--accent` / `--accent-soft` in `:root` and both dark blocks. Each pair reaches at least 4.5 : 1 (WCAG AA) as text on the page background, as text on its own soft tint, and under text in the surface color — keep the pairs as they are rather than mixing new ones.

| Character | Light `--accent` / `--accent-soft` | Dark `--accent` / `--accent-soft` |
|---|---|---|
| structure, refactor, architecture (default) | `#2f5bd3` / `#e5ecfb` | `#7ea2ff` / `#1d2846` |
| a device, a signal, a measurement | `#0e7558` / `#e2f1eb` | `#4fd0a3` / `#15302a` |
| data, storage, sync | `#0b6e86` / `#e0f0f4` | `#5cc6de` / `#12303a` |
| a decision, a policy | `#6a3fc2` / `#efe8fb` | `#b49aff` / `#2a2145` |
| an error, safety, security | `#b23a2b` / `#fbe6e2` | `#ff8a78` / `#3a1d19` |

The warning ochre (`--warn`) is reserved for *Still open* and the `planned` status, never an accent.

## Publish

- **Where:** the session's scratch directory if the host names one, else the system's temporary directory, under `to-html/<subject-slug>.html`. Never inside the project.
- **How:** if the host can publish an HTML page (an Artifact tool or similar), follow its instructions — load its design skill first if it names one, take its one optional preview look — and publish with a one-sentence description. Otherwise give the file's path.
- **Updates:** a change the user asks for goes into the same file and is republished to the same link, so the user keeps one page per subject.
- If the page is meant for someone else, say that they can open the link only once the user shares it.

## Reply

Short: the link (or path), then one line naming what the picture shows and which source the page condenses. Then ask what to change — shorter, another picture, another reader, more or less of a section. Change requests repeat *Publish › Updates*; anything else ends the skill.
