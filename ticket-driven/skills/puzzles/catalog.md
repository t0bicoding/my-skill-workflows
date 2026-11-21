# Catalog

The themes puzzles draw from, grouped. Each theme has a **slug** (used in `progress.md` and as a focus), the **forms** a setter may build, and its **heuristic** — the review question that catches the whole theme. Groups are in catalog order: a new player meets every group before a theme repeats.

A setter adapts the form to the project's stack and idiom: `pytest.mark.skip` in Python, `it.skip` in Jest/Vitest, `#[ignore]` in Rust, `@Disabled` in JUnit. A theme the stack can't express is skipped.

Every puzzle has exactly one answer line. A theme whose flaw lies outside the change (a caller not updated) shows that caller in the puzzle, so the answer is still a line the user can see.

## Group 1 — `tests`: Gamed Tests

The checks went green, but not because the code is right — the most common way broken code, and AI-written code above all, gets through review: the reviewer sees green checks and a test in the diff and reads no further.

| Slug | Forms | Heuristic |
|---|---|---|
| `weakened-assertion` | exact value → truthy / non-null / `contains` / type check; tolerance widened; list compared by length only; status checked, body not | Does this assertion still fail for the wrong answer? |
| `expectation-follows-bug` | expected value, fixture or snapshot changed to the new output, while the intent says the behavior stays | Did the requirement change, or only the output? |
| `disabled-test` | skip / xfail / `only` / commented out / deleted / renamed so the runner no longer collects it | Is every silenced test covered by a reason in the intent? |
| `mocked-subject` | the unit under test, or the function the bug lives in, is mocked; the assertion checks the mock | Is anything real left between the input and the assertion? |
| `cannot-fail` | no assertion; assertion in a `catch` never reached; loop over an empty fixture; promise not awaited; assertion in a callback that never runs | What would you have to break to make it fail? |
| `test-aware-code` | production branch on a test env var, a hard-coded test input, a special case matching the fixture exactly | Why would production code need to know this value? |
| `swallowed-error` | `try/except: pass`, empty `catch`, broad catch returning a default — added in production code so a test passes | What happens to the error now, and who finds out? |
| `weakened-gate` | coverage threshold lowered, lint rule or type check disabled, CI step removed or `continue-on-error`, timeout raised, retries on a flaky test | Which check got weaker, and what would it have caught? |
| `test-and-code-agree-wrongly` | code and test changed together, both computing the same mistake | Check the expected value against the requirement, not the code. |
| `fixture-hides-case` | test data changed so the edge case the test's name promises no longer occurs | Does the data still contain the case the name promises? |

## Group 2 — `correctness`

| Slug | Forms | Heuristic |
|---|---|---|
| `boundary` | `<` vs `<=`, off-by-one in a range or slice, first/last element, empty input | What happens at zero, one, and the limit? |
| `inverted-logic` | negated condition, `and`/`or` swapped, early return on the wrong branch | Read the condition aloud in the domain's words — is that the rule? |
| `null-empty` | absent value unhandled, `0` / `""` / `[]` treated as absent | Which inputs can be absent, and what does absent look like here? |
| `wrong-variable` | copy-paste with one name not changed, shadowing, right field from the wrong object | In repeated blocks, does every line use its own variables? |
| `async-misuse` | missing `await`, fire-and-forget, wrong order of awaited steps | When does this actually run, and who waits for it? |
| `numbers-and-time` | float for money, integer division, rounding, naive vs aware datetime, local vs UTC, unit mix-up | What unit, precision and zone does each side have? |
| `ordering-assumption` | relies on set / dict / query order without `ORDER BY`, first match taken | Who guarantees this order? |

## Group 3 — `data`: State and Persistence

| Slug | Forms | Heuristic |
|---|---|---|
| `lost-update` | read-modify-write without lock or version; check-then-act | What if two people do this at the same time? |
| `transaction-boundary` | two writes that belong together in two transactions; commit before the step that can fail | If it fails halfway, what state is left? |
| `destructive-migration` | column dropped or renamed without copying data, type narrowed, lossy downgrade | What happens to the rows that already exist? |
| `cascade-reach` | new cascade delete, bulk delete without filter, cleanup removing more than asked | What else goes when this goes? |
| `cache-staleness` | cache key missing a parameter, no invalidation after a write, caching what others change | Who else writes this, and when does this reader see it? |
| `not-idempotent` | retry or double-click creates duplicates | What if this runs twice? |

