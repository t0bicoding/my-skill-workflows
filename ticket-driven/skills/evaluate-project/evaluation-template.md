# Evaluation Template

The fixed form of every `/evaluate-project` report. Same sections, same order, same tables every
time — so two reports on the same project, months apart, can be laid side by side.

## Rules

- **Every section appears**, even when empty. Something that couldn't be measured gets
  `not collected — <reason>`, never a silently dropped row.
- **Sections 1–2 hold facts only**: numbers from `collect-stats.sh`, or something read in a named
  file. No adjectives that judge ("good", "too many"). Judgement starts at section 3.
- **Every rating and every weakness names its evidence**: a number from sections 1–2, a
  `path:line`, or a file. A rating without evidence is not given — write `–` and why.
- **Numbers are copied, not rounded into prose.** "59,328 lines" — not "about 60k".
- **Solutions appear only in section 6.** Sections 1–5 describe; section 6 proposes. Every
  recommendation points back to at least one weakness from section 4 — none stands on its own.
- Labels (headings, table columns, ratings' words) in the chat language the project sets in
  `CLAUDE.md` / `AGENTS.md` (default: English). Paths, commands and code identifiers stay as
  they are.
- Placeholders in `<angle brackets>` are replaced; nothing in angle brackets survives into the
  report.

## Rating scale

Used in section 3. One scale for every dimension:

| Score | Meaning                                                                              |
| ----- | ------------------------------------------------------------------------------------ |
| 5     | Exemplary — would hold up as a reference for other projects; no weakness found here. |
| 4     | Solid — isolated weaknesses, none with a High severity.                              |
| 3     | Adequate — works, but weaknesses visibly cost time or risk; at most one High.        |
| 2     | Weak — several weaknesses, or one High that affects most of the codebase.            |
| 1     | Critical — the dimension is missing or works against the project.                    |

## Severity

Used in section 4:

- **High** — causes, or is likely to cause, wrong behavior, data loss, a security exposure, or
  blocks further development of a whole area.
- **Medium** — costs noticeable time on every change in an area, or makes a High likely later.
- **Low** — friction or inconsistency with no foreseeable damage.

## Value and effort

Used in section 6. Value is what the recommendation removes, effort what it costs to do:

| Value  | Meaning                                                   |
| ------ | --------------------------------------------------------- |
| High   | Resolves a High weakness, or several Mediums at once.     |
| Medium | Resolves one Medium, or makes a High clearly less likely. |
| Low    | Resolves Lows only.                                       |

| Effort | Meaning                                                                     |
| ------ | --------------------------------------------------------------------------- |
| S      | Hours; one area, no decision needed.                                        |
| M      | A few days; one area, or a small decision.                                  |
| L      | A week or more; several areas, or a decision the project has to make first. |

Order: highest value first; on equal value, lower effort first.

<evaluation-template>

# Project evaluation: <project name>

<date> · commit `<short hash>` on `<branch>` · scope: `<whole repository | path>`
<one line if the working tree has uncommitted changes: "Working tree: N uncommitted, M untracked
files — not part of this evaluation.">

## 1. Profile

| Field              | Value                                                            |
| ------------------ | ---------------------------------------------------------------- |
| Purpose            | <one sentence, from README / agent docs — quoted source>         |
| Kind               | <web app, CLI, library, desktop app, service, monorepo …>        |
| Languages          | <main languages with their line share, from "by extension">      |
| Frameworks         | <main frameworks with major version, from the manifests>         |
| Runtime / delivery | <how it runs or ships: container, installer, package registry …> |
| Age                | <first commit> → <last commit> (<N> days, <M> active days)       |
| Contributors       | <count> (<top contributor share in %>)                           |
| Releases           | <tag count>, latest `<tag>`                                      |

## 2. Statistics

### Size

| Metric                        | Value                          |
| ----------------------------- | ------------------------------ |
| Tracked files                 | <n> (<binary or empty>)        |
| Own text lines                | <n> in <files> files           |
| Production code               | <lines> lines in <files> files |
| Test code                     | <lines> lines in <files> files |
| Test-to-production line ratio | <ratio>                        |
| Generated / lockfiles (excl.) | <lines> lines in <files> files |

**By language** (top 8): <ext> <lines> · <ext> <lines> · …

**Largest own files:** the top 5 from the stats, `path` (<lines>), one per line.

### Activity

| Metric                      | Value                       |
| --------------------------- | --------------------------- |
| Commits total               | <n> (<merges> merges)       |
| Last 30 / 90 / 365 days     | <n> / <n> / <n>             |
| Conventional-commit share   | <n> / <total> (<%>)         |
| Commit types                | <type n · type n · …>       |
| Commits per month (last 12) | <YYYY-MM n · YYYY-MM n · …> |

**Hotspots** (most-changed files, last 12 months): top 5, `path` (<changes>).

### Quality infrastructure

| Area          | Found                                                                 |
| ------------- | --------------------------------------------------------------------- |
| Tests         | <frameworks, test locations, E2E yes/no>                              |
| Type checking | <tool and strictness, or none>                                        |
| Lint / format | <tools, or none>                                                      |
| CI            | <file; what it runs — or none>                                        |
| Local hooks   | <pre-commit / pre-push and what they run — or none>                   |
| Dependencies  | <direct / dev count per manifest; lockfile yes/no; pinned yes/no>     |
| Documentation | <README, agent docs, ADR count, CHANGELOG, LICENSE — present/missing> |

### Debt markers

| Marker                    | Count (files) |
| ------------------------- | ------------- |
| TODO / FIXME / HACK       | <n> (<files>) |
| Lint suppressions         | <n> (<files>) |
| Type-check suppressions   | <n> (<files>) |
| Skipped tests             | <n> (<files>) |
| Panics / unwrap           | <n> (<files>) |
| Broad or empty catch      | <n> (<files>) |
| Secret-like tracked files | <n — names>   |

## 3. Assessment

<Two to four sentences: the overall picture — what the project is good at, where it stands, what
holds it back most. No new facts here; everything refers back to sections 1–2 or 4.>

| Dimension                      | Score | Evidence (short)                 |
| ------------------------------ | ----- | -------------------------------- |
| Architecture & structure       | <1–5> | <fact or path backing the score> |
| Code quality & maintainability | <1–5> | <…>                              |
| Tests & quality gates          | <1–5> | <…>                              |
| Documentation & knowledge      | <1–5> | <…>                              |
| Dependencies & delivery        | <1–5> | <…>                              |
| Activity & process             | <1–5> | <…>                              |
| Security & operations hygiene  | <1–5> | <…>                              |

**Strengths** — three at most, each one line with its evidence:

- <strength> — <evidence>

## 4. Weaknesses

Sorted High → Medium → Low; ten at most. Each one with evidence and impact — no fix, no ticket.

### W1 · <High | Medium | Low> · <short title>

- **Dimension:** <one of the seven from section 3>
- **Evidence:** <`path:line`, number from section 2, or file — concrete enough to check>
- **Impact:** <what it costs or risks, for whom, when>

### W2 · …

**Suspicions** (no evidence found yet — not counted as weaknesses), one line each:

- <suspicion> — <what would confirm it>

## 5. Coverage

- **Collected:** <stats script; files read (manifests, CI, README, …); areas sampled>
- **Not checked:** <what stayed outside: runtime behavior, tests not run, dependency CVEs,
  areas not read — each with the reason>

## 6. ⭐ Recommendations

Five at most, sorted by value (see "Value and effort"). Proposals, not decisions: each one names
what can be turned up or down, so it can be adapted before anything is done. No tickets in the
report — whether recommendations become a feature is asked after it (SKILL.md › Hand-off).

| #   | Recommendation | Resolves | Value             | Effort      |
| --- | -------------- | -------- | ----------------- | ----------- |
| R1  | <short title>  | <W1, W3> | <High/Medium/Low> | <S / M / L> |
| R2  | …              | …        | …                 | …           |

### R1 · <short title>

- **What:** <the change in one or two sentences — concrete enough to start, not a plan>
- **Why first:** <what it removes, referring to the weaknesses it resolves; why it beats the next one>
- **Adjust:** <the knob — smallest version that already pays off (and its effort) · fuller version
  (and its effort) · what it depends on or would conflict with (an ADR, a rule, another R)>
- **Open:** <questions that must be answered before building — the variant to pick, an ADR to
  revisit, a suspicion to confirm — each with its kind (Brainstorming, Prototype, Research, ADR);
  "none" if it can be built as described>

### R2 · …

**Left out:** <weaknesses from section 4 without a recommendation, one line each with the reason —
too costly for its value, a deliberate decision, or needs a suspicion confirmed first; "none" if
every weakness is covered>

</evaluation-template>
