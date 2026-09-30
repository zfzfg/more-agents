import { test } from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createInterface } from "node:readline";
import { mkdtemp, writeFile, rm, chmod } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { build } from "esbuild";
import { Readable, Writable } from "node:stream";
import { client as createClient, ndJsonStream } from "@agentclientprotocol/sdk";
import { copyFile } from "node:fs/promises";

const entries = { grok: "grok.ts", antigravity: "antigravity-main.ts", muse: "muse/main.mts" };
async function harness(kind, options = {}) {
  const dir = await mkdtemp(join(tmpdir(), "copilot companion fixture "));
  const cli = join(dir, process.platform === "win32" ? "fake.cmd" : "fake-cli");
  const fixture = resolve("scripts/fixtures/fake-companion.cjs");
  await writeFile(
    cli,
    process.platform === "win32"
      ? `@echo off\r\n"${process.execPath}" "${fixture}" %*\r\n`
      : `#!/bin/sh\nexec '${process.execPath.replace(/'/g, "'\\''")}' '${fixture.replace(/'/g, "'\\''")}' "$@"\n`
  );
  await chmod(cli, 0o700);
  const adapter = join(dir, "adapter.cjs");
  if (options.packaged) await copyFile(resolve(`companion-${kind}.cjs`), adapter);
  else
    await build({
      entryPoints: [`adapters/companions/${entries[kind]}`],
      outfile: adapter,
      bundle: true,
      platform: "node",
      format: "cjs",
      target: "node20",
    });
  const env = {
    ...process.env,
    FAKE_COMPANION: kind,
    COMPANION_CLI_PATH: cli,
    MUSE_CODE_EXECUTABLE: cli,
    AGY_PATH: cli,
    AGY_CWD: dir,
    GEMINI_HOME: join(dir, "gemini"),
    GROK_MUSE_POSTURE: JSON.stringify({ mode: "agent", shellSandbox: true }),
  };
  const child = spawn(process.execPath, [adapter], {
    cwd: dir,
    env,
    stdio: ["pipe", "pipe", "pipe"],
  });
  let errors = "",
    nextId = 0;
  const pending = new Map();
  const frames = [];
  child.stderr.on("data", (chunk) => {
    errors += String(chunk);
  });
  createInterface({ input: child.stdout }).on("line", (line) => {
    const frame = JSON.parse(line);
    frames.push(frame);
    const call = !frame.method && pending.get(frame.id);
    if (call) {
      pending.delete(frame.id);
      clearTimeout(call.timer);
      if (frame.error) call.reject(new Error(`${frame.error.message}: ${errors}`));
      else call.resolve(frame.result);
    }
  });
  child.on("exit", (code) => {
    for (const call of pending.values()) {
      clearTimeout(call.timer);
      call.reject(new Error(`Adapter exited ${code}: ${errors}`));
    }
    pending.clear();
  });
  const send = (frame) => child.stdin.write(JSON.stringify({ jsonrpc: "2.0", ...frame }) + "\n");
  const rawRequest = (method, params = {}) =>
    new Promise((resolve, reject) => {
      const id = ++nextId;
      const timer = setTimeout(() => {
        pending.delete(id);
        reject(new Error(`Timed out: ${method}: ${errors}`));
      }, 10000);
      pending.set(id, { resolve, reject, timer });
      send({ id, method, params });
    });
  const validated = [];
  const connection = options.sdk
    ? createClient()
        .onNotification("session/update", ({ params }) => {
          validated.push(params);
        })
        .connect(ndJsonStream(Writable.toWeb(child.stdin), Readable.toWeb(child.stdout)))
    : undefined;
  const request = connection
    ? (method, params = {}) => connection.agent.request(method, params)
    : rawRequest;
  const close = async () => {
    const exited = new Promise((resolve) => child.once("exit", resolve));
    child.stdin.end();
    const timer = setTimeout(() => child.kill(), 3000);
    await exited;
    clearTimeout(timer);
    await rm(dir, { recursive: true, force: true });
  };
  return { dir, request, send, frames, validated, close };
}

