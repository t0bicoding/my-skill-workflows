---
name: tool-speed-audit
description: Finds out what makes tool calls slow in this project's Claude Code sessions — heavy builds and tests in the loop, permission waits, the auto-mode classifier, failed attempts and retries, sleeps, hooks, slow search and file I/O, environment drag — measured from the session transcripts, and proposes optimizations that make future sessions faster. The analysis is read-only and ends with a report in the chat plus an HTML page; only the proposals the user then confirms in a plain chat reply get applied. Use when sessions feel slow or tool calls take long; not for the app's own runtime speed — that's /performance-audit.
disable-model-invocation: true
---

You measure, explain and propose; you change nothing until the user has said in the chat what to change. The run has two phases: **analysis** (steps 1–5, read-only, ends with the report and the page) and **apply** (step 7, only what the user confirmed).

## Ground Rules

- **Read-only until confirmed.** Up to the report nothing changes — not in the project, not in the user's Claude Code settings, not on the machine. No builds, tests, installs or formatters to "check timing": they write caches and build folders, and the transcripts already hold the timings. Reading files, `git` read commands, and the bundled script are fine. The only files written are the script's output, the findings file and the page, all in a scratch folder outside the project.
- **No question dialogs.** Never use a question or choice tool (such as `AskUserQuestion`) in this skill. Every question and the confirmation happen as plain text in the chat, and the user answers in their own words.
- **Evidence, not hunches.** A finding stands on the script's numbers or a file you read. What you suspect but can't show is a **suspicion** and is listed separately.
- **Transcripts are private.** They hold everything ever typed or printed in this project. The report and the page carry metrics and shortened commands only (the script already shortens and masks obvious secrets); never quote prompt text, file contents or tool output. If a command line still shows something secret-looking, leave it out.
- **Safety never pays for speed.** No proposal disables permission checks wholesale, allows every command (`Bash(*)`), turns off a sandbox, skips tests in a gate, or weakens a project rule. Machine-level security settings (virus scanner exclusions and the like) are only ever described for the user to do; this skill never changes them.

## Start

`/tool-speed-audit [--sessions N | --days D | --session <id>]`
Default: the ten most recent sessions of this project, the current one excluded (it would measure itself). Pass the arguments through to the script.

Read the chat and documentation language from `CLAUDE.md` / `AGENTS.md` (default: English). The report, the page and the questions use the chat language.

## 1. Measure

Pick an output folder: the session's scratch directory if the host names one, else the system temp directory, under `tool-speed-audit/<YYYY-MM-DD>/`. Never inside the project. Then run from the project root:

```bash
node <this skill's folder>/tool-timing.mjs --out <output folder> [arguments]
```

It finds this project's transcripts (`~/.claude/projects/<project-path-slug>/`, or `$CLAUDE_CONFIG_DIR`), includes the subagent transcripts, and prints a compact summary; the full figures go to `data.json`. What it measures:

- **time split** per session — tool time, waiting for approval, waiting for the user's answers, model time, subagents;
- **command groups** — every shell command reduced to its program and subcommand (`npm test`, `dotnet build`, `pwsh build.ps1`), with count, total, median, p90, max, errors and prompts; other tools by name;
- **slowest single calls**, **failed attempts followed by a retry**, **sleeps and polling**;
- **permission path** — median tool time per way a call got approved (config rule, mode, auto-mode classifier, user prompt);
- **hooks and settings** — hook events seen in the transcripts, configured hooks, status line, number of allow/deny rules per settings file.

A call's time runs from the end of the model reply to the tool result. If the script finds no transcripts, it says where it looked; pass `--dir <folder>` if the user knows another location. No Node.js → say so and stop: timings from memory are not an analysis.

The script reads an internal, undocumented format. If a figure looks implausible (a tool whose median is minutes), check two or three of its calls in the transcript before building a finding on it, and say in **Not checked** what you could not verify.

## 2. Read the Environment

Read-only, as far as present:

1. `CLAUDE.md` / `AGENTS.md` — the documented build, test and lint commands; whether quicker loops (a filtered test run, an incremental build, one package) are documented next to the full gates; shell and platform notes.
2. The settings files the script listed — hooks (event, matcher, command, async), the status line command, permission rules and default mode.
3. `.gitignore` and the large untracked folders (`git status --porcelain --ignored`, `git count-objects -vH`) — what search tools have to wade through.
4. Shell startup: whether shell commands run a profile (for PowerShell, the size of `$PROFILE`; for bash, `~/.bashrc`) — it runs before every shell call.
5. Platform signs in the data: Windows with uniformly slow small file operations hints at a virus scanner or a synced folder (OneDrive, network drive) — the project path tells you which.

## 3. Diagnose

Go through the **cause catalogue** in order. Each cause names what to look for in the data and the usual remedy; use it to recognize, not to fill quotas — a cause the data doesn't show is skipped.

