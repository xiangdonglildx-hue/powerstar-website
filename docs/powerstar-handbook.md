# PowerStar Project Handbook

## 1. Project Trunk
PowerStar is managed as a tree:
- trunk = the stable rules and directory boundaries for the whole project
- branches = one scoped task at a time
- leaves = the concrete page, data, script, asset, and sidecar edits

Start from the trunk rules first. Then do one branch at a time.
This repository should not be used like a flat scratch space.

## 2. Project Lines
Every task must belong to one primary line before edits begin.

### website
Use for runtime site work in `index.html`, `products/`, `blog/`, `css/`, `js/`, and page-facing assets.

### seo-data
Use for `data/`, `seo/`, snapshots, metrics, anomalies, and content-support datasets.

### automation
Use for `scripts/` and `.github/workflows/`.

### remotion-sidecar
Use for `remotion/` and remotion-linked OG generation tests and data.

### planning-docs
Use for `.planning/` and `docs/`.
- `.planning/` = evolving process material
- `docs/` = stable long-lived guidance

## 3. Directory Boundaries
- Keep runtime site concerns in the website layer.
- Keep analysis, SOPs, and governance out of the runtime layer.
- Keep source code in its owning area and generated outputs where they are consumed.
- Keep `remotion/` as a sidecar, not a second website runtime.
- Put evolving plans in `.planning/` and stable rules in `docs/`.

## 4. Pre-Work Rules
Before editing, record these in `.planning/CURRENT-WORKBOARD.md`:
- Goal
- Primary line
- Do Not Touch

Example:
- Goal: Improve the voice changer landing-page hero
- Primary line: website
- Do Not Touch: `data/`, `remotion/`, `.github/workflows/`

Do not start work if the task cannot be described this way.
Do not pile feature work directly onto `main`; create or use a task branch or worktree first.

## 5. Execution Rules
- One task = one main objective.
- Do not mix unrelated website, SEO, automation, and remotion changes in one task.
- If a new idea appears mid-task, record it instead of expanding scope.
- Verify work before stopping:
  - website: open the changed page and check the main interaction
  - seo-data: validate the edited data shape or generated output
  - automation: run the changed script or workflow-related command
  - remotion-sidecar: list compositions or run the key render path
  - planning-docs: reread the edited guidance for consistency and reading order

## 6. Closeout and Handoff Rules
Before ending work:
- inspect the diff
- remove accidental cross-line edits
- verify the task stayed inside scope
- record what was finished
- record what should happen next

Every future session must read this handbook first, then read `.planning/CURRENT-WORKBOARD.md` before making meaningful changes.

