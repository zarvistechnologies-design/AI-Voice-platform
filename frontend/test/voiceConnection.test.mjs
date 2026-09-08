import assert from "node:assert/strict";
import test from "node:test";
import { startVoiceConnection } from "../src/lib/voiceConnection.ts";

function deferred() {
  let resolve;
  let reject;
  const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
}

function fixture() {
  const controller = new AbortController();
  const calls = [];
  const credentials = { serverUrl: "wss://example.invalid", participantToken: "test" };
  const microphone = { stop: () => calls.push("stop") };
  const options = {
    signal: controller.signal,
    getCredentials: async () => { calls.push("credentials"); return credentials; },
    prepareMicrophone: async () => { calls.push("microphone"); return microphone; },
    unlockAudio: async () => { calls.push("unlock"); },
    connect: async () => { calls.push("connect"); },
    publishMicrophone: async (track) => { assert.equal(track, microphone); calls.push("publish"); },
    disconnect: async () => { calls.push("disconnect"); },
  };
  return { options, controller, calls, credentials, microphone };
}

test("starts token, mic and audio unlock together; publishes only after connection", async () => {
  const f = fixture();
  const connection = deferred();
  const entered = deferred();
  f.options.connect = async () => { f.calls.push("connect"); entered.resolve(); await connection.promise; };
  const running = startVoiceConnection(f.options);
  assert.deepEqual(f.calls, ["credentials", "microphone", "unlock"]);
  await entered.promise;
  assert.equal(f.calls.includes("publish"), false);
  connection.resolve();
  assert.equal(await running, f.credentials);
  assert.deepEqual(f.calls.slice(-2), ["connect", "publish"]);
  assert.equal(f.calls.includes("stop"), false);
});

test("token failure stops microphone even when permission resolves later", async () => {
  const f = fixture();
  const permission = deferred();
  f.options.prepareMicrophone = () => permission.promise;
  f.options.getCredentials = async () => { throw new Error("token failed"); };
  await assert.rejects(startVoiceConnection(f.options), /token failed/);
  permission.resolve(f.microphone);
  await permission.promise;
  assert.equal(f.calls.includes("stop"), true);
  assert.equal(f.calls.includes("connect"), false);
});

test("ending during the permission prompt cannot reconnect or leave mic open", async () => {
  const f = fixture();
  const permission = deferred();
  f.options.prepareMicrophone = () => permission.promise;
  const running = startVoiceConnection(f.options);
  f.controller.abort();
  await assert.rejects(running, { name: "AbortError" });
  permission.resolve(f.microphone);
  await permission.promise;
  assert.equal(f.calls.includes("stop"), true);
  assert.equal(f.calls.includes("connect"), false);
});

test("ending during RTC connect disconnects a late connection and never publishes", async () => {
  const f = fixture();
  const connection = deferred();
  const entered = deferred();
  f.options.connect = async () => { entered.resolve(); await connection.promise; };
  const running = startVoiceConnection(f.options);
  await entered.promise;
  f.controller.abort();
  await assert.rejects(running, { name: "AbortError" });
  const disconnects = f.calls.filter((call) => call === "disconnect").length;
  connection.resolve();
  await new Promise((resolve) => setImmediate(resolve));
  assert.ok(f.calls.filter((call) => call === "disconnect").length > disconnects);
  assert.equal(f.calls.includes("publish"), false);
  assert.equal(f.calls.includes("stop"), true);
});

test("publication failure stops the prepared mic and releases the room", async () => {
  const f = fixture();
  f.options.publishMicrophone = async () => { throw new Error("publication failed"); };
  await assert.rejects(startVoiceConnection(f.options), /publication failed/);
  assert.equal(f.calls.includes("stop"), true);
  assert.equal(f.calls.includes("disconnect"), true);
});

test("ending during publication releases the mic and disconnects a late publication", async () => {
  const f = fixture();
  const publication = deferred();
  const entered = deferred();
  f.options.publishMicrophone = async () => { entered.resolve(); await publication.promise; };
  const running = startVoiceConnection(f.options);
  await entered.promise;
  f.controller.abort();
  await assert.rejects(running, { name: "AbortError" });
  assert.equal(f.calls.includes("stop"), true);
  const disconnects = f.calls.filter((call) => call === "disconnect").length;
  publication.resolve();
  await new Promise((resolve) => setImmediate(resolve));
  assert.ok(f.calls.filter((call) => call === "disconnect").length > disconnects);
});

test("audio permission failure releases a ready microphone", async () => {
  const f = fixture();
  f.options.unlockAudio = async () => { throw new Error("audio blocked"); };
  await assert.rejects(startVoiceConnection(f.options), /audio blocked/);
  assert.equal(f.calls.includes("stop"), true);
  assert.equal(f.calls.includes("connect"), false);
});

test("already cancelled attempts do not request media or credentials", async () => {
  const f = fixture();
  f.controller.abort();
  await assert.rejects(startVoiceConnection(f.options), { name: "AbortError" });
  assert.deepEqual(f.calls, []);
});
