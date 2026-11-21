# Exercises

One exercise closes every lesson. Its job is to make the user use what the lesson just showed — predict, find, reason, apply — not to test their memory of its wording. Each form below has what it **trains**, how to **build** it, and what its **key** must hold.

## Rules for Every Exercise

- **One question**, answerable in a line or two or three sentences.
- **Answerable by thinking and reading** — from the lesson, the code it links, and what the user has seen in earlier lessons. Never only by running the code.
- **No trick** — the difficulty is in the reasoning, not in a catch in the wording. The question uses the domain's words.
- **The answer is not in the lesson text.** The lesson gives what is needed to work it out, never the result.
- **One right answer**, possibly put in many words. If two careful readers could defend different answers, rework it.
- **Depth scales the reach:** at depth 1 the answer lies in the shown excerpt; at depth 2 one call further; at depth 3 it may need a test, a caller, or the trade-off against an alternative.

## Forms

| Form | Trains | Build | Key |
|---|---|---|---|
| `predict` | reading code as a machine does | a concrete situation — input, state, a second user — and "what happens?" | the outcome in the user's words, and the line that decides it |
| `trace` | holding a path in mind | 4–6 steps of the station's flow (functions or layers), shuffled and lettered; "put them in order" | the order (`C A D B`), and which step the user most likely swaps |
| `find` | navigating the codebase | "where is it decided that …?" — a place outside the excerpt, findable in a few minutes with search; the hint names the folder | the path and function (any line in the deciding range counts) |
| `what-if` | seeing what a line protects | "what would break if line n said … instead?" — a plausible alternative, not a typo | the consequence in the domain's words, and who would notice it when |
| `transfer` | applying the pattern | "you want to add … — which places do you touch?" | the places that are required (1–3 core points), and those that are merely nice |
| `explain-back` | owning the idea | "explain in two sentences why …" — the lesson's central *why* | the 1–3 core points a good explanation contains |

**Choosing.** The form that fits the station best: `trace` for a path (stage 2), `predict` and `what-if` for a guard or a decision, `find` once the user knows the layout, `transfer` once the station's pattern has been seen twice, `explain-back` for a stated rule. Never the same form three lessons in a row; a review never uses its station's last form.

**Reviews.** A review exercise asks about the same station from a different angle — the same idea, a new situation. It is shorter: no new code beyond a line or two.

## Grading

By meaning, never by wording:

- **solid ✅** — every core point is in the answer, in any words. For `trace`: the exact order. For `find`: a place in the deciding range.
- **half ◐** — some core points; or `trace` with one adjacent pair swapped; or `find` in the right file but the wrong function; or any full answer after a hint.
- **again 🔁** — none of the core points, a wrong answer, or `idk`.

An answer that says more than the key is checked against the code; if it holds, it never costs anything — and if it contradicts the key, the code decides.
