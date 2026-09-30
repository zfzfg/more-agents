# More Agents

AI agents for your Obsidian vault, maintained by **Collin Lerche (zfzfg)**.

More Agents is an independent community fork of [Copilot for Obsidian](https://github.com/logancyang/obsidian-copilot), originally developed by Logan Yang and the Brevilabs team with contributors. It adds **Grok**, **Muse Code**, and **Antigravity (Gemini)** alongside **opencode**, **Claude Code**, and **Codex**, and retains Agent Chat, Projects, Skills, Commands, Quick Chat, Quick Ask, and Miyo integration.

[Getting started](docs/getting-started.md) · [Documentation](docs/index.md) · [Companion setup](docs/companion-backends.md) · [Contributing](CONTRIBUTING.md) · [Repository](https://github.com/zfzfg/more-agents)

## Current version and identity

The current plugin manifest reports **4.0.12**, inherited from upstream. The repository and documentation use **More Agents**, but the running plugin still appears as **Copilot**, uses plugin ID `copilot`, and stores its plugin files under `.obsidian/plugins/copilot`. Commands such as **Open Copilot Agent Chat Window** keep their existing names. A technical rename and data migration are separate work.

The original Copilot Community Plugins entry installs upstream, not this fork. Both currently use the same plugin ID and cannot be installed independently in the same vault. Use a separate test vault and back up an existing installation before replacing it. An upstream update can replace the fork and does not supply its companion adapters.

## Install the complete fork

1. Enable community plugins in a separate desktop Obsidian vault and close Obsidian before copying plugin files.
2. If a complete companion ZIP is available in [this fork's releases](https://github.com/zfzfg/more-agents/releases), extract **every file** into `.obsidian/plugins/copilot`. The current packaging command names it `obsidian-copilot-companions.zip`; the repository rename does not change that filename.
3. Install **Node.js 20 or later** for Grok, Muse Code, and Antigravity, then restart Obsidian and enable **Copilot**. Managed opencode and Codex use separate installation paths and do not require this companion Node runtime.
4. Open **Settings → Copilot → Basic → Agents**, choose a backend, and select **Configure**.
5. Start **Agent Chat** from the ribbon or **Open Copilot Agent Chat Window** from the command palette.

If no complete release is available, build and package the companion ZIP using [CONTRIBUTING.md](CONTRIBUTING.md). A repository rename does not publish a release. Use the complete ZIP for updates; copying only `main.js`, `manifest.json`, and `styles.css` omits the adapters.

## Choose an agent

| Agent                | Connection                                                                                    | Important behavior                                                                       |
| -------------------- | --------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| opencode             | Managed download or your own binary; BYOK, local endpoints, or optional Copilot-hosted models | Existing upstream backend.                                                               |
| Claude Code          | Existing Claude Code installation                                                             | Uses the configured CLI and its authentication; Anthropic terms apply.                   |
| Codex                | Managed or custom `@agentclientprotocol/codex-acp` adapter                                    | Uses the compatible bundled Codex CLI and its login.                                     |
| Grok                 | Local `grok` CLI through the bundled companion adapter                                        | Requires Grok 0.2.117 or newer; Default, Plan, and Auto modes.                           |
| Muse Code            | Local `muse` CLI through the bundled companion adapter                                        | Text only; no Plan mode; unsupported images and client MCP servers fail explicitly.      |
| Antigravity (Gemini) | Local `agy` CLI through the bundled companion adapter                                         | Requires explicit automatic-tool consent for this vault; native Plan review is separate. |

Companion **Configure** provides install/update, executable detection, path selection, and sign-in. Installers require confirmation. Credentials remain with the vendor CLI; a completed login command does not prove access until an agent responds successfully. Set `COMPANION_NODE_PATH` in a backend's environment overrides to select a custom Node runtime.

Models and effort options come from backend catalogs and supported session capabilities. CLI models do not automatically become Quick Chat models. See [Model sources](docs/llm-providers.md) and [Companion backends](docs/companion-backends.md).

## Permissions and saved work

**Grok Plan is not a write or command sandbox.** Plan and Auto approve ordinary tool requests automatically; Plan still asks for separate implementation-plan approval. Default uses native permission requests.

**Antigravity can run tools automatically after consent.** Copilot cannot intercept every native CLI action or enforce its vault file-service boundaries on those actions. Disabling automatic tools stops active Antigravity sessions and revokes consent.

Muse uses prompt-unmatched approvals and a shell sandbox by default; automatic approval is explicit. Saved companion chats retain their backend and native session IDs. If resume fails, history remains available and starting a new conversation requires an explicit action.

See [Agent Chat](docs/agent-mode-and-tools.md), [Projects](docs/projects.md), and [Troubleshooting](docs/troubleshooting-and-faq.md) for the existing vault workflows.

## External services and privacy

More Agents does not supply its own paid model service. Existing **Copilot-hosted**, **Copilot Plus**, dashboard, and self-host controls refer to external upstream services operated by Brevilabs. Their entitlements, billing, and terms are separate from this fork. Vendor CLI and BYOK usage is governed and billed by the chosen provider.

Prompts, notes, files, and tool inputs can leave your device according to the selected model, CLI, skill, or service. Local files alone do not imply local processing. Read [Upstream services and data routes](docs/copilot-plus-and-self-host.md) before enabling hosted features.

The existing **Report an issue** action can upload diagnostics to Brevilabs and open an upstream issue. It is not a More Agents support channel. For fork reports, follow [CONTRIBUTING.md](CONTRIBUTING.md) and share only reviewed, redacted diagnostics.

## License and provenance

The Copilot-derived plugin remains covered by the [GNU AGPL version 3](LICENSE). Companion code ported from [All your Companions](https://github.com/zfzfg/all-your-companions) is documented in [adapter provenance](adapters/companions/PROVENANCE.md) and retains [FSL-1.1-MIT notices](adapters/companions/AYC-LICENSE). The Muse SDK has a separate [MIT notice](MUSE-SDK-LICENSE).

The complete companion package must not be described as entirely AGPL or already MIT. The FSL-to-MIT transition is version-specific; compatibility, rights to individual contributions, and SDK redistribution require further review. Preserving notices does not establish compatibility. This documentation update does not relicense code or certify a release.

Implementation checks and outstanding live/platform checks are recorded in [Companion validation](docs/companion-validation.md).

## Authors and relationship to upstream

- **Fork maintainer:** [Collin Lerche (zfzfg)](https://github.com/zfzfg).
- **Original Copilot:** Logan Yang, the Brevilabs team, and contributors.
- **AYC ancestry:** Paweł Huryn's Grok Build for VS Code (Community), followed by the All your Companions fork and contributions described in its license and Git history.

More Agents is independently maintained. This fork does not claim endorsement by Obsidian, Brevilabs, or the agent providers. Original authorship and license notices remain intact.
