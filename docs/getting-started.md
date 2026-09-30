# Getting Started with More Agents

> **More Agents fork:** The running plugin is still named **Copilot** and uses ID `copilot`; UI labels and existing storage paths below are intentional. Install the [complete fork package](companion-backends.md#install-the-fork), not the upstream Community Plugins entry. Copilot/Brevilabs services remain external upstream offerings.

More Agents extends Copilot V4 with Grok, Muse Code, and Antigravity (Gemini). Agent Chat is a desktop workspace for multi-step vault work; permission behavior depends on the selected backend.

Agent Chat is available in Obsidian on desktop. Quick Chat, Copilot Commands, and Quick Ask remain available for shorter tasks and on mobile.

## Install More Agents

1. Back up your vault and use a separate test vault: this fork and upstream currently share plugin ID `copilot`.
2. Close Obsidian and extract every file from the fork's complete `obsidian-copilot-companions.zip` into `.obsidian/plugins/copilot`. See [Companion installation](companion-backends.md#install-the-fork) for release availability and building from source.
3. Install Node.js 20 or later if you want Grok, Muse Code, or Antigravity. Restart Obsidian, enable community plugins, and enable **Copilot**.

The Community Plugins listing for Copilot installs the original project. It does not install More Agents or its companion adapters. Use the full fork ZIP for updates.

## Set Up Your First Agent Chat

Open **Settings → Copilot → Basic** and find **Agents**. For most people, the quickest path is the managed opencode setup.

### Recommended: Download opencode

1. Select the **opencode** tab under **Agents**.
2. Open **Configure**, choose **Managed by Copilot**, then click **Download & install**. Copilot downloads the `opencode` binary and manages it for you.
3. Choose how opencode gets models:
   - **Copilot-hosted models:** enter an eligible license under **Copilot License** on the Basic tab. Eligible hosted models then appear in opencode and Quick Chat.
   - **Bring your own key:** open the **BYOK** tab, select **Add a provider**, enter your provider details, and choose models. Copilot stores the key in this device's Obsidian Keychain and enables the selected models for opencode and Quick Chat.
4. Return to **Basic → Agents → opencode** and choose the default model for new chats.

Already have the `opencode` binary? Open **Configure**, choose **My own binary**, then select **Auto-detect** or enter its absolute path and click **Apply**.

### Alternative: Link Claude Code

If Claude Code is already installed, Copilot checks its common install locations automatically and marks **Claude** as installed. If it is not found:

1. Open **Basic → Agents → Claude → Configure**.
2. Select **Auto-detect**, or enter the path to the `claude` binary.
3. Sign in when prompted.

Claude uses the account held by the Claude Code CLI. You do not paste that account's key into Copilot.

### Alternative: Link Codex

Copilot connects to Codex through the `codex-acp` adapter, which includes a compatible Codex CLI:

1. Open **Basic → Agents → Codex → Configure** and choose **Download & install** under **Managed by Copilot**. Copilot installs the adapter version tested with that plugin release with its bundled runtime. You do not need Node.js or npm.
2. Click **Sign in**, complete authentication in your browser, and return to Obsidian. If the browser does not open, click **Open sign-in page**. You can cancel or retry sign-in.
3. To use your own adapter instead, choose **My own binary**, then use **Auto-detect** or enter its path. Copilot never updates a custom binary.

If your adapter is below the supported minimum, open **Configure** in Settings to manage the installation. Agent Chat also offers **Upgrade**, with shared progress and errors. You can also choose **Sign in to Codex** on the Agent Chat status card. For terminal login, run your configured adapter with `cli login` using the same `CODEX_HOME` as Copilot.

For manual installations, Copilot requires a supported `@agentclientprotocol/codex-acp` adapter and checks compatibility in **Configure**. See [Codex installation details](agent-mode-and-tools.md#codex). Codex uses the login stored by the bundled Codex CLI; there is no Codex key to paste into Copilot.

### Grok, Muse Code, or Antigravity

Open **Basic → Agents**, select **Grok**, **Muse Code**, or **Antigravity (Gemini)**, and open **Configure**. Re-check an installed CLI, save its executable path, or confirm **Install / update**, then sign in through the vendor CLI. Grok and Muse offer terminal sign-in; Antigravity opens an interactive `agy` terminal.

Antigravity requires explicit automatic-tool consent for this vault. Grok Plan automatically approves ordinary tools and is not a read-only sandbox. Muse has no Plan mode and accepts text only. See [Companion backends](companion-backends.md) for supported inputs, effort selection, and saved-session behavior.

## Start Your First Agent Chat

1. Click the **Agent Chat** ribbon icon, or run **Open Copilot Agent Chat Window** from the command palette.
2. If **Select your agent** appears, choose an **Installed** agent and select **Start chat**. When the default backend is already ready, Copilot opens its chat automatically.
3. Pick a model and permission setting beside the message box, then describe the outcome you want.

Try a concrete first request such as: “Review the unfinished tasks in this vault and make a short plan.” Check the selected backend's permission behavior before starting. Antigravity uses automatic tools after consent, while Grok Plan and Auto automatically approve ordinary tools.

## Projects, Skills, and Commands

### Keep Work Focused with Projects

From Agent Chat Home, open **Projects** and select **New project**. A project keeps its own instructions, reusable context, and chat history, so work for one client or topic stays together. See [Projects](projects.md) for supported context sources and setup.

### Share Skills Across Agents

Skills are reusable instruction packets for jobs such as reviewing a change or drafting a release note. Open **Settings → Copilot → Skills** to see skills from Copilot's shared skills folder and the native opencode, Claude, and Codex skill folders. Enable each skill for the agents that should use it; Copilot links shared skills into the right agent folders for you.

Type `/` in Agent Chat to choose an available skill. Copilot also includes skills for Obsidian Markdown, Bases, Canvas, and the Obsidian CLI. Learn more in [Skills across agents](agent-mode-and-tools.md#skills-across-agents).

### Reuse Copilot Commands

Create preset prompts under **Settings → Copilot → Command**. Run them from the command palette, the editor's **Copilot** menu, or by typing `/` in Agent Chat. See [Copilot Commands and Quick Ask](custom-commands.md).

### Ask Without Leaving the Editor

Run **Quick Ask** from the command palette, or assign it a hotkey under **Obsidian Settings → Hotkeys**. It opens a small prompt beside your cursor or selection for quick rewrites, explanations, and follow-up questions. Quick Ask uses your Quick Chat model, so set up a Copilot-hosted or BYOK model first.

## Next Steps

- [Agent Chat](agent-mode-and-tools.md): agents, permissions, context, models, and skills
- [Projects](projects.md): focused agent workspaces
- [Copilot Commands and Quick Ask](custom-commands.md): reusable prompts and in-editor help
- [Model Sources and BYOK](llm-providers.md): BYOK setup for opencode and Quick Chat
- [Copilot Settings](settings.md): every settings tab explained
