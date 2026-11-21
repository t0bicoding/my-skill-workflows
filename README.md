# my-skill-workflows

Sammlung von zwei Entwicklungs-Workflows für [Claude Code](https://claude.com/claude-code), aufgebaut aus Skills (und Subagents). Beide führen ein Vorhaben strukturiert von der Idee über Planung und Umsetzung bis zum Abschluss und halten die Projektdokumentation dabei aktuell.

## Workflows

### `spec-driven/`

Ein Workflow, der Features über eine Spezifikation und vertikale Slices plant und umsetzt.

- **Planung:** Ein Feature wird in Interview-Runden aus Nutzersicht beschrieben (`/feature`) und in eine Spezifikation sowie eine Roadmap aus Slices überführt.
- **Umsetzung:** Pro Slice werden die technischen Entscheidungen geklärt und ein Scope geschrieben (`/slice`), dann von einem Builder- und Reviewer-Subagent umgesetzt (`/implement`).
- **Abschluss:** Slices und Features werden abgeschlossen, gemergt und die Projektdokumente (README, AGENTS, Architektur, Glossar, Roadmap, ADRs) nachgezogen.
- **Abkürzungen:** `/fast-lane` für ein ganzes Feature auf einmal, `/one-shot` für kleine Änderungen und Bugfixes.

### `ticket-driven/`

Ein Workflow, der Features in Klärungs- und Implementierungs-Tickets zerlegt und abarbeitet.

- **Planung:** Ein Feature wird per Brainstorming/Interview zu einer Spezifikation ausgearbeitet; offene Punkte werden als Klärungs-Tickets gelöst (Brainstorming, Prototyp, Recherche, ADR).
- **Umsetzung:** Die fertige Spezifikation wird in Implementierungs-Tickets mit Abhängigkeiten aufgeteilt und per Build-und-Review-Schleife umgesetzt.
- **Abkürzungen:** `/quick` für kleine, klare Änderungen, `/feature-light` für mittelgroße Vorhaben.
- **Zusätzlich:** Audits (Bugs, Security, Performance, Refactoring, Usability), Hilfen zum Verstehen des Codes (Erklärungen, Lektionen, Review-Puzzles) und Pflege der Projektdokumentation. Mitgelieferte Subagents liegen unter `agents/`.

## Struktur

```
spec-driven/
  skills/        # Skills des spec-driven Workflows
ticket-driven/
  skills/        # Skills des ticket-driven Workflows
  agents/        # zugehörige Subagents
```

## Verwendung

Die Skills eines Workflows (und ggf. die Agents) in das `.claude/skills/` bzw. `.claude/agents/` Verzeichnis eines Projekts oder des Benutzers kopieren. Anschließend einmalig `/skill-setup` im Projekt ausführen, um es für den Workflow vorzubereiten.
