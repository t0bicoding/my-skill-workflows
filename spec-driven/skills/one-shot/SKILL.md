---
name: one-shot
description: Shortcut for a bug fix, a small feature or another small change without the feature process - short interview, build and review on its own branch, one commit, merge after the user's OK. Usage - /one-shot <description>
disable-model-invocation: true
---

# One-Shot

## 1. Clarify

- If something is unclear, use the `interview` skill. Agree on the topic name first; the interview writes its files to `docs/interview/<topic>/`. They move along to the one-shot branch and are part of its commit.
- **Emergency brake:** if the change turns out bigger than expected (several slices, many open questions), recommend `/new-feature` instead. The user decides.
- Agree on a short topic name (kebab-case), if not done yet.

## 2. Build

- Own branch from the default branch: `git switch -c one-shot-<topic> <default>`. Note the branch the user was on. Uncommitted changes there are committed or stashed first, as the user decides ("Right branch first" in [feature-structure](../feature-structure/SKILL.md#rules-for-skills)).
- Run builder and reviewers as in [implement](../implement/SKILL.md) (steps 2–5, including the proposal for model, effort and review). There is no `scope.md`: the agreed change from the chat is the task, plus the interview files if there was an interview.
- If a decision comes up that holds beyond this change, propose an ADR; after the user's OK use the `write-adr` skill (with `adrs.md` of the interview folder, if there is one).

## 3. Review (optional)

Offer a review as in [human-review](../human-review/SKILL.md) ("In one-shot"): in the chat, without review folder and files. Fix the changes directly with builder and reviewers.

## 4. Project documents, only if affected

- new or changed domain terms → `maintain-glossary`
- changed structure (e.g. new modules) → `maintain-architecture`
- new commands, dependencies or conventions → `maintain-agents`
- change visible to users → `maintain-readme`

A plain bug fix usually changes none of them.

## 5. Finish

- Squash into one commit, e.g. `fix(<topic>): …` or `feat(<topic>): …`. Show the message first.
- After the user's OK, merge as in [merge](../merge/SKILL.md) (all commits of the branch go).
- Delete the one-shot branch and switch back to the branch the user was on before (restore a stash if one was made).
- Summarize in the chat what was built and what stayed open. No document of its own: the commit (with the interview files, if any) is the record.