| # | Cause | Shows in the data as | Usual remedy |
|---|---|---|---|
| 1 | Heavy gate in the loop | a build, test or publish group with high median that runs often, or a full gate run where one project would do | document a quick loop next to the full gate (filter, single project, incremental, no bundling); full gate stays the final proof |
| 2 | Permission waits | prompts per group, approval time in the split | allow rules for the frequent read-only or project-local commands, narrowly written; `/fewer-permission-prompts` if the host offers it |
| 3 | Classifier latency | the classifier path's median clearly above the config/mode paths over many calls | allow rules for the most frequent safe commands, so they skip the classifier |
| 4 | Failed attempts | retries after errors — wrong shell syntax, wrong path, missing tool, wrong working directory | one line in `CLAUDE.md` / `AGENTS.md` naming the right way, or a script that wraps it |
| 5 | Sleeping and polling | sleep / `Start-Sleep` calls, waiting loops | background run with notification, a readiness check instead of a fixed sleep |
| 6 | Timeouts and aborts | aborted or timed-out calls | run in the background, split the work, or a deliberate longer timeout |
| 7 | Hooks and status line | hook events on frequent tools, a hook or status line command that is slow | narrower matcher, async hook, a faster command |
| 8 | Search and file I/O | Grep/Glob/Read with medians above about a second | ignore entries for big generated folders, scoped search paths |
| 9 | Shell startup | every shell call slow by a similar fixed amount | a lean shell profile, or a no-profile flag in documented commands |
| 10 | Network tools | WebFetch/WebSearch/MCP groups with long medians or errors | local docs for what is fetched again and again; drop an MCP server nobody uses |
| 11 | Environment drag | Read/Edit/Write and small commands slow across the board, without prompts | machine-level: scanner exclusions for project and tool folders, move off a synced drive — described for the user, never done by this skill |

Not a finding: a long call that is long by nature and rare (one release build per session), time the user spent answering questions, time subagents spent working in parallel.

A **finding** has an ID (`B1` …), a severity (`high` — costs minutes per session or blocks work; `medium` — noticeable; `low` — small but cheap to fix), **evidence** (group, count, total, median — the script's numbers), **impact** (what the user feels), and **cost** (time over the analyzed sessions and per session). One finding per cause; five slow test commands from one missing quick loop are one finding. Seven findings at most; the rest go into the report as a count.

## 4. Propose

At most seven proposals, sorted by gain per effort. Each one:

- **ID** (`V1` …) and a title;
- **change** — exactly what would be written, specific enough to apply without asking again (the rule text, the line for `AGENTS.md`, the hook change);
- **where** — the file path; **scope** — `project` (travels with the repository), `user` (the user's Claude Code settings, all projects), `machine` (outside Claude Code, done by the user), or `workflow` (a skill or agent file);
- **effort** — S, M or L; **gain** — the time it would save, derived from the data, with the arithmetic in a few words ("12 runs × ≈ 40 s");
- **risk** — what could get worse; **fixes** — the finding IDs.

Prefer `project` scope where the cause is the project's; `user` scope only for what applies to every project. A proposal without a finding behind it doesn't belong here.

## 5. Report and Page

Write `findings.json` into the output folder:

```json
{
  "lang": "de",
  "title": "Tool-Tempo <project>",
  "headline": "one sentence: the main cause, in plain words",
  "summary": "two sentences: where the time goes and what would help most",
  "findings": [{ "id": "B1", "title": "", "severity": "high", "evidence": "", "impact": "", "cost": "" }],
  "suspicions": ["one line each"],
  "proposals": [{ "id": "V1", "title": "", "change": "", "where": "", "scope": "project", "effort": "S", "gain": "", "risk": "", "fixes": ["B1"] }],
  "notChecked": ["what could not be verified, and why"],
  "replyExample": "V1, V3 – V2 only for this project"
}
```

`title` is the page's name, two to four words. Then render the page and publish it:

```bash
node <this skill's folder>/tool-timing.mjs render <output folder>
```

It writes `tool-speed.html`: the time split per session, the slowest command groups, the permission paths, the slowest calls, the findings and proposals, all drawn from the data. If the host can publish an HTML page (an Artifact tool or similar), publish that file as is, privately, with a one-sentence description, following the host's publishing rules; otherwise give its path.

Post the report in the chat, in this form and the chat language:

```
## Tool speed · <project> · <date>
Basis: <n> sessions (<period>), <n> tool calls, current session excluded · Page: <link or path>

**Where the time goes:** tools <t> · waiting for approval <t> · your answers <t> · model <t> · subagents <t>

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

Right below the report, in plain text: nothing has been changed; which proposals should be applied? The user answers in the chat — numbers (`V1, V3`), adjustments ("V2, but only for npm"), or "none". Then stop and wait.

- An answer that leaves a proposal's exact change open → ask back in the chat, one short question, before touching anything.
- "None", or no answer → the run ends here; nothing gets written.
- A proposal of scope `machine` is never applied — confirming it means the user gets step-by-step instructions to do it themselves.

## 7. Apply

Only the confirmed proposals, exactly as confirmed:

- Look at each target file before changing it. Settings files are merged: existing rules, hooks and keys stay; only the confirmed entries are added or changed. The JSON must still parse afterwards.
- Documentation edits follow the file's language and style; a project rule that a change would contradict stops that change — say so instead.
- Verify each change cheaply: the file parses, a new allow rule matches the commands it is meant for, a changed hook's command still runs. Don't run the heavy gates to "prove" a speed-up.
- Commit nothing; the user decides what goes into version control.

Close with a short list: what changed in which file, what is left for the user (machine-level steps, with instructions), and how to see the effect — run `/tool-speed-audit` again after a few sessions and compare the groups that were addressed.
