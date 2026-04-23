---
tags: [visustwin, integration, kit-web, phase-2, proposal]
aliases: ["Visustwin Integration Plan", "Kit-Web Integration Phase 2"]
created: 2026-04-23
updated: 2026-04-23
status: proposal
draft: true
publish: false
noindex: true
---

# Visustwin — Kit ↔ Web Integration Plan (Phase 2)

> Drafted: 2026-04-23
> Scope: after Phase 1a (Web module pages) + 1b (bridge.ws control plane) are merged — this doc describes how we turn the Web studio from a mock-data showcase into a live control surface for Kit.
> Status: **proposal**, not an implementation — meant to be the basis for breaking work into tickets.

---

## 1. 現狀盤點 (Baseline)

### 1.1 Web 側 — `visustwin-showcase` module pages

Branch `claude/web-integration` has merged 9 module routes under `src/app/(studio)/`. Every one of them is currently driven by mock data; none of them actually subscribe to Kit events. Data sources below are what each page reads today.

| Route | Merged Kit exts (tier doc) | Current data source | Notes |
|---|---|---|---|
| `/dashboard` | `visustwin.dashboard` (T0) | `useKitBridge()` — **real** WS connection to `:8765` | Only page already speaking to Kit. Reads extension lifecycle snapshot + sends enable/disable. |
| `/console` | `ai.oracle`, `dev.repl` (T1→ConsoleModule) | Static mock transcripts; REPL panel reads from file via server route | REPL still file-IPC via `_repl/cmd.py`. No bridge wire yet. |
| `/massing` | `warp.windtunnel` preset logic (T0, ported TS) | Client-side `lib/massing.ts` presets | Pure-web; no Kit roundtrip. Pattern for "algo ported to TS, no need to call Kit". |
| `/wind` | `warp.windtunnel` + `wind.analysis` (T0+T1) | `useMockStream({ kind: "wind" })` — `src/hooks/useMockStream.ts` | Flow field, Lawson grid, comfort chart — all synthetic. |
| `/solar` | `solar.heatmap`, `sunlight.studio`, `solar.report` (T0+T1) | `useMockStream({ kind: "solar" })` + `lib/solar.ts` NOAA algo | Sun path is real math, heat gain is mock. |
| `/bim` | `bim.inspector`, `esg.tracker` (T0+T1→BIMReviewModule) | `useMockStream({ kind: "bim" \| "esg" })` | USD tree is seeded fixture, clash list + ESG numbers mocked. |
| `/monitor` | `vision.detector`, `moisture.health` (T0+T4→MonitorModule) | `useMockStream({ kind: "safety" \| "env" })` | YOLO bbox overlay synthesized; PMV/PPD mocked. |
| `/control` | `camera.travel`, `exhibition.board`, `osc.controller` (T1+T2) | Static cue list; `useMqtt.ts` / `useOsc.ts` hooks scaffolded but idle | Cue fire → console stub via `useKitAction({ action: "camera.flyto" })`. |
| `/metrics` | Cross-domain BI (aggregation of all of above) | `useMockStream` x N — one per schema kind | Rolls up env/energy/safety/occupancy/ESG. |

Supporting infrastructure already in place on the web side:

