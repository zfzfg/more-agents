# Companion backend validation

Validated on Windows on 2026-09-30. This records implementation checks, not a release certification.

- Production build and strict adapter type checking passed.
- Nine subprocess integration tests passed, including schema validation with Copilot's actual ACP SDK, packaged adapters without checkout dependencies, model/effort validation, concurrent sessions and resume. Antigravity also preserves its selected model across adapter-session recreation.
- Focused setup/runtime/policy/prompt tests passed (43 tests); session maintenance and device profile checks also passed in their focused runs.
- Full Jest run: 7,575 passed, 34 skipped, two failed. The failures expect English numeric separators in ToolCallBanner and toolCallParser, while this Windows environment uses German separators. Those files were not changed by this implementation.
- Lint passed with warnings. Obsidian source, package, styles and review fixtures passed. The review fixtures deliberately emit invalid-manifest diagnostics. Dependency review reports three moderate upstream dependency advisories.
- Mobile loading and gallery build passed. Gallery stories were added; visual verification inside Obsidian remains pending.
- Real Windows Grok 1.0.44 and Antigravity 1.2.14: handshake, dynamic model catalog, test note read/edit, cancellation and native session reload passed. These checks used separate temporary vault directories. They do not replace a full Obsidian restart test.
- Muse installation/login and real Muse smoke tests remain pending. macOS and Linux smoke tests remain pending for all three backends.
- An earlier temporary directory could not be deleted because automatic approval review rejected the deletion: `copilot live test vault 9tZtgn` in the Windows temporary directory.

Install all files from the complete companion ZIP. Before publication, review the AYC FSL-1.1-MIT terms documented in COMPANION-PROVENANCE.md; this implementation does not relicense that code under Copilot's license.
