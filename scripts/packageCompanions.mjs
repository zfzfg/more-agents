import { readFile, mkdir, writeFile } from "node:fs/promises";
import { zipSync, strToU8 } from "fflate";
const names = [
  "main.js",
  "manifest.json",
  "styles.css",
  "companion-grok.cjs",
  "companion-antigravity.cjs",
  "companion-muse.cjs",
  "LICENSE",
  "COMPANION-LICENSE",
  "MUSE-SDK-LICENSE",
  "COMPANION-PROVENANCE.md",
];
const files = {};
for (const name of names) files[name] = new Uint8Array(await readFile(name));
files["INSTALL.md"] = strToU8(
  "Extract every file in this ZIP into your vault's .obsidian/plugins/copilot directory. Restart Obsidian. In Agent Mode select Grok, Muse Code or Antigravity (Gemini), then Configure. Antigravity requires explicit consent for automatic tools. Use this complete ZIP for updates; the three-file upstream installer does not include these adapters. See COMPANION-PROVENANCE.md for source and license details.\n"
);
await mkdir(".cache/releases", { recursive: true });
await writeFile(".cache/releases/obsidian-copilot-companions.zip", zipSync(files, { level: 9 }));
process.stdout.write("Packaged .cache/releases/obsidian-copilot-companions.zip\n");
