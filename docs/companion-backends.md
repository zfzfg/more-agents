# More Agents companion backends

More Agents, maintained by Collin Lerche (zfzfg), adds Grok, Muse Code and Antigravity (Gemini) to desktop Agent Mode. Existing defaults and provider settings stay unchanged. Copilot continues to load on mobile; local CLI agents require desktop Obsidian.

## Install the fork

The repository is [zfzfg/more-agents](https://github.com/zfzfg/more-agents). Check [its releases](https://github.com/zfzfg/more-agents/releases) for a complete package. If none is available, follow [the source build instructions](https://github.com/zfzfg/more-agents/blob/master/CONTRIBUTING.md#build-and-package). The repository rename does not create a release or change the current archive filename.

The current UI name is **Copilot**, plugin ID is `copilot`, and manifest version is **4.0.12**. The upstream Copilot Community Plugins entry does not install this fork. Both currently share an ID; use a separate vault and back up existing plugin data before replacing an installation.

Extract **all** files from `obsidian-copilot-companions.zip` into your vault's `.obsidian/plugins/copilot` directory and restart Obsidian. Besides the usual plugin files, the release contains three `companion-*.cjs` adapters and license notices. Each adapter contains its runtime dependencies and uses a separately installed Node.js runtime (version 20 or later). No development checkout or `node_modules` are needed. Install Node.js and restart Obsidian before starting these backends. A custom runtime can be selected with `COMPANION_NODE_PATH` in the backend environment overrides.

Use the complete ZIP for plugin updates too. The upstream three-file installer does not include the adapter files. Missing adapters produce an actionable configuration error.

## Configure and sign in

Open **Basic / Agents**, choose a backend, then **Configure**.

- **Install / update** runs the fixed official vendor installer after confirmation, using its normal installation for your user account. Output and failures are displayed. Updates are manual and stop the selected backend's running Copilot sessions first.
- **Re-check** detects a CLI or verifies the configured executable and version.
- **CLI path / Save path** selects an existing CLI, including Windows paths with spaces.
- **Sign in** runs `grok login` or `muse login`. Use **Sign in in terminal** when terminal input is needed. Antigravity opens an interactive `agy` terminal directly.

Credentials remain with the CLI. Credential-file presence never proves successful authentication. Login completion is reported as unverified until a successful agent response checks access. CLI paths, versions and environment overrides follow device profiles; model and mode preferences may sync.

Copilot-hosted services are external Brevilabs offerings; companion CLIs use their own vendor credentials and catalogs.

Models come from backend catalogs. Effort selection is offered when supported. The existing Copilot instruction builder supplies a tagged session-prompt block where a native system-prompt override is unavailable. The fork does not edit global CLI rule files, and removes the internal prefix during history replay.

## Permissions and limitations

Grok offers **Default** (Agent), **Plan**, and **Auto** (YOLO) in the chat mode selector. Default asks for native tool permissions. Auto approves ordinary tool requests automatically. Plan uses Grok's native planning instructions and, like All Your Companions, automatically approves ordinary tools; the implementation plan still requires a separate review. Plan is not a file-write or command sandbox. Reopen existing Grok chats after updating the adapter to refresh the mode selector.

| Backend              | Permissions                                                                             | Planning                                          | Limitations                                                                                           |
| -------------------- | --------------------------------------------------------------------------------------- | ------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Grok                 | Default uses native permission dialogs; Plan and Auto approve ordinary tools            | Advertised native Plan mode; separate plan review | Requires Grok 0.2.117 or newer; known broken Windows stdio builds are rejected                        |
| Antigravity (Gemini) | Automatic tools require explicit consent for this vault                                 | Native Plan mode and separate plan review         | Copilot cannot ask before each tool or enforce its Vault file-service boundaries on native CLI access |
| Muse Code            | Prompt-unmatched approvals and shell sandbox by default; automatic approval is explicit | No Plan mode                                      | Text only; unsupported images and client MCP servers fail explicitly                                  |

Antigravity's automatic-tool notice stays visible in Agent Mode. Disabling automatic tools revokes consent and stops running sessions immediately. Plan approval remains separate from tool execution.

## Saved chats and updates

Saved chats retain backend and native session IDs. Resume follows the backend's advertised capabilities. On failed resume, saved history stays available and a new conversation requires an explicit user action.

Installer errors are shown; Copilot attempts to restore prior sessions if the old CLI remains usable. After updates, path, version and ACP startup are checked again. Interrupted turns may need a new prompt.

## Build and validation

Use `npm ci`, `npm run build`, `npm run test:companions`, `npm test`, `npm run format:check`, `npm run lint`, `npm run review:obsidian`, and `node scripts/mobile-load-smoke.cjs`. After a production build, `npm run package:companions` creates the release ZIP. The release workflow uploads adapters and notices as well as the complete ZIP.

Fake-CLI tests cover ACP schema validation, Windows launcher paths with spaces, independent chats, streaming, model/effort validation, cancellation, plan rejection, unsupported inputs and resume. Installer and device-profile tests cover failures and persistence. Live authentication and note-read/edit/cancel/resume tests in a separate vault remain necessary on **each** of Windows, macOS and Linux before release.

## Source and license

The Antigravity and Muse implementations derive from All Your Companions commit `91d216aaa8c680811034abd44e4be9eb8cee178e`. The release includes `COMPANION-PROVENANCE.md` and `COMPANION-LICENSE`. Source adapters use FSL-1.1-MIT; Copilot uses AGPL-3.0. Notices are preserved. Review the applicable FSL terms and permissions before publishing; this implementation does not establish license compatibility.
