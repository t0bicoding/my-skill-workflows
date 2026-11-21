# Glossary Map

## Areas

- **Global** — [GLOSSARY.md](./GLOSSARY.md) (project root): project-wide domain terms shared by all areas.
- **{Area}** — [GLOSSARY.md](./{path/to/area}/GLOSSARY.md): {what this area does, in one line}

{The global glossary is always the first area. An area gets its own GLOSSARY.md only when it has terms that do not belong to the whole project.}

## Relationships

- **{Area A} → {Area B}**: {how they relate, e.g. which events A emits that B consumes}
- **{Area A} ↔ {Area C}**: {shared terms or types, e.g. `CustomerId`, `Money`}

<!--
Example:

## Areas

- **Global** — [GLOSSARY.md](./GLOSSARY.md) (project root): project-wide domain terms shared by all areas.
- **Ordering** — [GLOSSARY.md](./src/ordering/GLOSSARY.md): receives and tracks customer orders
- **Billing** — [GLOSSARY.md](./src/billing/GLOSSARY.md): generates invoices and processes payments

## Relationships

- **Ordering → Billing**: Ordering emits `OrderPlaced`; Billing consumes it to create an invoice
- **Ordering ↔ Billing**: shared terms `Customer` and `Money` from the global glossary
-->
