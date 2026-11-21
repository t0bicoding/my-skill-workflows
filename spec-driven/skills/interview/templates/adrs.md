# ADRs

Not the ADRs themselves: the list of ADRs this interview adopts. Once the user agrees, `write-adr` creates or updates them in `docs/adrs/`.

## Why these are ADRs

{All three criteria must apply. ✅ = applies.}

| ADR | Hard to reverse | Surprising without context | Real trade-off |
|---|:-:|:-:|:-:|
| {Store sessions in the database} | ✅ | ✅ | ✅ |

## New

- **{Title}:** {decision in one line}
  - **Reason:** {why it matters beyond this slice}
  - **Topic:** [{topic}]({topic}.md) {the topic file where the decision was made, if any}
  - **ADR:** [{NNNN}-{title}]({relative path to docs/adrs/}{NNNN}-{title}.md) {after write-adr; from a slice the path is `../../../../../adrs/`}

## Changed

- **[{NNNN}: {title}]({relative path to docs/adrs/}{NNNN}-{title}.md):** {what changes}
  - **Kind:** {clarification (edited in place) | changed decision (new ADR, old one becomes "Replaced by") | no longer valid (status "Inactive")}
  - **Reason:** {why}