## Group 4 — `security`

| Slug | Forms | Heuristic |
|---|---|---|
| `injection` | SQL, shell, path, regex or HTML built from input | Where does each piece of this string come from? |
| `path-traversal` | path joined from input or stored data without bounding it | Can this path leave its folder? |
| `missing-authz` | new branch or endpoint without the check its siblings have | Who may do this, and where is that enforced? |
| `trusted-input` | identity, role, price or ID taken from the request where the server should know it | Would the server accept a lie here? |
| `leaking-data` | secret or personal data in logs, error messages, URLs, responses | Who can read where this ends up? |

## Group 5 — `operations`: Errors and Running

| Slug | Forms | Heuristic |
|---|---|---|
| `error-hidden` | error logged and swallowed, generic message replacing the cause, success status on failure | When this fails in production, who notices — and finds why? |
| `unbounded-wait` | no timeout on I/O or lock, retry loop without limit | What is the longest this can take? |
| `resource-leak` | file, connection or lock not released on the error path | Is it released when the middle line throws? |
| `misleading-message` | message names the wrong cause or advises the wrong action | Would the user do the right thing after reading this? |

## Group 6 — `intent`: Contract and Scope

| Slug | Forms | Heuristic |
|---|---|---|
| `does-not-match-intent` | the code does something else, or less, than its intent says | Tick off the intent's claims in the change. |
| `silent-contract-change` | a public function, response, format or default changes for existing callers | Who else calls this, and do they know? |
| `smuggled-change` | an unrelated line among the announced change — a constant, a default, a removed check | Does every line belong to the intent? |
| `untouched-caller` | function changed, a caller shown beside it not updated | Search for the other users of what changed. |

## Group 7 — `design`: Maintainability

Only flaws a reviewer can prove, never taste — a puzzle needs one answer.

| Slug | Forms | Heuristic |
|---|---|---|
| `lying-name` | name or comment says something the code no longer does | Does the name still tell the truth after this change? |
| `dead-code` | a branch that can't be reached, a flag that is always true | Can this line ever run? |
| `duplicate-helper` | re-implements a helper the project has (the puzzle names it in a context line) | Does the project already know how to do this? |

## Group 8 — `house-rules`: the Project's Own Rules

Built from what the project writes down — rules in `CLAUDE.md` / `AGENTS.md`, ADRs, documented conventions. A setter picks one stated rule, breaks it once where it applies, and puts the rule's source in the key. This is what makes the puzzles this project's: a generic reviewer can't know these.

| Slug | Forms | Heuristic |
|---|---|---|
| `rule-<short-name>` | one violation of one stated rule — the slug names it, e.g. `rule-utc-time` | Which of this project's rules apply to these lines? |

A project without written rules has no group 8.

## Decoys

Correct lines that imitate a theme — clean puzzles are built from them, harder ones carry them beside the flaw:

- a test removed together with the feature it tested, and the intent says so;
- an expected value changed because the intent changes the requirement;
- a mock replacing a slow or external dependency, not the subject;
- a broad `catch` at a top-level boundary that logs, reports and re-raises;
- a narrow lint suppression with a comment naming a real reason;
- an apparent off-by-one that is right because the range is exclusive.

## Puzzle Ratings

| Rating | Lines | Decoys | The flaw |
|---|---|---|---|
| below 900 | up to ~12 | 0 | in the theme's textbook form, in a changed line |
| 900–1299 | up to ~18 | 1 | in a changed line, among legitimate changes |
| 1300–1699 | up to ~25 | 1–2 | subtle: right-looking code, the intent steers elsewhere |
| 1700 and up | up to ~25 | 2 | proving it takes the project's knowledge — a rule, a caller, a domain fact named in a context line |

A clean puzzle's rating is how convincing its decoys are.
