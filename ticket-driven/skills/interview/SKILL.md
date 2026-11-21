---
name: interview
description: Interviews the User until a saturation of a shared understanding is reached.
---

## Preparation

**User invoked:**
Take the context of the current chat, an file or markdown a user told you or if there isn't a context then ask the user for a description.

**Skill invoked:**
If skill invoked, take the context which is giving you and the context of the current session.

## Question Rounds

Work the tree in rounds. The frontier is every decision whose prerequisites are already settled: the questions you can ask now without guessing at answers you haven't heard yet. Ask the whole frontier in one round: number each question and give your recommended answer. Then wait for the user's answers before the next round.

Each round the user answers reshapes the tree: settled decisions push the frontier outward and unblock questions that depended on them. Recompute the frontier and ask the next round. A question whose answer depends on another question still open in this round belongs to a later round, not this one.

Finding facts is your job, never the user's. When a frontier question needs a fact from the environment (filesystem, tools, etc.), dispatch the Scout Subagent [scout.md](../../agents/scout.md) to find it; don't ask the user for anything you could look up yourself. Don't block on it: a running scout is an unsettled prerequisite, so only the questions downstream of it wait for it to report; ask the rest of the frontier now. The decisions are the user's: put each to them and wait.

## Questions Structure

Every Round of Questions has the following format:

❓ **Q1** - **<Question title>**: <Question body, might be multiple paragraphs>
➡️ A: <Answer option>
➡️ B: <Answer option>
⭐ <Recommended Answer> — <why do you recommend it>

---

❓ **Q2** - **<Question title>**: <Question body, might be multiple paragraphs>
➡️ A: <Answer option>
➡️ B: <Answer option>
⭐ <Recommended Answer> — <why do you recommend it>

---

## Final Step

If you reached a saturation in which you feel an shared understanding then give the user a summary of the decision made. And wait until the user confirms the decisions.

**User invoked:**
If user invoked, then ask the user if he wants the decisions marked done somewhere in the project.

**Skill invoked:**
If skill invoked, then continue with the next steps of the skill.
