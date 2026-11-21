---
name: security-audit
description: Audits the standing codebase for evidenced security vulnerabilities and turns the findings into a new feature — spec plus implementation tickets, ready for /implement. Use to search an area or the whole codebase for security issues; not for fixing them (that's a later /implement run) and not for reviewing a diff (that's the reviewer subagents inside /implement).
disable-model-invocation: true
---

You read and document; the code itself changes in a separate run (`/implement` against the feature this skill produces, `/clarify-ticket` first for any open question). This run ends with a feature folder holding the findings — not a fix.

A **finding** is a vulnerability with a **trigger**: the concrete input, request, or state where the code is provably exploitable, plus file and line. Without a trigger it's a **suspicion** — collected and listed separately. Keep the line sharp: a list where one suspicion sits as a finding is a list nobody trusts again.

## Preparation

`/security-audit <area>`
If the user names an area ("audit the auth path"), every beat below lives inside it. If they name nothing, the whole codebase is in scope.

Read the ADRs under `docs/adr/` that touch the area, and the rules in CLAUDE.md/AGENTS.md — the *Vulnerable Dependencies/Config* class lives partly on these, and the hunters get no other access to them. Also read `CONTEXT.md`, or the relevant file via `CONTEXT-MAP.md` in a multi-context repo, for the area's domain vocabulary.

## Stake Out the Beats

A **beat** is an area times one security class, sized to a single context window — the server's auth path times *Broken Access Control* is one beat, the same path times *Sensitive Data Exposure* a second. Cut so each hunter carries one class in mind, not all seven.

Write the beats as a numbered list before sending anyone out. This list is your completion criterion: **the audit is done when every beat has its report** — not when enough findings are in hand.

## Security Classes

The fixed set beats get cut from. Each class reads as _what to look for_ → _how to recognize it_; hand the hunter their class verbatim.

- **Injection**: user-controlled input reaches an interpreter, query, or shell unsanitized. → SQL/NoSQL built by string concatenation, shell exec with unescaped input, template injection, unsafe deserialization of untrusted data.
- **Broken Authentication/Session**: identity or session handling doesn't hold. → Predictable or long-lived tokens, missing session invalidation on logout or password change, credentials carried in a URL, a weak password-reset flow.
- **Broken Access Control**: an action or object is reachable without the check it needs. → Missing authorization on an endpoint or object id (IDOR), privilege escalation via a role or parameter, path traversal, trusting a client-supplied role or ownership claim.
- **Sensitive Data Exposure**: secrets or PII travel where they shouldn't. → Plaintext secrets in logs, config, or the repo; missing encryption in transit or at rest; secrets surfacing in error messages or stack traces; PII sent to a third party or analytics tool.
- **Cryptographic Misuse**: crypto primitives used wrong. → Hardcoded keys or IVs, a weak or deprecated algorithm (MD5/SHA1 for passwords), home-grown crypto, predictable randomness for tokens or nonces.
- **SSRF/Unsafe External Calls**: a server-side request is driven by untrusted input. → A user-supplied URL fetched server-side without an allowlist, redirects followed blindly, an internal or metadata endpoint reachable from user input.
- **Vulnerable Dependencies/Config**: the supply chain or deployment config is the hole. → Outdated packages with known CVEs, debug mode or verbose errors in production, default credentials, permissive CORS/CSP, an exposed admin or debug endpoint.

## Send the Hunters

Launch one instance of the Hunter Subagent [hunter.md](../../agents/hunter.md) per beat, all **in a single message** so they run in parallel. It reads only — no worktree, same tree.

Give each one its beat: the paths and the **one** class, verbatim from Security Classes, plus the promises from Preparation that touch it. Let each report.

## Cross-Check

Hunter reports are raw material, not findings. Launch one instance of the Verifier Subagent [verifier.md](../../agents/verifier.md) per reported finding, all **in a single message** so they run in parallel — give each only that finding's Title, Trigger, and Location, never the hunter's own reasoning. A downgraded verdict makes the finding a suspicion instead of dropping it.

Then, yourself:

- **Merge duplicates.** Two beats hitting the same spot from two directions is one finding with two angles.
- **Check it against the tests.** A green test that should already cover that spot means either the finding is wrong or the test is blind — say which.

You're done when **every reported finding** has been through a verifier and the two checks above.

## Present the Findings

Sort by severity, in this order:

1. **Critical** — exploitable remotely, without authentication, toward full compromise (RCE, auth bypass, unrestricted admin access).
2. **High** — exploitable with limited preconditions (an authenticated user, a specific config), significant data exposure or privilege escalation.
3. **Medium** — exploitable only under narrow conditions, or leaks non-sensitive information.
4. **Low** — a hardening gap or defense-in-depth issue with no direct exploit path found.

Present the list, the suspicions below it in one line each, plus the coverage ("beats searched: …"). Propose the feature's **slug** — short, English, kebab-case, ASCII — and get it confirmed together with which findings go in: the user decides.

**No finding is a valid result too.** Report the coverage and the suspicions, and create **no** feature.

## Create the Feature

Create the feature folder `docs/features/<slug>/`, exactly like `/new-feature` — minus its interview and user-story rounds: the findings are already evidenced, there's nothing left to ask.

Write `specifications.md` with the `/write-spec` skill. The findings fill it as:

- **Problem Statement** — what the vulnerability exposes the user or system to today, from an attacker's perspective, not the code's.
- **User Stories** — per finding, the behavior that holds once it's fixed.
- **Out of Scope** — what's explicitly not part of this feature, especially any refactor beyond the individual fix.
- **Further Notes** — the suspicions and the audit's coverage.

Then write the implementation tickets straight into `tickets/implementation/` (create the folder if it doesn't exist) with [implementation-ticket-template.md](../approval/implementation-ticket-template.md), one ticket per finding, in the tracer-bullet cut from `/approval`: a vertical slice per ticket, the finding's trigger is its test case, the one the slice turns green on. Each finding's ticket is independent unless one finding's fix genuinely depends on another's — default "Blocked by" to "None (can start immediately)". Write both `specifications.md` and the tickets in the documentation language set in CLAUDE.md/AGENTS.md (default: English).

If a finding raises a genuine open question ("is this even exploitable, or intended behavior?"), it goes **first** into a clarification ticket of type Brainstorming via `/write-clarification-tickets` — not into an implementation ticket.

## Final Step

Commit the new feature on the current branch. Never push — pushing is the user's call alone.
Report where the feature landed and list the tickets created. If clarification tickets exist, give the user the ready-to-paste command for the next chat: `/clarify-ticket <feature> <NN>` (first open ticket); otherwise give them `/implement <feature NN | NN-NN | all>`.
