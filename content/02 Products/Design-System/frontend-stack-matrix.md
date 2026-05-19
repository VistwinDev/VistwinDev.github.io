---
created: 2026-04-29
tags: [project/visustwin, design-system, frontend, dependencies, 3d]
---

# Frontend Stack Matrix

> 萃取自:`C:\Visustwin\visustwin-showcase\package.json`、`C:\Visustwin\visionbase-monitor\package.json`、`kit-app-template\repo.toml`、`visustwin-extensions/exts/*`
> 掃描日期:2026-04-29
> 範圍:整個 `C:\Visustwin\` 的 5 個 repo

## 1. Repo 框架矩陣

| Repo | 路徑 | 性質 | Stack 性質 | 主要用途 |
|------|------|------|------------|----------|
| **visustwin-showcase** | `C:\Visustwin\visustwin-showcase` | Next.js 16 web app | TypeScript / React / 3D / AI / Charts | VisTwin Studio web hub — 把 18 個 Omniverse Kit extension re-implement 成瀏覽器版 |
| **visionbase-monitor** | `C:\Visustwin\visionbase-monitor` | Next.js 16 web app | TypeScript / React (尚無 3D / 無 chart) | Visionbase 區網裝置 + 視覺監控 dashboard。Phase 0/1 用 showcase 的 design system fork 出來 |
| **visustwin-extensions** | `C:\Visustwin\visustwin-extensions` | Omniverse Kit extension package(GitHub mirror) | Python / Omniverse Kit SDK 110.0 | 19 個 Kit extension 程式碼 mirror,真實 source 在 `D:\Visustwin\kit-app-template\source\extensions\` |
| **kit-app-template** | `C:\Visustwin\kit-app-template` | Omniverse Kit App 樣板 | Python / Omniverse Kit SDK / repo_tools / TOML config | Kit app 編譯模板,extensions source-of-truth 在這個 tree(見 `source/extensions/`)。Repo 用 `repo_tools` (NVIDIA 內部工具鏈) 而非 npm |
| **metaarchetech-vault** | `C:\Visustwin\metaarchetech-vault` | Markdown vault(Obsidian) | Pure markdown · obsidian-git auto-push | 知識庫:System / Projects / Products / Company / Knowledge / Archive。**Plus 現在透過 visionbase-monitor `/docs` 路由也能用瀏覽器看** |

> **觀察:** 5 個 repo 中只有 2 個是 Node 專案。其他 3 個是 Omniverse / Markdown / repo_tools 體系,不在 npm 生態圈。

---

## 2. visustwin-showcase 完整 dependency

> 來源:`package.json`(verbatim)。
> 角色:**整個系統的視覺 / 互動樣板**,所有後續 web app(包含 visionbase-monitor)都從這裡 fork 視覺基底。

### 2.1 Runtime — Frontend Framework

| 名稱 | 版本 | 用途 | 實際使用位置 |
|------|------|------|--------------|
| `next` | **`16.2.4`** | Next.js — App Router、Server Components、Server Actions、Turbopack。React 19 為一級。`middleware.ts` 改名為 `proxy.ts`。 | 整站(28 條路由) |
| `react` | **`19.2.4`** | React 19 — `use()` hook、Actions、Suspense for Data Fetching。 | 全部 `.tsx` |
| `react-dom` | **`19.2.4`** | DOM renderer。 | 全部 `.tsx` |

### 2.2 Build / Tooling

| 名稱 | 版本 | 用途 | 備註 |
|------|------|------|------|
| `typescript` | **`^5`** | strict mode TS。`tsconfig.json` `target: ES2017`,`moduleResolution: bundler`。 | dev |
| `tailwindcss` | **`^4`** | Tailwind v4(CSS-first,**沒有 `tailwind.config.js`**!)。`@theme inline` + `@property --accent` 都在 `globals.css`。 | dev |
| `@tailwindcss/postcss` | **`^4`** | PostCSS plugin for Tailwind v4。 | dev |
| `lightningcss-win32-x64-msvc` | **`^1.32.0`** | Windows 平台原生綁定的 CSS parser。Tailwind v4 內部用。 | runtime(平台特定) |
| `eslint` | **`^9`** | ESLint flat config。 | dev |
| `eslint-config-next` | **`16.2.4`** | Next.js ESLint preset(core-web-vitals + typescript)。 | dev |
| `@types/node` | **`^20`** | Node typing。 | dev |
| `@types/react` | **`^19`** | React typing。 | dev |
| `@types/react-dom` | **`^19`** | React DOM typing。 | dev |

### 2.3 Animation / Motion

| 名稱 | 版本 | 用途 | 實際使用位置 |
|------|------|------|--------------|
| `framer-motion` | **`^12.38.0`** | 動畫主力。`motion`、`useMotionValue`、`useSpring`、`useTransform`、`AnimatePresence`、`LayoutGroup`、`useAnimationControls`、`PanInfo`。 | 22 個 component(GlassCard cursor tracking、CardCarousel 3D drag、CardStack swipe、CardFlip、PageDots `layoutId` ring、SegmentedToggle `layoutId` slide、PluginControlPill dropdown 等)|

整個 `src/lib/motion.ts` 也 export 5 個 spring preset:`snappy`(500/30)、`smooth`(250/28)、`elastic`(300/16)、`hefty`(180/22)、`carousel`(220/32)。

### 2.4 3D / WebGL — 重點

> **整個前端 3D 全部基於這 3 個 lib**,沒裝 postprocessing / leva / cannon / rapier / gltfjsx 等周邊。

| 名稱 | 版本 | 用途 | 實際使用位置 |
|------|------|------|--------------|
| `three` | **`^0.184.0`** | three.js r184(2025 末版本,新 WebGPU + 官方 vec4 等 API)。直接 import `THREE`。 | `OracleOrb`(原生 three,寫了 GLSL shader + IcosahedronGeometry 點雲)、`MassingViewer`、`PresentationScene`、`SunlightScene`、`BimViewer`、`WindCanvas` |
| `@react-three/fiber` | **`^9.6.0`** | r3f v9 — declarative three with React 19 reconciler。 | `MassingViewer`、`PresentationScene`、`SunlightScene`、`BimViewer`、`WindCanvas` 共 5 個 Canvas |
| `@react-three/drei` | **`^10.7.7`** | drei v10 — helper components。**只用了 2 個:`OrbitControls` 跟 `Grid`**。 | 全部 5 個 Canvas |
| `@types/three` | **`^0.184.0`** | three typing(對應 `three` 版本)。 | dev |

#### 3D 架構觀察

- **Canvas count:** 6 個獨立 3D 場景(5 個 r3f Canvas + 1 個原生 three.js,即 OracleOrb)
- **drei usage:** 極節制,只用 OrbitControls + Grid。**沒有用** Sky / Sparkles / Float / PerspectiveCamera / Stage / Environment / SoftShadows / GLTF helpers
- **Asset:** `public/` 跟 `assets/` 沒看到 USD / glTF 檔(經 grep 確認)。場景全部用 procedural geometry 生成(Box / Cylinder / IcosahedronGeometry)
- **Custom shaders:** 只有 `OracleOrb` 寫了 GLSL vertex + fragment shader(noise displacement、audio amplitude uniform)
- **沒有的東西:**
  - 沒有 Omniverse Web Viewer / Omniverse Embed integration(會在 Phase 2 從 `useKitBridge` WS 把狀態同步,**不是**直接渲染 USD)
  - 沒有 Isaac Sim 整合
  - 沒有 postprocessing(EffectComposer / DepthOfField / Bloom / GodRays)
  - 沒有 Rapier / Cannon / use-cannon(物理)
  - 沒有 valtio / zustand / leva(3D-friendly state / dev controls)
  - 沒有 rapier、xterm.js、splatting、gaussian-splat 等新潮 3D viz

### 2.5 Charts / Visualization

| 名稱 | 版本 | 用途 | 實際使用位置 |
|------|------|------|--------------|
| `recharts` | **`^3.8.1`** | 圖表主力。`LineChart`、`BarChart`、`StackedBarChart`、`WindRose`(RadialBarChart) 都包它。`GaugeChart` 自寫(SVG)、`HeatmapCanvas` 直接畫到 `<canvas>`。 | 4 個 wrapper + chart-theme.ts |
| `suncalc` | **`^1.9.0`** | 太陽位置 / sunrise / sunset。`lib/solar.ts` 包了一層 `sunPosition / sunTimes / sunArc`。 | `SolarStudio`、`SunlightScene` |
| `@types/suncalc` | **`^1.9.2`** | suncalc typing。 | dev |
| `puppeteer-core` | **`^24.0.0`** | screenshot 工具(`scripts/screenshot-bim.mjs`)。**只 dev 用,不打進 bundle**。 | dev |

#### Chart 架構

- 全部基於 `recharts` 共用 theme(`chart-theme.ts`):`CATEGORICAL_PALETTE = [hud, teal, signal, blue, amber, violet, rose]`、`TOOLTIP_STYLE`(銳角金邊 mono 11px blur)、`AXIS_TICK`(zinc-400 mono 10px)
- **沒裝** `d3`、`visx`、`echarts`、`apache-echarts`、`plotly`、`@nivo/*`、`vega`(這些都不在 dep)
- 缺什麼?Hexbin、Sankey、ChordDiagram、ForceGraph 都沒有 — 真要做這類圖表得引 `d3` 或 `@visx/sankey`

### 2.6 UI / Icons

| 名稱 | 版本 | 用途 | 實際使用位置 |
|------|------|------|--------------|
| `@phosphor-icons/react` | **`^2.1.10`** | Phosphor Icons v2(SSR-ready 的 `/dist/ssr` 子模組)。 | 多處(LiveEnvCard chip 系列、KPICard severity dot 等)|
| `react-markdown` | **`^10.1.0`** | Markdown render(OracleChat 的 LLM 回應 / docs viewer)。 | OracleChat、ConsoleView |
| `remark-gfm` | **`^4.0.1`** | GFM table / strikethrough / autolink 支援。 | 同 react-markdown |

> ⚠️ **整個 showcase 沒裝 shadcn/ui、radix-ui、headlessui、ariakit、material-ui、daisyUI、ant-design**。所有 UI 元件都是手寫(GlassCard / SegmentedToggle / DnaSwitch / PluginControlPill / OracleChat 等)。Toast 也只在 `src/modules/metrics/` 自製。

### 2.7 i18n / Routing

| 名稱 | 版本 | 用途 | 實際使用位置 |
|------|------|------|--------------|
| `next-intl` | **`^4.9.1`** | i18n。`src/i18n/routing.ts`、`navigation.ts`、`request.ts`、`proxy.ts` 中用。**目前 trunk 上 [locale] 路由群尚未啟用**(看 `next.config.ts` 註解:`i18n via next-intl proxy — activate when [locale] route groups are added`)。 | i18n 4 檔 + proxy.ts |
| `next/font` | (built-in) | 載 Space Grotesk / JetBrains Mono / Pixelify Sans 三 Google fonts(都用 `display: swap` + CSS variable)。 | `app/layout.tsx` |

### 2.8 AI / LLM Stack

> 這是 Showcase 比 visionbase-monitor 多出來的最大塊。整個 `/console` `/oracle` `/ai` 路由都靠這套。

| 名稱 | 版本 | 用途 | 實際使用位置 |
|------|------|------|--------------|
| `ai` | **`^6.0.168`** | Vercel AI SDK v6(streaming chat、tool use、UI message protocol)。 | `app/api/chat/route.ts`、`OracleChat`、`ConsoleView` |
| `@ai-sdk/react` | **`^3.0.170`** | `useChat` hook,從 server 拉 streaming UI message。 | `OracleChat`、`ConsoleView` |
| `@ai-sdk/groq` | **`^3.0.35`** | Groq 推論 provider(便宜快)。`lib/ai/provider.ts` 用 `chatModel = groq("llama-3.3-70b-versatile")`。 | `lib/ai/provider.ts`、`api/chat` |
| `@anthropic-ai/sdk` | **`^0.90.0`** | Anthropic SDK(Claude)— 跟 Groq 平行的 fallback / 比較。 | 推測 lib/ai 內備用 |

#### LLM 架構觀察

- **預設模型:** Groq llama-3.3-70b
- 同時裝 Anthropic SDK 但目前看不出明顯路由(可能是規劃中 alternate provider)
- Pyodide 也走 in-browser:`lib/pyodide-runner.ts` + `ConsoleView` RUN mode

### 2.9 Mock / Dev / Scripting

| 名稱 | 版本 | 用途 |
|------|------|------|
| `puppeteer-core` | **`^24.0.0`** | dev only,用 `scripts/screenshot-bim.mjs` 截 BIM 場景做 baseline screenshot。 |

(沒有 jest / vitest / playwright / cypress。**沒測試框架**。)

---

## 3. visionbase-monitor 完整 dependency

> 角色:Visionbase 區網監控 web 端,**從 showcase 的 design system fork 出來但只帶最小子集**。

### 3.1 跟 showcase 共用(視覺基底)

| 名稱 | 版本 | 跟 showcase 是否同版本 |
|------|------|------------------------|
| `next` | `16.2.4` | ✅ 同 |
| `react` | `19.2.4` | ✅ 同 |
| `react-dom` | `19.2.4` | ✅ 同 |
| `framer-motion` | `^12.38.0` | ✅ 同 |
| `@phosphor-icons/react` | `^2.1.10` | ✅ 同 |
| `lightningcss-win32-x64-msvc` | `^1.32.0` | ✅ 同 |
| `tailwindcss` | `^4` | ✅ 同 |
| `@tailwindcss/postcss` | `^4` | ✅ 同 |
| `eslint` | `^9` | ✅ 同 |
| `eslint-config-next` | `16.2.4` | ✅ 同 |
| `typescript` | `^5` | ✅ 同 |
| `@types/{node,react,react-dom}` | 同 | ✅ 同 |

### 3.2 monitor 額外裝(/docs viewer 用)

| 名稱 | 版本 | 用途 |
|------|------|------|
| `react-markdown` | `^10.1.0` | 跟 showcase 一致(showcase 也裝)。在 `/docs/[slug]` 用。 |
| `remark-gfm` | `^4.0.1` | GFM table 支援。 |
| `rehype-raw` | **`^7.0.0`** | **showcase 沒裝**!支援 inline HTML / SVG / mermaid 嵌入。是 monitor 端 docs viewer 多出來的。 |

### 3.3 showcase 有但 monitor 沒裝(差異清單)

```
@ai-sdk/groq          @ai-sdk/react          @anthropic-ai/sdk
@react-three/drei     @react-three/fiber     three                @types/three
ai
next-intl
recharts              suncalc                @types/suncalc
puppeteer-core
```

→ **目前 monitor 完全沒有 3D / chart / AI / i18n 能力**。Phase 1 不需要,Phase 2 接 YOLO 串流時可能要加 `react-use-websocket` 或維持自寫 ws。Phase 3 加掃描歷史視覺化才會引 `recharts`。

---

## 4. 重點 3D 系統盤點(showcase)

### 4.1 版本鑑識

| Lib | 版本 | 對應 release | 重要 breaking 注意 |
|-----|------|--------------|--------------------|
| `three` | `0.184.0` | three.js r184(2025-12 釋出) | r155+ 已**移除舊 lights API**(`PointLightShadow.bias` 預設改);r161+ **移除舊 Geometry**;r170+ WebGPU `WebGPURenderer` 一級 |
| `@react-three/fiber` | `9.6.0` | r3f v9 | v9 才支援 React 19 reconciler;v8 還是 React 18 only |
| `@react-three/drei` | `10.7.7` | drei v10 | v10 對應 r3f v9;一些 hook signature 改了 |

### 4.2 用了 drei 的哪些 helper

**只 2 個:**
- `OrbitControls` — `MassingViewer`、`PresentationScene`、`SunlightScene`、`BimViewer`、`WindCanvas`(全部 5 個 Canvas 都用)
- `Grid` — `MassingViewer`、`SunlightScene`(地面格線)

**完全沒用:**
```
Sky · Stars · Cloud · Sparkles · Float · ContactShadows · SoftShadows · MeshReflectorMaterial
Stage · Environment · PerspectiveCamera · OrthographicCamera · CameraControls
GLTFLoader / useGLTF · Box / Sphere / Cylinder helpers · Text / Text3D
Html · ScrollControls · Loader · Preload · CycleRaycast · TransformControls
Tweakpane / leva integration · Detailed · Trail
```

### 4.3 自寫的 shader / material / geometry

| 檔案 | 內容 |
|------|------|
| `OracleOrb.tsx` | **唯一一份手寫 GLSL**。`ShaderMaterial` 帶 `uTime / uAmp / uColor / uNoiseScale / uBasePointSize / uPixelRatio` 6 個 uniform。`IcosahedronGeometry(1, 3)` 細分 icosahedron 點雲,vertex shader 做 noise displacement,fragment shader 做 radial-falloff dot,`THREE.AdditiveBlending`。**audio amplitude 透過 audio element RMS 餵 `uAmp`**(可選)。 |
| `MassingViewer.tsx` | 純 procedural — Box / Cylinder geometry,沒 custom material |
| 其餘 | 沒有 custom shader / geometry,全部用 r3f primitives |

### 4.4 USD / glTF asset 整合

**目前完全沒有。** 經 grep 確認 `public/` 跟 `src/` 都找不到 `.usd*` 或 `.gltf` / `.glb` / `.fbx`。所有場景都是 code-generated。

> Phase 2 計畫:**透過 `useKitBridge` WS 把 Kit 場景的物件清單與 transform 同步到 web,讓 web 用 r3f 重畫**(不直接 stream USD)。所以 USD asset 不會出現在這個 repo,而會留在 `kit-app-template` 那邊。

### 4.5 Omniverse / Isaac Sim Web Embed

**沒有任何整合。** 沒 nvidia-omniverse-* package、沒 `<iframe src="omniverse://*">`、沒 web-streaming SDK。橋接走純 WebSocket(`useKitBridge` → `ws://localhost:8765`)。

### 4.6 3D 缺口建議

從 dependency 推測,Phase 2/3 可能該加的 3D 套件:

| 該加? | 套件 | 為什麼 |
|--------|------|--------|
| 🟡 評估中 | `@react-three/postprocessing` | 加 Bloom / DepthOfField 提升 OracleOrb / Vision 場景視覺 |
| 🟡 評估中 | `leva` | dev-time 直接調整 shader uniform / camera 參數,免重啟 |
| 🟡 評估中 | `gltfjsx` (CLI) | 如果以後從 Omniverse 匯出的 USD 要轉 glTF 嵌進來 |
| 🔴 不必 | `@react-three/cannon` / `@react-three/rapier` | 沒物理需求 |
| 🟢 已夠 | `meshline` / `troika-three-text` | 若 wind / solar 視覺要漂亮 line/text |

---

## 5. visustwin-extensions / kit-app-template / vault — Stack 觀察

### 5.1 visustwin-extensions

- **沒有 `package.json`** — 不是 Node 專案。
- 19 個 Omniverse Kit Extension(Python),每個有 `extension.toml` 跟 `*/extension.py`
- 編譯 / 執行靠 Omniverse Kit SDK 110.0
- Stack:
  - `omni.kit` API
  - `omni.ui`(Kit UI framework)
  - `omni.usd`(USD scene API)
  - `omni.timeline`、`omni.physx`、`omni.warp`(some exts)
  - `numpy` / `matplotlib`(報告生成,如 `visustwin.solar.report`、`visustwin.wind.analysis`)
  - **`carb.events`**(Kit event bus,跟 web 端 `useKitBridge` 串)
- mirror-only repo,真實 source 在 `D:\Visustwin\kit-app-template\source\extensions\`

### 5.2 kit-app-template

- 沒 `package.json`,有 `repo.toml` + `composer_playback.toml` + `repo_tools.toml`
- 用 NVIDIA `repo_tools`(內部 build CLI)
- Python 腳本驅動 (`./repo` script)
- Stack 屬於 Omniverse Kit ecosystem,完全不在 npm 生態圈

### 5.3 metaarchetech-vault

- 純 markdown vault,Obsidian 開的
- `obsidian-git` plugin 自動 push
- 子目錄:`00 System / 01 Projects / 02 Products / 03 Company / 04 Knowledge / 99 Archive`
- 無 dependency 概念

---

## 6. 推測缺口 / 升級建議

### 6.1 已過時可升級

| Lib | 現況 | 最新(2026-04) | 建議 |
|-----|------|----------------|------|
| `next` | `16.2.4` | 16.2.x | ✅ 已最新 stable |
| `react` | `19.2.4` | 19.2.x | ✅ 已最新 stable |
| `three` | `0.184.0` | r184 | ✅ 已最新(WebGPU 一級了,可考慮 `WebGPURenderer` upgrade,但 r3f v9 預設仍 WebGL2) |
| `framer-motion` | `^12.38.0` | v12 | ✅ |
| `recharts` | `^3.8.1` | v3 | ✅ |
| `@anthropic-ai/sdk` | `^0.90.0` | 升 1.x | 🟡 0.90 → 1.x 有少量 breaking,值得升 |
| `ai` | `^6.0.168` | v6 | ✅ |

### 6.2 重複 / 可整理

| 重複 | 處理建議 |
|------|----------|
| `react-markdown` 在 showcase 跟 monitor 各裝一份 | 可接受(專案各自 own) |
| `lightningcss-win32-x64-msvc` 顯式列為 dep | Tailwind v4 內部用,**這條建議移到 `optionalDependencies` 或 `peerDependencies`**(現在打包到 production deps 不太對) |
| 模組內 `_stubs/` 重定 chart / primitive | Phase 2 收到 `components/` 共用層 |

### 6.3 該加但目前沒有的

#### 🔴 紅色(做新功能會缺)

| 缺口 | 影響 | 建議套件 |
|------|------|----------|
| **無測試框架** | refactor 沒安全網 | `vitest` + `@vitest/ui` + `@testing-library/react` |
| **無 E2E 測試** | UI 改了沒人盯 | `playwright`(已有 puppeteer-core 不太一樣) |
| **無 form lib** | 真要做設定頁很痛 | `react-hook-form` + `zod` |
| **無 state lib** | 全靠 URL query + useState,複雜起來會散 | `zustand`(輕量)或 `valtio`(proxy-based) |
| **無 data fetching lib** | fetch + useEffect 手刻 | `swr` 或 `@tanstack/react-query` |
| **無 toast / dialog UI lib** | 已盤點到設計缺口 | `sonner` (toast) + `radix-ui/react-dialog` |

#### 🟡 黃色(看路線決定)

| 缺口 | 套件 | 何時需要 |
|------|------|----------|
| Skeleton loader | `react-content-loader` | UI 升級 polish 階段 |
| Date picker | `react-day-picker` | 加 metric 時間範圍篩選 |
| Virtual list | `@tanstack/react-virtual` | device list 超過 200 台時 |
| Map | `mapbox-gl` 或 `leaflet` | 戶外 Visionbase 部署網段視覺化 |

#### 🟢 綠色(已有對應方案,不必加)

```
Animation        → framer-motion(已夠強)
Charts           → recharts(已夠用)
Icons            → @phosphor-icons/react(已夠用)
Markdown         → react-markdown + remark-gfm + rehype-raw
3D               → three + r3f + drei
LLM              → ai + @ai-sdk/* + @anthropic-ai/sdk
i18n             → next-intl
```

### 6.4 Phase 2 該決策

**長期是否走 monorepo / npm workspace?**

目前 `showcase` 跟 `visionbase-monitor` 兩個 web app:
- 共用一份 `globals.css`(現在是 git copy 同步)
- 共用 `GlassCard` / `StatusPill` / `motion.ts` 三件(現在是 git copy)
- 共用未來 7 個 design tokens / primitives

→ **建議 Phase 2 開始用 pnpm workspace**(或 turborepo monorepo),把 design system 抽出 `@metaarchetech/design-system` package,兩個 web app 都 import 它。否則 token 改一次要 patch 兩個 repo 永遠會 drift。

---

## 7. 視覺化:dependency overlay

```
┌──────────────────────────────────────────────────────────────┐
│ visustwin-showcase                                           │
│ ┌─ Frontend: Next 16 · React 19 · TS 5                       │
│ ├─ Style:    Tailwind v4 · framer-motion 12 · @phosphor v2   │
│ ├─ 3D:       three r184 · r3f v9 · drei v10 (OrbitCtrl/Grid) │
│ ├─ Charts:   recharts v3 · suncalc                           │
│ ├─ AI:       ai v6 · @ai-sdk/{react,groq} · @anthropic 0.9   │
│ ├─ MD:       react-markdown · remark-gfm                     │
│ └─ i18n:     next-intl 4.9                                   │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ visionbase-monitor                                           │
│ ┌─ Frontend: Next 16 · React 19 · TS 5         ─┐ same       │
│ ├─ Style:    Tailwind v4 · framer-motion · phos ─┘ as showcase│
│ ├─ MD:       react-markdown + remark-gfm + rehype-raw  ←── docs viewer │
│ ├─ 3D:       (none — Phase 2)                                │
│ ├─ Charts:   (none — Phase 3)                                │
│ ├─ AI:       (none)                                          │
│ └─ i18n:     (none)                                          │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ visustwin-extensions / kit-app-template                      │
│ ┌─ Python · Omniverse Kit SDK 110.0                          │
│ ├─ omni.kit · omni.ui · omni.usd · omni.warp                 │
│ ├─ numpy · matplotlib (reports)                              │
│ └─ build via NVIDIA repo_tools                               │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ metaarchetech-vault                                          │
│ └─ pure markdown (Obsidian + obsidian-git)                   │
└──────────────────────────────────────────────────────────────┘
```

---

## 附錄 A:showcase 全部 23 個 npm 套件速查

```
DEPENDENCIES (18)
  next 16.2.4  · react 19.2.4 · react-dom 19.2.4
  framer-motion ^12.38.0 · @phosphor-icons/react ^2.1.10
  three ^0.184.0 · @react-three/fiber ^9.6.0 · @react-three/drei ^10.7.7
  recharts ^3.8.1 · suncalc ^1.9.0
  next-intl ^4.9.1
  ai ^6.0.168 · @ai-sdk/react ^3.0.170 · @ai-sdk/groq ^3.0.35 · @anthropic-ai/sdk ^0.90.0
  react-markdown ^10.1.0 · remark-gfm ^4.0.1
  lightningcss-win32-x64-msvc ^1.32.0

DEV (11)
  typescript ^5
  tailwindcss ^4 · @tailwindcss/postcss ^4
  eslint ^9 · eslint-config-next 16.2.4
  @types/node ^20 · @types/react ^19 · @types/react-dom ^19
  @types/three ^0.184.0 · @types/suncalc ^1.9.2
  puppeteer-core ^24.0.0
```

## 附錄 B:visionbase-monitor 全部 16 個 npm 套件

```
DEPENDENCIES (9)
  next 16.2.4 · react 19.2.4 · react-dom 19.2.4
  framer-motion ^12.38.0 · @phosphor-icons/react ^2.1.10
  react-markdown ^10.1.0 · remark-gfm ^4.0.1 · rehype-raw ^7.0.0
  lightningcss-win32-x64-msvc ^1.32.0

DEV (7)
  typescript ^5
  tailwindcss ^4 · @tailwindcss/postcss ^4
  eslint ^9 · eslint-config-next 16.2.4
  @types/node ^20 · @types/react ^19 · @types/react-dom ^19
```

---

> 寫完。下次有人問「我們 web 端用什麼?能加什麼?3D 真的有用 USD 嗎?」直接給這份。
