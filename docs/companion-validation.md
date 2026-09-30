# Companion backend validation

Validated on Windows on 2026-09-30. This records implementation checks, not a release certification.

## Current effort correction checks

- Production build, strict plugin and adapter TypeScript checks passed.
- Effort discovery uses the active session before cached data. Separate probe sessions restore model and effort, refresh when enabled models change, retain confirmed empty capabilities, and retry missing results when the picker opens.
- Picker states distinguish loading, unconfirmed results, confirmed unsupported models and available levels. Regression coverage includes GPT 6.1 Sol, Gemini 3.7 Flash, stale caches, inactive models and asynchronous discovery without discarding the selected model.
- Antigravity preserves direct and nested JSON capability metadata and merges text variants independently of order. One normalized capability drives the menu, accepted values, fallback and CLI arguments. Fixed-effort model IDs receive no additional effort argument. Model changes and reload reconcile stored effort with the newly reported levels.
- Twelve subprocess integration tests passed against source and again against freshly built companion bundles copied into isolated temporary directories. Every observed ACP session update and permission request, plus adapter responses, is checked against the actual ACP SDK schemas. A deliberate malformed notification proves validation fails even when the SDK only logs the error. Unknown context sizes produce no usage update.
- Full Jest result: 7,637 passed, 34 skipped, two failed (539 suites passed, one skipped, two failed). The unchanged ToolCallBanner and toolCallParser tests expect English numeric separators, while this Windows environment uses German separators. All effort regression suites passed.
- Formatting and lint passed with warnings. Obsidian source, package, styles and review fixtures passed. Review fixtures deliberately emit invalid-manifest diagnostics; dependency review reports three moderate upstream advisories.
- Mobile loading and gallery build passed. Browser verification of the actual picker and its stories confirmed valid levels, Loading…, Not determined and n/a, including readable labels. Verification inside Obsidian remains pending.
- The complete companion ZIP was rebuilt. Its plugin files, all three bundled adapters, licenses and provenance match the freshly built files; installation instructions are included.

## Earlier real-backend checks

These checks were recorded before the current effort correction and were not repeated for this change:

- Real Windows Grok 1.0.44 and Antigravity 1.2.14: handshake, dynamic model catalog, test note read/edit, cancellation and native session reload passed using separate temporary vault directories.
- An earlier temporary directory could not be deleted because automatic approval review rejected deletion: `copilot live test vault 9tZtgn` in the Windows temporary directory.

## Required release checks still open

- Real authenticated Muse installation/login and smoke tests on Windows.
- Full Obsidian restart, saved selection recovery after plugin restart, and visual smoke tests. Adapter process/session reload is covered by automated tests, but does not replace these checks.
- macOS and Linux smoke tests for all three backends.
- Review the AYC FSL-1.1-MIT terms in COMPANION-PROVENANCE.md before publication. This implementation does not relicense that code under Copilot's license.

Install all files from the complete companion ZIP. No publication or release certification was performed.