test("Grok translates native model switching, streams and cancels prompts", async () => {
  const h = await harness("grok");
  try {
    await h.request("initialize", {
      protocolVersion: 1,
      clientCapabilities: {},
      clientInfo: { name: "test", version: "1" },
    });
    const session = await h.request("session/new", { cwd: h.dir, mcpServers: [] });
    assert.equal(session.configOptions[0].category, "model");
    const changed = await h.request("session/set_config_option", {
      sessionId: session.sessionId,
      configId: "model",
      value: "plain",
    });
    assert.equal(changed.configOptions[0].currentValue, "plain");
    await assert.rejects(
      h.request("session/set_config_option", {
        sessionId: session.sessionId,
        configId: "model",
        value: "reject",
      }),
      /unavailable/
    );
    const result = await h.request("session/prompt", {
      sessionId: session.sessionId,
      prompt: [{ type: "text", text: "hello" }],
    });
    assert.equal(result.stopReason, "end_turn");
    assert(
      h.frames.some((frame) => frame.params?.update?.content?.text === "Grok fixture response")
    );
    const waiting = h.request("session/prompt", {
      sessionId: session.sessionId,
      prompt: [{ type: "text", text: "wait" }],
    });
    h.send({ method: "session/cancel", params: { sessionId: session.sessionId } });
    assert.equal((await waiting).stopReason, "cancelled");
    assert.equal(
      (
        await h.request("session/load", {
          sessionId: session.sessionId,
          cwd: h.dir,
          mcpServers: [],
        })
      ).sessionId,
      session.sessionId
    );
  } finally {
    await h.close();
  }
});

test("Grok rejects a plan without translating the rejection into approval", async () => {
  const h = await harness("grok");
  try {
    await h.request("initialize", { protocolVersion: 1, clientCapabilities: {} });
    const session = await h.request("session/new", { cwd: h.dir, mcpServers: [] });
    const prompt = h.request("session/prompt", {
      sessionId: session.sessionId,
      prompt: [{ type: "text", text: "plan" }],
    });
    const permission = await new Promise((resolve, reject) => {
      const start = Date.now();
      const poll = () => {
        const frame = h.frames.find((frame) => frame.method === "session/request_permission");
        if (frame) return resolve(frame);
        if (Date.now() - start > 5000) return reject(new Error("Missing plan permission"));
        setTimeout(poll, 10);
      };
      poll();
    });
    assert.equal(permission.params.toolCall.kind, "switch_mode");
    h.send({ id: permission.id, result: { outcome: { outcome: "selected", optionId: "reject" } } });
    assert.equal((await prompt).stopReason, "cancelled");
  } finally {
    await h.close();
  }
});

for (const kind of ["antigravity", "muse"])
  test(`${kind} keeps two chats independent and exposes standard model options`, async () => {
    const h = await harness(kind);
    try {
      await h.request("initialize", { protocolVersion: 1, clientCapabilities: {} });
      const first = await h.request("session/new", { cwd: h.dir, mcpServers: [] });
      const second = await h.request("session/new", { cwd: h.dir, mcpServers: [] });
      assert.notEqual(first.sessionId, second.sessionId);
      assert.equal(first.configOptions[0].category, "model");
      for (const session of [first, second]) {
        assert.equal(
          (
            await h.request("session/prompt", {
              sessionId: session.sessionId,
              prompt: [{ type: "text", text: "hello" }],
            })
          ).stopReason,
          "end_turn"
        );
        assert(
          h.frames.some(
            (frame) =>
              frame.params?.sessionId === session.sessionId &&
              frame.params?.update?.sessionUpdate === "agent_message_chunk"
          )
        );
      }
      await h.request("session/close", { sessionId: first.sessionId });
      const loaded = await h.request("session/load", {
        sessionId: first.sessionId,
        cwd: h.dir,
        mcpServers: [],
      });
      assert.equal(loaded.configOptions[0].category, "model");
    } finally {
      await h.close();
    }
  });

