# Stage: <area>

<!-- One stage per area, kept on the main branch. Written in the project's documentation language.
     Holds no copy of the UI: only what's needed to bring the real app up on scratch data and to
     mount a variant in one known place. Keep every section to a few lines; delete these comments. -->

## Area

<What the user sees here, in the project's vocabulary. One or two sentences.>

- **Host**: <page, route or screen that shows the area, e.g. `/assemblies/:id`>
- **Mount point**: <the one subtree a variant replaces: file and component, e.g. `MeasurementPanel` in `features/measurements/Panel.tsx`>
- **Hook**: <the line(s) the start script adds to mount the variants, and where>

## Start

```
<one command, run from the project root>
<browser mode, only for a web frontend inside a desktop shell: the same command with its flag>
```

<What it does in three to five lines: builds the scratch data if missing, starts the app isolated from real data, adds the hook, removes it again on exit and restores it on the next start after a hard kill. What must not be running at the same time. Which URL (browser mode) or which start argument / deep link (native app) leads straight to the area, so a hand-over can open it there.>

## Scratch data

- **Source**: <copied from a real data set (read only), generated, or a fixture>
- **Density**: <what makes it realistic: counts, long names, overflowing lists>
- **Rebuild**: <how to throw it away and rebuild it, e.g. delete `output/`>

## Reference

- **View**: <URL or navigation path, the record that is open, window size>
- **Take it**: <how the image is made: a script, a browser automation, or "ask the user for a screenshot">
- **File**: `reference.png` (regenerated each time, ignored by git)

## Last refreshed

<date, and what had to be repaired, if anything>
