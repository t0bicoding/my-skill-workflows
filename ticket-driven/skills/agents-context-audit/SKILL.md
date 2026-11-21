---
name: agents-context-audit
description: Finds out why the context window fills up or carries a heavy load in this project's Claude Code sessions — the fixed start load (skill and agent listings, CLAUDE.md and imports, MCP servers), big tool results, files read twice, large skill texts, long subagent reports, sessions that run on without a reset — measured from the session transcripts, and proposes changes that keep future sessions lean. The analysis is read-only and ends with a report in the chat plus an HTML page; only the proposals the user then confirms in a plain chat reply get applied. Use when sessions hit compaction, feel sluggish late on, or cost many tokens.
disable-model-invocation: true
---

You measure, explain and propose; you change nothing until the user has said in the chat what to change. The run has two phases: **analysis** (steps 1–5, read-only, ends with the report and the page) and **apply** (step 7, only what the user confirmed).

## Ground Rules

- **Read-only until confirmed.** Up to the report nothing changes — not in the project, not in the user's Claude Code settings, skills, agents or plugins. Reading files, `git` read commands, and the bundled script are fine. The only files written are the script's output, the findings file and the page, all in a scratch folder outside the project.
- **No question dialogs.** Never use a question or choice tool (such as `AskUserQuestion`) in this skill. Every question and the confirmation happen as plain text in the chat, and the user answers in their own words.
- **Keep this run lean, too.** Work from the script's summary; open `data.json` only for the one figure you need, never whole. Read a file to check a finding by its relevant part, not in full.
- **Evidence, not hunches.** A finding stands on the script's numbers or a file you read. What you suspect but can't show is a **suspicion** and is listed separately.
- **Exact versus estimated.** Context size per model call is exact (API usage). What filled it is an estimate — characters converted with the ratio the script observed. Mark estimates with `≈` everywhere, and compare causes by their relative size rather than arguing over single tokens.
- **Transcripts are private.** The report and the page carry metrics, file paths and shortened commands only; never quote prompt text, file contents or tool output.
- **Nothing that matters gets cut blind.** A proposal never removes a rule from `CLAUDE.md` / `AGENTS.md` the project still relies on, never drops a skill's trigger words from its description, and never disables a tool, skill or plugin the sessions actually used.

## Start

`/agents-context-audit [--sessions N | --days D | --session <id>]`
Default: the ten most recent sessions of this project, the current one excluded. Pass the arguments through to the script.

Read the chat and documentation language from `CLAUDE.md` / `AGENTS.md` (default: English). The report, the page and the questions use the chat language.

## 1. Measure

Pick an output folder: the session's scratch directory if the host names one, else the system temp directory, under `agents-context-audit/<YYYY-MM-DD>/`. Never inside the project. Then run from the project root:

```bash
node <this skill's folder>/context-load.mjs --out <output folder> [arguments]
```

It finds this project's transcripts (`~/.claude/projects/<project-path-slug>/`, or `$CLAUDE_CONFIG_DIR`) and prints a compact summary; the full figures go to `data.json`. What it measures:

- **per session** — model calls, context at the first call, peak, end, tokens processed over all calls, compactions, cache rebuilds after pauses, and subagents with a high peak;
- **start load** — what was injected before any work: the skill listing (count, each skill's description length and whether it comes from the project, the user, a plugin or is built in), the agent listing, `CLAUDE.md` and its imports, MCP instructions, deferred tool lists;
- **what filled the context** — by category (tool results per tool, injected skill text, the user's messages, reminders, the model's own output — exact), by tool group (shell command, file read, subagent type), and the share that no transcript line explains;
- **biggest growth steps** — the jumps between two calls with their top causes;
- **files read more than once** in a session, and **single results** over 15,000 characters.

If the script finds no transcripts, it says where it looked; pass `--dir <folder>` if the user knows another location. No Node.js → say so and stop.

The script reads an internal, undocumented format. If a figure looks implausible, check the step in the transcript before building a finding on it, and say in **Not checked** what you could not verify.

## 2. Read the Sources

Read-only, as far as the findings need it:

1. `CLAUDE.md` / `AGENTS.md` and every file they import (`@path`) — size, and which parts every session needs versus parts only one task needs.
2. The skills and agents whose descriptions are longest (project ones in `.claude/skills/` and `.claude/agents/`, user ones in `~/.claude/`) — the description only, and whether the skill is meant to be started by the user alone (`disable-model-invocation: true` keeps a skill's description out of the listing).
3. The skill texts that were injected most (`injected: skill/command text`, `Skill:` groups) — their size and whether they pull reference files in on demand or carry everything inline.
4. The memory index (`MEMORY.md`) and nested memory files, if the start load shows them.
5. MCP servers and plugins — configured versus actually used in the sessions.

## 3. Diagnose

Go through the **cause catalogue** in order. Each cause names what to look for and the usual remedy; a cause the data doesn't show is skipped.

| # | Cause | Shows in the data as | Usual remedy |
|---|---|---|---|
| 1 | Crowded skill listing | a large skill listing share of the start load; many long descriptions; skills never used in the sessions | shorten long project/user descriptions to purpose + triggers; mark user-only skills `disable-model-invocation: true`; disable unused plugins |
| 2 | Long agent listing | agent descriptions with long prose | shorten project/user agent descriptions to when-to-use |
| 3 | Heavy always-on instructions | `CLAUDE.md` / imports / memory taking a big share of the start load | keep what every session needs; move task-specific detail into docs or skills that load on demand |
| 4 | Unused MCP servers | MCP instructions and tool lists in the start load, no calls to that server | disable the server for this project |
| 5 | Big tool results | single results over the threshold; build or test output without trimming; `cat` over many files; whole large files read | trim output in documented commands (quiet flags, tail, filters); read big files by section; split oversized docs |
| 6 | Persisted output read back whole | a Read of a `tool-results` file right after a large command | read the saved output by section or grep it, instead of reading it whole |
| 7 | Repeated reads | the same file read several times in one session | read once and keep notes; point to the relevant part |
| 8 | Large skill texts | big `injected: skill/command text` per use | progressive disclosure: a short SKILL.md that links reference files read only when needed |
| 9 | Heavy subagent reports | large `Agent result` groups | ask agents for a compact report (findings with paths, no file dumps) |
| 10 | Large outputs written in the main context | the model's own output as a big share, long Write inputs | generate long documents in a subagent, or in parts |
| 11 | Sessions that run on | peaks near the limit, compactions, many tasks in one session, huge processed totals | a fresh session per task or ticket; `/clear` between tasks; `/compact` with a focus |

Not a finding: the part of the start load the project can't change (system prompt, built-in tools); a big read that the task genuinely needed once; cache rebuilds after a pause (a cost note, not context size).

A **finding** has an ID (`B1` …), a severity (`high` — fills a large share of the window or forces compaction; `medium` — noticeable share in many sessions; `low` — small but cheap to fix), **evidence** (the script's numbers, a path), **impact** (what it does to the sessions), and **cost** (≈ tokens per session, and over the analyzed sessions — a start-load item counts once per session, plus once per model call in processed tokens). One finding per cause; seven at most, the rest as a count.

## 4. Propose

At most seven proposals, sorted by tokens saved per effort. Each one:

- **ID** (`V1` …) and a title;
- **change** — exactly what would be written or removed, specific enough to apply without asking again (the new description text, the section that moves where, the line for `CLAUDE.md`);
- **where** — the file path; **scope** — `project` (travels with the repository), `user` (the user's settings, skills or agents, all projects), `workflow` (a skill or agent file the project shares), or `machine`;
- **effort** — S, M or L; **gain** — ≈ tokens saved per session (start load) or per occurrence (growth), with the arithmetic in a few words;
- **risk** — what could get worse (a skill that triggers less reliably, a rule that's no longer always in view); **fixes** — the finding IDs.

Where a shorter and a fuller variant both make sense, give both in **change** and let the user pick. A proposal without a finding behind it doesn't belong here.

## 5. Report and Page

Write `findings.json` into the output folder:

```json
{
  "lang": "de",
  "title": "Kontextlast <project>",
  "headline": "one sentence: the main reason, in plain words",
  "summary": "two sentences: what fills the context and what would help most",
  "contextLimit": 200000,
  "findings": [{ "id": "B1", "title": "", "severity": "high", "evidence": "", "impact": "", "cost": "" }],
  "suspicions": ["one line each"],
  "proposals": [{ "id": "V1", "title": "", "change": "", "where": "", "scope": "project", "effort": "S", "gain": "", "risk": "", "fixes": ["B1"] }],
  "notChecked": ["what could not be verified, and why"],
  "replyExample": "V1, V2 – V4 small variant only"
}
```

`title` is the page's name, two to four words. Set `contextLimit` only if the window size is known for certain (the model id or the user says so); otherwise leave it out. Then render the page and publish it:

```bash
node <this skill's folder>/context-load.mjs render <output folder>
```

It writes `context-load.html`: the context curve per session (start, peak, compactions, limit), the make-up of the start load, what fills the context, the longest skill descriptions, the biggest jumps, repeated reads and big results, the findings and proposals. If the host can publish an HTML page (an Artifact tool or similar), publish that file as is, privately, with a one-sentence description, following the host's publishing rules; otherwise give its path.

Post the report in the chat, in this form and the chat language:

```
## Context load · <project> · <date>
Basis: <n> sessions, current session excluded · ≈ <ratio> tokens per character · Page: <link or path>

**Sessions:** start <median> · highest peak <n> · compactions <n> · start load from skills ≈ <n>

### Findings
| ID | Severity | Finding | Evidence | Cost |

### Suspicions
- one line each, or "none"

### Proposals
| ID | Change | Where | Scope | Effort | Gain | Fixes |

### Not checked
- one line each, or "none"
```

## 6. Ask for the Go-Ahead

Right below the report, in plain text: nothing has been changed; which proposals should be applied, and in which variant? The user answers in the chat — numbers (`V1, V3`), adjustments ("V2, but keep the trigger list"), or "none". Then stop and wait.

- An answer that leaves a proposal's exact change open → ask back in the chat, one short question, before touching anything.
- "None", or no answer → the run ends here; nothing gets written.

## 7. Apply

Only the confirmed proposals, exactly as confirmed:

- Look at each target file before changing it. A shortened description keeps the skill's purpose and its trigger words; moved content lands in its new place before it leaves the old one, and the old place points to it where sessions still need to find it.
- Settings files are merged: existing keys stay; only the confirmed entries change. The JSON must still parse afterwards.
- Documentation edits follow the file's language and style. If a change would contradict a project rule, stop that change and say so.
- Commit nothing; the user decides what goes into version control.

Close with a short list: what changed in which file, the start load expected afterwards (≈, from the gains), and how to see the effect — run `/agents-context-audit` again after a few sessions and compare the start load and the peaks.