- `src/hooks/useKitBridge.ts` — reconnecting WS client for the **control plane** (enable/disable plugins), target `ws://localhost:8765`.
- `src/hooks/useMockStream.ts` — deterministic PRNG emitter keyed by `SchemaKind`. The single source of fake data everything leans on.
- `src/hooks/useDataSource.tsx` — `DataSourceProvider` with `{ mode: "live" | "demo" | "offline" }`. Wraps module pages; currently hard-set to `"demo"`.
- `src/hooks/useKitAction.ts` — button-click stub that toasts and does nothing in demo mode; branches on `mode === "live"` for future wiring.
- `src/lib/ws.ts` — generic reconnecting `WSClient` factory (separate from `useKitBridge`'s inlined socket).
- `src/mocks/schemas.ts` — `StreamEnvelope<T>` + per-domain schemas (`WindSchema`, `SolarSchema`, `BIMSchema`, `EnergySchema`, `SafetySchema`, …).

### 1.2 Kit 側 — `kit-app-template/source/extensions/visustwin.*`

Eighteen extensions grouped by tier-doc classification:

| Ext id | Tier | Has WS? | IPC today | Notes |
|---|---|---|---|---|
| `visustwin.bridge.ws` | — (new) | **yes** (:8765) | text JSON, snapshot/update/ack/error | Control plane for the Dashboard. Only speaks plugin lifecycle — no data. |
| `visustwin.dashboard` | T0 | no | Kit UI only | Mirror of the same info the bridge surfaces. |
| `visustwin.warp.windtunnel` | T0 | no | Kit UI + writes debug points to stage | Holds the 3×N×4 massing presets. Python solver emits per-frame fields. |
| `visustwin.solar.heatmap` | T0 | no | Kit UI, `gain_calculator.py` | Algo already portable — some logic duplicated in web `lib/solar.ts`. |
| `visustwin.sunlight.studio` | T0 | no | Kit UI | NOAA sun position drives a DirectionalLight. Web already has parity via `lib/solar.ts`. |
| `visustwin.bim.inspector` | T0 | no | Kit UI + writes `bim_report.csv` | CSV export is the current "API". |
| `visustwin.vision.detector` | T0 | **yes (consumer)** | Connects **out** to `visustwin-vision` YOLO server | The web-port needs to duplicate or relay these detections. |
| `visustwin.wind.analysis` | T1 | no | Kit UI | Pedestrian comfort + Lawson; uses warp.windtunnel output. |
| `visustwin.solar.report` | T1 | no | Kit UI + PDF export button | Export is local disk. |
| `visustwin.esg.tracker` | T1 | no | Kit UI, reads BIM material tags | Carbon numbers come out of BIM scan. |
| `visustwin.ai.oracle` | T1 | no (LLM is its own channel) | Kit UI, calls LLM provider | Tool-use dispatches to other exts in-process. |
| `visustwin.dev.repl` | T1 | no | **file IPC** — watches `_repl/cmd.py` | Cleanest candidate for unified WS message type. |
| `visustwin.camera.travel` | T1 | no | Kit UI | Cue list lives in ext settings. |
| `visustwin.exhibition.board` | T1 | no | Embeds viewport + reads welltek via MQTT | Depends on mqtt.bridge / welltek-twin. |
| `visustwin.mqtt.bridge` | T2 | consumes MQTT :1883 | MQTT | **Deprecated path** — superseded by welltek-twin MCP. Keep readable from web as translation for now. |
| `visustwin.osc.controller` | T2 | UDP :8001 | OSC | **Retired** — WebController (web) is the replacement. Safe to plan end-of-life. |
| `visustwin.light.compass` | T3 | no | Kit UI | Slated for delete. Don't wire. |
| `visustwin.moisture.health` | T4 | no | Kit UI | Archive; the `/monitor` page is the only surviving UI. |

### 1.3 Integration points — what's already a wire vs. what isn't

- **Has WS today:** only `bridge.ws` (control plane) and `vision.detector` (outbound to YOLO). Neither carries domain data like flow fields or heat maps.
- **File IPC today:** `dev.repl` (`_repl/cmd.py`), `bim.inspector` (`bim_report.csv`), `solar.report` (PDF export).
- **Network protocols running in parallel:** MQTT :1883 (welltek-twin), OSC :8001 (osc.controller, retired), plus Kit's internal event bus that never leaves the process.
- **The gap:** there is no uniform streaming channel that carries computed payloads (flow fields, heat maps, clash reports, detections) from Kit to Web. Closing that gap is the central work of Phase 2.

---

## 2. Phase 2a — 資料串流 (Kit → Web)

Goal: one WebSocket, one envelope shape, one topic registry. Every module subscribes to the topics it needs, falls back to mock when no topic has been seen within a timeout.

### 2.1 Extend `visustwin.bridge.ws` to carry domain topics

The existing bridge already owns the WS server, reconnection and connection accounting. Add a second message family on top of the control-plane messages it already handles.

- Keep current `snapshot` / `update` / `ack` / `error` for plugin lifecycle.
- Add `subscribe` / `unsubscribe` (client → server) per topic.
- Add `event` (server → client) carrying a `StreamEnvelope`.

Producers are the individual `visustwin.*` exts: each one registers a publisher with the bridge (via a carb settings hook or a small pub/sub module in `visustwin.bridge`). Bridge stays dumb about content — only routes.

### 2.2 Topic schema registry

Reserved topic names (dot-segmented, `<domain>.<object>.<kind>`). Types match the existing `src/mocks/schemas.ts` envelopes 1:1 so `useMockStream` and `useKitStream` are drop-in interchangeable.

| Topic | Producer ext | Cadence | Payload shape (reuses) |
|---|---|---|---|
| `solar.heatmap.stream` | `solar.heatmap` | 1 Hz or on-change | `SolarSchema.heatmap` (per-unit heat gain grid) |
| `solar.sun.position` | `sunlight.studio` | 10 Hz when scrubbing, else on-change | `{ azimuth, altitude, ts }` |
| `solar.report.summary` | `solar.report` | on demand (after Run Solver) | `SolarSchema.summary` |
| `wind.field.snapshot` | `warp.windtunnel` | on-change (settings edit) | `WindSchema.field` (vector grid) |
| `wind.field.stream` | `warp.windtunnel` | 15 Hz max, throttled | `WindSchema.field` (downsampled) |
| `wind.lawson.grid` | `wind.analysis` | on demand | `WindSchema.lawson` |
| `bim.stage.tree` | `bim.inspector` | on stage change | USD hierarchy snapshot |
| `bim.clash.report` | `bim.inspector` | on demand | `BIMSchema.clashes` |
| `bim.lod.summary` | `bim.inspector` | on stage change | `BIMSchema.lod` |
| `esg.carbon.summary` | `esg.tracker` | on stage change | `ESGSchema.carbon` |
| `esg.audit.report` | `esg.tracker` | on demand | `ESGSchema.audit` (EEWH/LEED rows) |
| `vision.detect.event` | `vision.detector` | event-driven, up to 30 Hz | `SafetySchema.detection` (bbox + label + confidence) |
| `vision.frame.meta` | `vision.detector` | 1 Hz (no pixels, only metadata + URL) | `{ camId, ts, frameUrl? }` |
| `moisture.risk.map` | `moisture.health` | on-change | env risk grid |
| `moisture.pmv.reading` | `moisture.health` | 1 Hz | `EnvironmentalSchema.pmv` |
| `camera.travel.list` | `camera.travel` | on-change | cue list |
| `camera.travel.cue` | `camera.travel` | event-driven (on fly-to start/end) | `{ cueId, state: "start"|"arrived" }` |
| `exhibition.welltek.env` | `exhibition.board` via `mqtt.bridge` | 1 Hz | `EnvironmentalSchema` |
| `project.current` | `bridge.ws` | on-change | see §2c |
| `dashboard.repl.log` | `dev.repl` | event-driven (per stdout chunk) | `{ ts, level, line }` |

### 2.3 Wire envelope

```
{
  "type": "event",
  "topic": "wind.field.stream",
  "ts": 1740000000000,
  "seq": 412,
  "project": "welltek-twin-2026",
  "payload": { ... schema-specific ... }
}
```

- `seq` is per-topic monotonic — lets the client detect drops + request a resend via `{ "type": "resync", "topic": "..." }`.
- `project` allows multi-stage demos to share one bridge without the client leaking data across scopes; see §4.
- Client subscribes via `{ "type": "subscribe", "topics": ["wind.field.stream", "solar.sun.position"] }`.

### 2.4 Web hook — `useKitStream(topic)`

A sibling to `useMockStream` with identical return shape so module code doesn't branch on mode except at the provider level.

- Resolves WS URL the same way `useKitBridge` does (`NEXT_PUBLIC_KIT_BRIDGE_URL`, default `ws://localhost:8765`).
- Shares a single WS connection across all callers via a module-level `BridgeClient` singleton (factored out of `useKitBridge` or built on `lib/ws.ts`).
- Auto-subscribes on mount, unsubscribes on unmount. Ref-counts so two panels on the same topic share the same subscription.
- Returns `{ data, seq, lastTs, status, isStale }` — `isStale` flips to `true` when no frame received within `staleMs` (default 3× the topic's expected cadence).
- When the bridge's `DataSourceProvider` mode is `demo` OR the WS never connects within `fallbackMs` (default 5 s), the hook delegates to `useMockStream({ kind: mapTopicToKind(topic) })`. Modules get data either way; a `source: "live" | "mock"` flag is exposed for banner UIs.

### 2.5 Reconnect + back-pressure + fallback

- Reconnect: exponential backoff already implemented in `useKitBridge`; lift to `BridgeClient` so one retry loop serves both control plane and data plane.
- Back-pressure: bridge drops frames per-topic if send buffer > N (carb setting `/visustwin/bridge/ws/max_queue_per_topic`, default 32). Dropped frame count is surfaced as `{"type":"stream_stats", ...}` once per second — web shows this in the DataSource badge only in dev builds.
- Fallback to mock: if the topic is registered but no producer is attached (ext disabled), bridge replies with `{"type":"subscribe_ack", topic, available: false}`. Client flips that panel to mock + shows a `FROZEN` pill.

### 2.6 Per-module topic wiring (tickets will be generated from this)

| Module page | Subscribes to | Optional / nice-to-have |
|---|---|---|
| `/dashboard` | `dashboard.plugins` (existing), `dashboard.repl.log` | `stream_stats` for a debug pane |
| `/console` | `dashboard.repl.log` | Oracle action echoes (new topic) |
| `/solar` | `solar.heatmap.stream`, `solar.sun.position`, `solar.report.summary` | — |
| `/wind` | `wind.field.stream`, `wind.lawson.grid` | `wind.field.snapshot` for static renders |
| `/bim` | `bim.stage.tree`, `bim.clash.report`, `bim.lod.summary`, `esg.carbon.summary`, `esg.audit.report` | — |
| `/monitor` | `vision.detect.event`, `moisture.risk.map`, `moisture.pmv.reading` | `vision.frame.meta` |
| `/control` | `camera.travel.list`, `camera.travel.cue`, `exhibition.welltek.env` | — |
| `/metrics` | all of the above, aggregated | roll-up topic `metrics.summary` (future) |

### 2.7 Deliverables — Phase 2a

- Extended `visustwin.bridge.ws` protocol spec + implementation for `subscribe` / `unsubscribe` / `event` / `resync`.
- Producer helper module inside the bridge ext so other `visustwin.*` exts can publish with three lines of code.
- First producers: `solar.heatmap`, `sunlight.studio`, `warp.windtunnel`.
- `src/lib/bridgeClient.ts` — shared reconnecting client (control + data plane).
- `src/hooks/useKitStream.ts` with auto-fallback to `useMockStream`.
- Topic registry file (TS + Python) generated from one source of truth (JSON schema file in `visustwin-extensions/contracts/`).
- Dev harness: a standalone `scripts/tail-topic.ts` that prints any topic to stdout for ops debugging.

---

## 3. Phase 2b — 指令回流 (Web → Kit)

Goal: when the user clicks a button in the web UI, Kit does the thing.

### 3.1 Command envelope

Commands are a distinct `command` family, separate from the lifecycle ops the bridge already understands. Every command has a correlation `id` and returns exactly one `result` or `error`.

```
// client → server
{ "type": "command", "id": "c-42", "op": "solver.run",
  "target": "visustwin.wind.analysis",
  "params": { "direction": 270, "speed": 8.5 } }

// server → client
{ "type": "result", "id": "c-42", "op": "solver.run",
  "ok": true, "payload": { "runId": "r-912" } }

// or
{ "type": "error", "id": "c-42", "op": "solver.run",
  "ok": false, "reason": "stage_not_loaded", "detail": "..." }
```

### 3.2 Command catalogue

| Op | Target ext | Params | Ack meaning |
|---|---|---|---|
| `solver.run` | wind/solar/bim | `{ direction?, speed?, date?, selection? }` | Run finished, results available via topic. |
| `geometry.apply` | warp.windtunnel, sunlight.studio | `{ preset?, massing?, params }` | Stage mutated. Follow up topic snapshot. |
| `report.export` | solar.report, bim.inspector, esg.tracker | `{ format: "pdf"\|"csv"\|"xlsx" }` | File written; returns `{ path }` (local) or `{ downloadUrl }` (hosted). |
| `camera.flyto` | camera.travel | `{ cueId }` or `{ position, target, fov?, durationMs? }` | Animation started. Arrival echoed on `camera.travel.cue`. |
| `scene.reset` | warp.windtunnel, bim.inspector | `{ target?: "all"\|"massing"\|"overlays" }` | Stage reverted to baseline. |
| `project.switch` | bridge.ws | `{ usdPath }` | See §4. |
| `repl.exec` | dev.repl | `{ code }` | Stdout/stderr streamed on `dashboard.repl.log`; `result` returns exit status. |
| `oracle.invoke` | ai.oracle | `{ prompt, tools?: [] }` | Oracle answer echoed on a future `oracle.event` topic. |
| `vision.toggle` | vision.detector | `{ camId, enabled }` | Detector on/off. |
| `settings.set` | any | `{ path: "/visustwin/solar/step", value: 0.25 }` | Carb settings update + broadcast. |

### 3.3 Ack / timeout rules

- Every command MUST produce exactly one response (`result` or `error`) within `commandTimeoutMs` (default 8 s for solver.run, 2 s for the rest).
- Long-running operations (`solver.run`) return a `runId` immediately and stream progress on `<domain>.run.progress` topics; UI decides whether to block or let the button return.
- Client-side: `useKitAction({ op, target, params })` returns `{ fire, status: "idle"|"pending"|"done"|"error", lastError }`. Replace the current demo-only stub in place — signature is already compatible.

### 3.4 Authorization / safety gates

Three tiers of trust, configurable per-environment:

- **Free** — anything read-only plus `camera.flyto`, `settings.set` for UI-scoped keys, `vision.toggle`. Fire-and-forget.
- **Confirmed** — `solver.run`, `report.export`, `geometry.apply`, `repl.exec`. UI shows a confirm dialog with the params echoed back. Dialog can be auto-dismissed in "trusted" tenant environments (internal demo), required in "builder A/B" tenants.
- **Locked** — `scene.reset`, `project.switch` with unsaved changes, `geometry.apply` on loaded BIM projects. Require a typed confirmation (project name) or an admin role from the auth layer (out of scope for Phase 2 — stub with an env flag `NEXT_PUBLIC_ALLOW_LOCKED`).

The bridge itself enforces the gate by reading a carb setting `/visustwin/bridge/ws/auth_level` that the Kit host sets at startup (`demo`, `builder`, `internal`). Commands above the level return `error: "forbidden"`.

### 3.5 Error surfacing

- Every error returned from Kit has a machine `reason` (e.g. `stage_not_loaded`, `invalid_params`, `timeout`, `forbidden`) and a human `detail`.
- Web side: `ToastProvider` shows `detail`; module-local `ErrorBanner` can also be wired per page for persistent errors. Network-layer failures (WS down) surface on the existing `DataSourceBadge` — never inside a specific action.
- Error codes live in the shared contracts folder so both sides import from the same source.

### 3.6 Deliverables — Phase 2b

- Bridge handler for `command` / `result` / `error` with auth gate and correlation-id routing.
- Per-ext command dispatcher: small registry each ext opts into, similar to the producer helper in 2a.
- Updated `useKitAction` hook: real WS path behind `mode === "live"`, unchanged demo path.
- `<CommandConfirmDialog />` component with diff-style param preview.
- Command catalogue doc (`visustwin-extensions/contracts/commands.md`) listing every op, params schema, expected ack shape, auth tier.
- First wired commands: `camera.flyto`, `solver.run` (wind), `report.export` (solar).

---

## 4. Phase 2c — 共用 Project / USD 選擇器

Goal: one "current project" concept shared between Kit and every web module, so switching stage in Kit switches every chart on every web page.

### 4.1 Project model

A project is one open USD stage plus its associated Kit data sources. Represented as:

```
{
  "id": "welltek-twin-2026",
  "title": "Welltek Twin · Taichung",
  "usdPath": "omniverse://.../welltek/main.usd",
  "description": "…",
  "tags": ["welltek", "production"]
}
```

The bridge exposes two topics (new) and one command (already in §3):

- Topic `project.list` — snapshot of known projects (from a JSON file in Kit, seeded by repo + plus any currently-open stage). Fires on change.
- Topic `project.current` — current project id. Fires when Kit switches stage.
- Command `project.switch` — `{ id }` or `{ usdPath }`.

### 4.2 Web-side project store

- A Zustand store `useProjectStore` holds `{ list, current, isLoading }`.
- Initialization: on bridge connect, subscribe to both topics and hydrate store.
- Navbar (in `components/studio/StudioNav.tsx`) grows a `<ProjectSelector />` button that opens a dropdown — dispatches `project.switch`.
- The project id is passed to every `useKitStream` call so the bridge can scope producers per project (see §2.3 envelope).
- In demo mode, `list` comes from a bundled JSON (`src/data/projects-demo.json`) and switching is instantaneous + local-only.

### 4.3 Kit-side listeners

When Kit switches stage (via `project.switch` command or a user opening a file from the Kit UI), every producer ext gets a `stage_changed(project_id)` callback via the bridge producer helper. Producers flush caches, re-emit snapshots on next tick. This avoids stale data bleeding across projects.

### 4.4 Deliverables — Phase 2c

- Kit-side project registry (JSON in `kit-app-template/source/extensions/visustwin.bridge.ws/config/projects.json`, hot-reloadable).
- `project.list` / `project.current` topics + `project.switch` command.
- `src/stores/useProjectStore.ts` (Zustand).
- `<ProjectSelector />` in StudioNav — desktop + mobile.
- Every `useKitStream` caller includes current project id in its subscription so the server can namespace payloads.
- Demo-mode fallback projects list.

---

## 5. Phase 2d — 演示模式 / 離線模式 (Demo / Offline)

Goal: the same build runs on Vercel without Kit and on a workstation with Kit — automatically switches, the user always knows which one they're seeing.

### 5.1 Modes

The `DataSourceProvider` already models `"live" | "demo" | "offline"`. Phase 2d pins down how the mode is chosen and communicated.

- `live` — WS connected + project resolved + at least one recent frame on any topic. All modules subscribe to real topics.
- `demo` — no WS (hosted build, no Kit reachable) or WS attempted + failed + fallback timer elapsed. Modules use `useMockStream`. Data drifts deterministically by seed, as today.
- `offline` — `navigator.onLine === false` or build-time flag `NEXT_PUBLIC_FORCE_OFFLINE=1`. No WS attempt, no network-dependent visuals. Used for fully-local reviewer builds (e.g. Kit-less laptop for a client walkthrough).

Mode resolution happens once on app boot inside a new `<ModeGate />` component wrapping `DataSourceProvider`; modules never compute mode themselves.

### 5.2 Auto-sniffing

- On mount, attempt WS to `NEXT_PUBLIC_KIT_BRIDGE_URL || ws://localhost:8765`.
- If `onopen` fires within `sniffMs` (default 1500 ms) → `live`.
- If timeout or `onerror` → `demo`.
- If the connection later drops and doesn't recover within `downgradeMs` (default 10 s) → flip back to `demo` and warn once (not per panel).
- If it recovers → flip to `live`, reset all `useKitStream` subscriptions.

### 5.3 UI state

- Global pill in navbar (next to the project selector):
  - `LIVE · ws://…` — green dot.
  - `DEMO MODE` — amber pill, links to a tooltip explaining "you're seeing deterministic mock data; connect Kit to see real sensors".
  - `OFFLINE` — gray pill.
- Per-panel badge (already exists as `DemoPill` in `components/primitives/`) flips to `LIVE` when the panel's topic has received a frame this minute, else `MOCK`. This lets a half-wired Kit (e.g. wind running but solar not) show honestly.
- Screenshot test fixtures always force `demo` mode so visual diffs are stable.

### 5.4 Deliverables — Phase 2d

- `<ModeGate />` + extended `DataSourceProvider` with auto-sniff.
- Per-panel source badge wired to `useKitStream` return value.
- Nav pill component + tooltip copy (EN + zh-TW via existing `messages/`).
- Storybook / Vercel preview always boots in `demo` mode.
- E2E test: mode transitions fire the expected banner without losing mounted panels.

---

## 6. Phase 2e — 部署與 CI/CD

### 6.1 Web (`visustwin-showcase`) hosting

- **Vercel preview** on every PR. Env default: `NEXT_PUBLIC_KIT_BRIDGE_URL` unset → `demo` mode kicks in automatically. No Kit needed for reviewers.
- **Production** on MetaArcheTech's domain (e.g. `studio.metaarchetech.com`) — same build, same default to `demo` mode unless the visitor is inside the office VPN and env-flagged to attempt the local bridge. The production build is a pure showcase; it is not expected to talk to any real Kit.
- Build: `npm run build` + Next.js standalone output; no server components require runtime Kit access.

### 6.2 Bridge hosting

Two deployment shapes, both supported by the same ext:

- **Local** — bridge runs inside the Kit app on the engineer's workstation. Web UI on the same machine connects to `ws://localhost:8765`. This is the default and covers 90% of use.
- **Relay** — a standalone Python process (`visustwin-bridge-relay`, new package) that accepts Kit-side connections, fans out to external web clients behind TLS. Used for remote demos (client office, trade show). Token-gated; no anonymous subscribers.

The relay reuses `wsserver.py` from the ext and adds an auth header check + reverse registration for the Kit side. Out of scope for M1–M2, needed for M4 trade-show demos.

### 6.3 Multi-tenant isolation

Three environments, identified by auth tier and a branded theme:

| Environment | Who | Auth tier | Hostname | Bridge |
|---|---|---|---|---|
| Builder A | client A | `builder` (confirmed gates on) | `a.studio.metaarchetech.com` | private relay, token A |
| Builder B | client B | `builder` | `b.studio.metaarchetech.com` | private relay, token B |
| Internal demo | MetaArcheTech | `internal` (all gates bypassable) | `studio.metaarchetech.com` | local or relay |

Tenant is a build-time switch (env var + theme file). Projects visible per tenant are filtered by tag — a project with `tags: ["welltek", "production"]` only appears on tenants that match. The bridge enforces: a client authed to tenant A cannot subscribe to topics on a project they don't own.

### 6.4 CI

Per-PR checks (GitHub Actions):

- `tsc --noEmit` on web + on any Python with `basedpyright` (or skip if too noisy).
- `next lint`.
- `next build` to catch SSR-only regressions.
- Playwright smoke (`/dashboard`, `/solar`, `/wind`, `/bim`, `/monitor`) headless — one screenshot per page in demo mode, uploaded as artifact + visual-diffed against the baseline in `screenshots/`.
- Python: `ruff check` on `visustwin-extensions` and `kit-app-template/source/extensions/visustwin.*`.

### 6.5 Deliverables — Phase 2e

- `vercel.json` with env defaults + preview aliases.
- `visustwin-bridge-relay` scaffold (not wired to prod).
- Tenant config file format + docs (`visustwin-extensions/docs/tenants.md`).
- GitHub Actions workflow (`.github/workflows/web-ci.yml`).
- Playwright screenshot job + baseline images in repo.

---

## 7. Milestones

| Milestone | ETA | Definition of done | Risk |
|---|---|---|---|
| **M1** — first live module | +2 weeks | Solar module on `/solar` reading `solar.heatmap.stream` + `solar.sun.position` from Kit via the extended bridge. Demo fallback intact. Only one producer ext wired. | Choose Solar because `gain_calculator.py` already mirrors `lib/solar.ts` — unit tests exist on both sides. |
| **M2** — all modules real-stream + mock fallback | +4 weeks | Every `/(studio)` route subscribes to at least one real topic; all 12 topics in §2.2 have producers. `useMockStream` is called only when a topic is unavailable. | Vision detector + BIM scan cadence are the biggest unknowns — see §8. |
| **M3** — command backflow + project selector | +6 weeks | Ten commands in §3.2 flow through. Project selector in navbar switches Kit stage + scopes all topics. Auth gates enforced on `builder` tenant. | Long-running commands need progress topics — scope creep risk; time-box. |
| **M4** — Vercel deploy + demo mode | +8 weeks | Production Vercel build at `studio.metaarchetech.com`. Auto-sniff LIVE vs DEMO works. Tenant config shipped (even if only one tenant is deployed). Relay code exists but not necessarily hosted. CI green. | Relay + TLS is new infra; keep a lightweight escape hatch to ngrok for the first trade show. |

---

## 8. 風險與未決 (Risks & Open Questions)

- **Next.js 16 app-router WS lifecycle** — `'use client'` components keep one WS open across route changes today, but app-router soft navigations can remount providers in edge cases. If we see drops on every route change, factor `BridgeClient` into a module-level singleton initialized outside React (e.g. in `app/layout.tsx` via a script tag / idle init). A Web Worker + `SharedWorker` layer is a possible later step if tab fan-out becomes a problem, but not required for M1–M2.
- **USD stage read cadence** — if `bim.inspector` re-scans on every `notice` fire it will freeze the viewport. Proposal: producers subscribe to `Usd.Notice` with a 500 ms coalesce window and only publish when the diff is non-empty. Needs confirmation with a real-sized stage (welltek twin is ~2 GB).
- **Multi-Kit namespace collision** — two Kit instances on the same bridge-relay (e.g. client A's workstation + internal laptop both connected) must not cross-talk. The `project` field in the envelope is the scoping key, but we also need a Kit-instance id (machine hostname + pid?) to avoid the case where two users open the same USD path on different machines. Open for M3.
- **Topic ownership** — when two exts want to publish the same topic (e.g. wind.field.snapshot from both warp.windtunnel and an external CFD tool someday), who wins? Proposal: first-registered wins; second gets a warning log. Fine for Phase 2, revisit if it bites.
- **Mock → Live parity** — mock schemas are the de-facto API contract today. Any divergence between what Kit actually emits and what `mocks/schemas.ts` expects will surface as runtime type errors. Mitigation: the topic registry in §2a is the one source of truth; both the mock generator and the Kit producer import from it.
- **Welltek-twin dependency** — `exhibition.board` depends on MQTT from welltek-twin. If we want `/control` to work without running welltek-twin locally, the bridge needs to synthesize env data in demo mode. Flag for M2.
- **Report export paths** — `report.export` returns a local path today. For remote-relay deployments, the file won't be reachable from the browser. Need a signed-URL upload (S3 or local static dir mount) — deferred to M4.
- **OSC retirement timing** — `osc.controller` is slated for T2 removal. Don't wire to WS; delete at M2. WebController MCP takes over.

---

## 9. 附錄 (Appendix) — Referenced files

- Bridge server: `kit-app-template/source/extensions/visustwin.bridge.ws/visustwin/bridge/ws/extension.py`, `…/wsserver.py`
- Web control-plane client: `visustwin-showcase/src/hooks/useKitBridge.ts`
- Web mock stream: `visustwin-showcase/src/hooks/useMockStream.ts`
- Data-source provider: `visustwin-showcase/src/hooks/useDataSource.tsx`
- Action stub: `visustwin-showcase/src/hooks/useKitAction.ts`
- Generic WS helper: `visustwin-showcase/src/lib/ws.ts`
- Plugin registry (tier doc): `visustwin-showcase/src/data/plugins-registry.ts`
- Studio layout + nav: `visustwin-showcase/src/app/(studio)/layout.tsx`, `visustwin-showcase/src/components/studio/StudioNav.tsx`
- REPL file IPC: `_repl/cmd.py`
- Tier source: [[01 Projects/Visustwin/Omniverse Web化 分類清單|Omniverse Web化 分類清單]] (vault)

---

## 相關筆記 (Vault cross-refs)

- 分類依據：[[01 Projects/Visustwin/Omniverse Web化 分類清單|Omniverse Web化 分類清單]]
- 評估總覽：[[01 Projects/Visustwin/Omniverse Web化 評估|Omniverse Web化 評估]]
- 上游幾何整併：[[01 Projects/Visustwin/Omniverse Web化/Web化 Massing Pipeline|Web化 Massing Pipeline]]
- 下游整併提案：[[01 Projects/Visustwin/Omniverse Web化/Web化 整併提案|Web化 整併提案]]
- 架構選項比較：[[01 Projects/Visustwin/Omniverse Web化/Web化 架構選項|Web化 架構選項]]
- Web repo：[[01 Projects/Visustwin/Repos/visustwin-showcase|visustwin-showcase]]
- Kit repo：[[01 Projects/Visustwin/Repos/Omniverse-Extensions|Omniverse-Extensions]]
- 核心 Kit ext：[[01 Projects/Visustwin/Omniverse Web化/visustwin.dashboard|visustwin.dashboard]] · [[01 Projects/Visustwin/Omniverse Web化/visustwin.warp.windtunnel|visustwin.warp.windtunnel]] · [[01 Projects/Visustwin/Omniverse Web化/visustwin.solar.heatmap|visustwin.solar.heatmap]] · [[01 Projects/Visustwin/Omniverse Web化/visustwin.sunlight.studio|visustwin.sunlight.studio]] · [[01 Projects/Visustwin/Omniverse Web化/visustwin.bim.inspector|visustwin.bim.inspector]] · [[01 Projects/Visustwin/Omniverse Web化/visustwin.vision.detector|visustwin.vision.detector]]

---

← [[01 Projects/Visustwin/MOC|Visustwin MOC]]