for (const kind of Object.keys(entries))
  test(`${kind} speaks schema-valid ACP through Copilot's SDK`, async () => {
    const h = await harness(kind, {
      sdk: true,
      packaged: process.env.COMPANION_PACKAGED_TEST === "1",
    });
    try {
      await h.request("initialize", {
        protocolVersion: 1,
        clientCapabilities: { fs: { readTextFile: true, writeTextFile: true }, plan: {} },
        clientInfo: { name: "copilot", version: "test" },
      });
      const session = await h.request("session/new", { cwd: h.dir, mcpServers: [] });
      assert.equal(session.configOptions[0].category, "model");
      assert.equal(
        (
          await h.request("session/prompt", {
            sessionId: session.sessionId,
            prompt: [{ type: "text", text: "hello" }],
          })
        ).stopReason,
        "end_turn"
      );
      assert(
        h.validated.some(
          (frame) =>
            frame.sessionId === session.sessionId &&
            frame.update.sessionUpdate === "agent_message_chunk"
        )
      );
      if (kind !== "grok") await h.request("session/close", { sessionId: session.sessionId });
      await h.request("session/load", { sessionId: session.sessionId, cwd: h.dir, mcpServers: [] });
    } finally {
      await h.close();
    }
  });

test("Muse explicitly rejects images, client MCP servers and invalid model selections", async () => {
  const h = await harness("muse");
  try {
    await h.request("initialize", { protocolVersion: 1, clientCapabilities: {} });
    await assert.rejects(
      h.request("session/new", {
        cwd: h.dir,
        mcpServers: [{ name: "client", command: "missing", args: [], env: [] }],
      }),
      /does not accept client MCP/
    );
    const session = await h.request("session/new", { cwd: h.dir, mcpServers: [] });
    await assert.rejects(
      h.request("session/prompt", {
        sessionId: session.sessionId,
        prompt: [{ type: "image", data: "image", mimeType: "image/png" }],
      }),
      /text prompts only/
    );
    await assert.rejects(
      h.request("session/set_config_option", {
        sessionId: session.sessionId,
        configId: "model",
        value: "missing",
      }),
      /Unsupported Muse model/
    );
    const changed = await h.request("session/set_config_option", {
      sessionId: session.sessionId,
      configId: "reasoning_effort",
      value: "high",
    });
    assert.equal(
      changed.configOptions.find((option) => option.id === "reasoning_effort").currentValue,
      "high"
    );
    await assert.rejects(
      h.request("session/set_config_option", {
        sessionId: session.sessionId,
        configId: "reasoning_effort",
        value: "unsupported",
      }),
      /Unsupported/
    );
  } finally {
    await h.close();
  }
});

test("Antigravity validates model/effort choices and does not silently replace a missing conversation", async () => {
  const h = await harness("antigravity");
  try {
    await h.request("initialize", { protocolVersion: 1, clientCapabilities: {} });
    const session = await h.request("session/new", { cwd: h.dir, mcpServers: [] });
    await assert.rejects(
      h.request("session/set_config_option", {
        sessionId: session.sessionId,
        configId: "model",
        value: "missing",
      }),
      /Unsupported/
    );
    const changed = await h.request("session/set_config_option", {
      sessionId: session.sessionId,
      configId: "model",
      value: "plain",
    });
    assert.equal(
      changed.configOptions.find((option) => option.id === "model").currentValue,
      "plain"
    );
    await assert.rejects(
      h.request("session/set_config_option", {
        sessionId: session.sessionId,
        configId: "reasoning_effort",
        value: "high",
      }),
      /Unsupported/
    );
    await h.request("session/prompt", {
      sessionId: session.sessionId,
      prompt: [{ type: "text", text: "remember this model" }],
    });
    await h.request("session/close", { sessionId: session.sessionId });
    const restored = await h.request("session/load", {
      sessionId: session.sessionId,
      cwd: h.dir,
      mcpServers: [],
    });
    assert.equal(
      restored.configOptions.find((option) => option.id === "model").currentValue,
      "plain"
    );
    await assert.rejects(
      h.request("session/load", { sessionId: "missing-conversation", cwd: h.dir, mcpServers: [] }),
      /not found/
    );
  } finally {
    await h.close();
  }
});
