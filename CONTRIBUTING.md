# Contributing to More Agents

More Agents is maintained by [Collin Lerche (zfzfg)](https://github.com/zfzfg) as an independent fork of [Copilot for Obsidian](https://github.com/logancyang/obsidian-copilot). Submit fork contributions to [zfzfg/more-agents](https://github.com/zfzfg/more-agents), not to upstream unless the change is specifically intended for upstream.

## Report a fork problem

GitHub Issues are currently disabled for this fork. If the maintainer enables them, use the repository's Issues tab. Until then, a reproducible documentation or code fix can be proposed through a [pull request](https://github.com/zfzfg/more-agents/pulls); do not send fork reports to the original project's maintainers as though they maintain More Agents.

Include the fork commit, plugin version, OS, backend, CLI and Node versions, reproduction steps, expected behavior, and actual behavior. The manifest still reports the inherited version 4.0.12, so the commit is important for distinguishing builds.

The existing **Report an issue** action can upload diagnostics to Brevilabs and open an upstream issue. It is not fork support. For a fork report, create a local log with **Copilot: Create log file** if needed, review it, and redact secrets, private notes, and account details before sharing. Original upstream support links describe the original product, not this fork.

## Build and package

Read [AGENTS.md](AGENTS.md) and the relevant [development guides](designdocs/agents/PROCESS_GUIDE.md) before contributing. Use a separate test vault. The current plugin ID is `copilot`, so installing this build in an existing Copilot folder replaces that installation.

```sh
git clone https://github.com/zfzfg/more-agents.git
cd more-agents
npm ci
npm run build
npm run package:companions
```

The package is `.cache/releases/obsidian-copilot-companions.zip`. Extract every file into the test vault's `.obsidian/plugins/copilot` directory with Obsidian closed, then restart and enable **Copilot**. The complete package includes the plugin, three companion adapters, licenses, provenance, and installation instructions. The repository rename does not rename this current build output.

Use a compatible Node runtime for the build; CI uses Node 22. Companion execution requires Node.js 20 or later. The separate documentation-site build requires Node.js 22.12 or later. Do not run `npm run dev`; use production builds for this workflow.

The macOS-only `npm run test:vault` workflow is described in [the testing guide](designdocs/agents/TESTING_GUIDE.md). Its three-file symlinks do not replace full companion installation: supply the companion adapters and notices separately or install the full ZIP.

## Validation and pull requests

- Run focused tests for changed behavior, plus appropriate build and lint checks.
- Before a PR, run `npm run format` and `npm run lint` as required by repository instructions.
- For companion changes, run `npm run test:companions`; include fake-CLI coverage and preserve ACP compatibility.
- For changes to plugin source, styles, package metadata, or dependencies, run `npm run review:obsidian` and inspect warnings. Do not weaken the gate to make it pass.
- Update user guides for changed behavior. Keep actual UI labels and persisted paths accurate; do not globally replace Copilot names.
- Do not edit prompt content without explicit authorization, or `RELEASES.md` outside a release PR.

Describe the concrete result, related issue if available, and validation. Distinguish automated fixture tests from real authenticated CLI tests. [Companion validation](docs/companion-validation.md) records pending Windows Muse, Obsidian restart/visual, and macOS/Linux checks; a documentation commit does not complete them.

## License and provenance

Preserve original author, copyright, and license notices. The Copilot-derived core is AGPL version 3; AYC-derived companion code retains FSL-1.1-MIT notices, with separately licensed SDKs. Do not describe the full package as uniformly AGPL or MIT, or assume the FSL conversion date has arrived.

Document source versions and permissions for imported code. License compatibility and rights to individual contributions remain under review; contributions must not silently relicense someone else's work. See [README license notes](README.md#license-and-provenance) and [adapter provenance](adapters/companions/PROVENANCE.md).
