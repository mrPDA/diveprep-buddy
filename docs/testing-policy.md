# Testing Policy — DivePrep Buddy

Machine-first rules for **all coding agents**. Human-readable summary for maintainers.

## Goal

Agents **run, write, and maintain** tests autonomously — without waiting for the user to ask. Keep the suite **green, relevant, and lean**.

---

## Mandatory gate (every non-trivial session)

Before ending any session that changed `src/`, `scripts/`, or `src/content/`:

```bash
npm run verify          # test + build — must pass
npm run test:audit      # hygiene check — fix warnings if actionable
```

Then save `notes_test_run_checkpoint(...)` in n4l with suite result.

**Do not commit or hand off** with failing `npm run verify`.

---

## When to ADD a test

| Change | Required test |
| --- | --- |
| Pure logic in `src/lib/**` | Unit test in co-located `*.test.ts` |
| Checklist merge / template rules | Extend `checklist-engine.test.ts` |
| Content bundle structure or copy | Extend `content-bundle.test.ts` or `safety-copy.test.ts` |
| Safety / disclaimer / buddy tone | Extend `safety-copy.test.ts` (never weaken checks) |
| `scripts/content-tools.mjs` | Extend `content-tools.test.mjs` |
| Bug fix (P0–P2) | Regression test reproducing the bug |
| New env flag / security boundary | Extend `env.test.ts` |

## When NOT to add a test

- Pure CSS / spacing / visual polish with no logic change.
- Copy tweak that does not change safety semantics (existing bundle tests still pass).
- Third test covering the same branch as two existing tests — **merge instead**.
- Snapshot of entire JSON bundle — use targeted assertions.
- E2E for flows already covered by unit + one manual QA pass (MVP).

---

## Lean suite rules (avoid overload)

1. **One test file per module** — `foo.ts` → `foo.test.ts` (max one).
2. **Prefer table-driven** `it.each` over copy-paste cases.
3. **Test behavior, not implementation** — public outputs, not private helpers.
4. **Delete** tests when feature or file is removed.
5. **Consolidate** when audit reports duplicate scenario names or >3 tests for one function.
6. **Budget**: aim **≤ 60** `it()` blocks project-wide; **> 80** requires Test Engineer review and justification in `notes_decision_save`.
7. **Safety tests are sacred** — never delete to “reduce count”; refactor assertions only.

Run audit:

```bash
npm run test:audit
```

---

## Test layers (priority order)

| Priority | Layer | Tool | Owner agent |
| --- | --- | --- | --- |
| 1 | Safety copy + security boundaries | Vitest | Test Engineer + Security |
| 2 | Checklist engine + content tools | Vitest | Test Engineer |
| 3 | Content bundle structure EN/RU | Vitest | Checklist Content |
| 4 | Build / types | `tsc` + Vite | Frontend Engineer |
| 5 | Manual mobile + offline | QA matrix | QA Agent |

No Playwright until user approves — manual QA covers UI flows for MVP.

---

## Agent responsibilities

| Agent | Testing duty |
| --- | --- |
| **Every implementer** | Run `npm run verify` before handoff; add tests for new logic |
| **Test Engineer** | Own suite health, audit, CI; reject bloated PRs |
| **QA Agent** | Manual matrix for what automation cannot cover |
| **Security & Safety** | Approve any change to `safety-rules.ts` or forbidden phrases |
| **Checklist Content** | After bundle edits: `npm run test` (safety + structure) |
| **Project Orchestrator** | Schedule Test Engineer pass before deploy |

---

## n4l integration

After every verify run:

```text
notes_test_run_checkpoint(
  title="Verify run",
  suite="vitest+build",
  result="pass"|"fail",
  command="npm run verify",
  passed=..., failed=...,
  provenance={ repo, branch, head_sha }
)
```

On test failure → fix loop with `bridge_role: verification_finding` → `product_fix` → `verification_follow_up`.

---

## File map

```text
src/lib/**/*.test.ts       unit tests (co-located)
src/test/                  cross-cutting: safety-rules, bundle, safety-copy
scripts/*.test.mjs         node script tests
src/test/safety-rules.ts   forbidden phrases (shared with tests)
vitest.config.ts
```

See also: `agents/test-engineer-agent.md`, `agents/qa-agent.md`.
