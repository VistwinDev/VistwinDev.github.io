---
title: VisTwin Web 開發規範 v0.1
date: 2026-05-04
audience: VisionBase lab 開發者（4 人團隊上工 onboarding）
status: living document
canonical_repo: 'D:\Visustwin\visustwin-showcase  (branch: main)'
last_pulled_commit: '4a04f9b refactor: extract plugins to visustwin-plugins-web; become pure design lab'
---

# VisTwin Web 開發規範

寫網頁就照這份做。**唯一規範來源是 `visustwin-showcase`**（`/lab` 頁面就是活的設計系統 testbed，跑起來開 `npm run dev` → http://localhost:3000/lab 直接看到全部 token 跟元件）。

---

## 0. 一句話原則

> **不要自己寫 design token 跟元件。先去 `/lab` 找有沒有，沒有的話開議題。**

showcase 已經把所有 color / 字型 / 卡片 / pill / switch / motion preset 集中到 `src/app/globals.css` 跟 `src/components/`。學生新建頁面 = 拿這些拼，不是發明新的。

---

## 1. 技術棧（canonical = showcase）

| 層 | 選擇 | 版本 |
|---|---|---|
| Framework | **Next.js App Router**（不是你訓練資料裡的 Next.js — 有 breaking changes） | 16.2.4 |
| React | React | 19.2.4 |
| Language | TypeScript strict | 5.x |
| Styling | **Tailwind v4**（無 `tailwind.config.ts`，token 直接寫在 `globals.css` 的 `@theme inline {}`） | 4.x |
| Animation | Framer Motion | 12.38.0 |
| Icons | Phosphor Icons React | 2.1.10 |
| Fonts | `next/font/google`（Space Grotesk + JetBrains Mono + Pixelify Sans）+ Chiron Hei HK（jsDelivr CDN） | — |
| Lint | ESLint + `eslint-config-next` | 9.x |
| Package manager | **npm**（有 `package-lock.json`） | — |
| State | React 內建（`useState`/`useEffect`），**不用 Redux/Zustand** | — |
| Routing | App Router file-based（`src/app/...`） | — |

**沒有的東西**（曾經有過、近期已移除，不要嘗試引入）：Three.js / R3F、recharts、AI SDK、next-intl、suncalc。這些原本在 plugin 頁面用，已抽到另一個 repo `visustwin-plugins-web`。

**dev server：**`npm run dev`（預設 3000）。

---

## 2. Repo 角色（簡短）

只有 **`visustwin-showcase`** 是 design 規範來源。它現在的定位是「pure design lab」— 唯一存在的路由是 `/lab`，`/` 自動 redirect 過去。

其他 repo（`visustwin-website`、`WebController`、`welltek-twin`、`visustwin-plugins-web`）都應**參考 showcase 的 token 跟元件**寫；本文件不討論它們。

---

## 3. 設計系統 DNA

### 3.1 色彩（看 `src/app/globals.css` 第 12–61 行）

**主色：signal**（NVIDIA 綠，是 VisTwin 最招牌的識別色）

| token | hex | 用途 |
|---|---|---|
| `signal-500` | `#76b900` | **主強調色**。LIVE 狀態、CTA、active nav |
| `signal-400` | `#9dd11f` | hover / brighter accent |
| `signal-300` | `#b7e25c` | tag 背景、淡 accent |

**次主色：hud**（暖金，showcase plugin 頁面用，新 `/ext/*` 頁面用這個取代 signal）

| token | hex | 用途 |
|---|---|---|
| `hud-500` | `#f6c64c` | DEMO mode、PHASE badge、第二強調 |

**狀態色（severity）：**
- `severity-red` `#f43f5e` ← error / critical
- `severity-amber` `#f59e0b` ← warning / WIP
- `severity-green` `#76b900` ← OK / live
- `severity-blue` `#38bdf8` ← info

**輔助：** `teal-400 #2dd4bf`（live env 環境感測）、`rose-500 #f43f5e`、`amber-500 #f59e0b`。

**中性灰階：** `zinc-50…zinc-950` 共 12 階（多了一個 `zinc-150 #ececee`）。`zinc-50` 是 light bg，`zinc-900/950` 是 dark bg。

**主題切換：**
- 用 `<html data-theme="dark|light">` 切，**不是** Tailwind 的 `dark:` 變體
- 寫顏色用 CSS var（`var(--c-text)`、`var(--c-glass-bg)` 等），**絕對不要**寫死 `text-zinc-900`，會在 light/dark 切換時爆掉
- 完整 var 清單在 `globals.css` 第 71–156 行（`--c-bg`、`--c-text`、`--c-text-muted`、`--c-glass-bg`、`--c-border-subtle`、`--c-chart-grid` …）

### 3.2 字型

| 用途 | family | class |
|---|---|---|
| Display / 標題 | Space Grotesk + Chiron Hei HK | `.display`（粗 900、letter-spacing -0.04em）|
| HUD 11px caps | JetBrains Mono | `.hud` |
| HUD 10px caps | JetBrains Mono | `.hud-sm` |
| 數字 | JetBrains Mono（tabular-nums） | `.mono-num` |
| 像素 / dot-matrix | Pixelify Sans | `.dot-matrix` |

CJK 內容自動字型微調：`html[lang^="zh"]` 會把 `.hud` size 改 11→11px、letter-spacing 縮成 0.05em，p / li 改 0.93em。寫中文不用自己處理。

### 3.3 共用元件 vocabulary

在 `src/components/` 下：

| 元件 | 路徑 | 何時用 |
|---|---|---|
| **`<GlassCard>`** | `primitives/GlassCard.tsx` | **這是整個系統的視覺核心**。任何卡片都用它。props：`accent`(signal/hud/teal/amber/rose 或 #hex)、`interactive`、`breathe`、`drag` |
| `<StatusPill>` | `primitives/StatusPill.tsx` | LIVE / DEMO / OFFLINE / ERROR 狀態指示，含 last-msg tooltip |
| `<DemoPill>` | `primitives/DemoPill.tsx` | "MODE DEMO · MOCK DATA" 橫幅 |
| `<PhaseBadge>` | `studio/DnaPrimitives.tsx` | 開發階段標記（PHASE 1A · UI ONLY 之類）|
| `<Pill>` | 同上 | 通用彩色 tag |
| `<SegmentedToggle>` | 同上 | 多選一切換（DAY/WEEK/MONTH 那種，含 layoutId 滑動高光）|
| `<DnaSwitch>` | 同上 | on/off toggle（彈簧動畫）|
| `<HudCorner>` | 同上 | 4 角 HUD 框線裝飾 |
| `<StudioHeader>` | 同上 | 頁首（含 `{ title }` wordmark 包裝）|
| `<PillHeader>` | `layout/PillHeader.tsx` | 全站 fixed top nav + 主題切換 |

**Motion presets**（`src/lib/motion.ts`）：`springs.snappy / smooth / elastic / hefty / carousel`。寫動畫用這些，不要自己調 stiffness/damping。

**HUD 工具 class**（`globals.css`）：`.glass-card`、`.hud-grid`、`.hud-grid-sm`、`.noise-overlay`、`.live-dot` / `.live-dot-teal/-hud/-amber/-red`。

### 3.4 視覺語彙慣例

- **HUD 元素：** sharp corners (border-radius 0)、1px 細邊、monospace 數字
- **GlassCard：** 圓角 24px、`backdrop-filter blur(24px) saturate(140%)`、跟著滑鼠走的徑向 accent 光暈
- **包裝 wordmark：** 標題用 `{ title }` 樣式（左右綠色大括號，`<StudioHeader>` 已內建）
- **背景：** 全站有一張 `.noise-overlay`（fractal noise SVG，opacity 0.028, mix-blend-mode overlay）+ 左上 signal 光暈（55vw radial）
- **動畫 easing：** 預設 `cubic-bezier(0.16, 1, 0.3, 1)`（quart out）— 慢進、爽快出

---

## 4. 共用 pattern

- **Page layout：** `src/app/layout.tsx` 已掛 `<PillHeader>` + noise + ambient glow，新頁面**不要**再寫 header / shell，直接 export page component。
- **Theme：** `data-theme` 寫到 `<html>`，存 `localStorage.theme`。`layout.tsx` 第 50–54 行有 anti-FOUC inline script，第一次 render 前就會解出主題。
- **Reduced motion：** `globals.css` 結尾已處理 `prefers-reduced-motion`，所有 transition 自動降到 0.01ms — 不用自己 guard。
- **Hooks：**`useShouldAnimate`（reduced-motion）、`useOsc`（OSC WebSocket port 9000）。

---

## 5. 不要做的事（don't）

- ❌ **不寫 plain CSS 檔。** Tailwind utility + `globals.css` 的 design token 就夠。
- ❌ **不要寫死顏色。** 用 `var(--c-text)` / `var(--c-glass-bg)`，不要 `#fff` 或 `text-zinc-900`。
- ❌ **不要引入新 UI lib（MUI、Chakra、shadcn 等）。** 設計 DNA 已經定，混進別套會打架。
- ❌ **不要引入新 chart/3D lib。** showcase 已經把這些移走了，要做數據視覺化請先跟負責人討論去 `visustwin-plugins-web` 開新模組。
- ❌ **不要用 Tailwind `dark:` 變體。** 主題用 `data-theme` attr，CSS var 會自己換。
- ❌ **不要建新 `<HeaderShell>`、`<PageWrapper>` 之類。** layout.tsx 已經處理。
- ❌ **不要 fork GlassCard。** 要新行為加 prop，不要複製。
- ❌ **不要寫 Next.js < 16 的 API**（`middleware.ts`、同步 `params` 等）— 這版有 breaking changes，寫之前先看 `node_modules/next/dist/docs/`。

---

## 6. 上工 checklist

每寫一個新頁面 / 元件前：

- [ ] 跑 `npm run dev`，去 `/lab` 看一遍現有 token 跟元件
- [ ] 用了 design token 的 hex（不是寫死的）
- [ ] 顏色都用 CSS var，dark / light 都試過
- [ ] 卡片用 `<GlassCard>`，不是自己刻 div
- [ ] 字型 class 用 `.display / .hud / .hud-sm / .mono-num`
- [ ] 動畫用 `springs.*` preset 或 `cubic-bezier(0.16,1,0.3,1)`
- [ ] mobile 寬度試過（showcase 用 `sm: / md: / lg:` 標準 Tailwind breakpoint）
- [ ] 有 LIVE / DEMO / OFFLINE / ERROR 狀態的話用 `<StatusPill>`

---

## 7. 參考實作

**最像 DNA 標準的單頁 = `D:\Visustwin\visustwin-showcase\src\app\lab\page.tsx`**。

那一頁列出所有 typography ladder、color palette、card variant、pill、toggle、motion preset 的真實 demo。要做新頁面，從那裡 copy 樣式 / 結構是最快的。

設計 token 真值來源 = `D:\Visustwin\visustwin-showcase\src\app\globals.css`。Tailwind v4 沒有 config 檔，token 都在這裡。

---

## 8. 補充 — 你會踩到的雷

1. **`components/README.md` 是過期的。** 它在講舊的 plugin foundation（`useMockStream`、charts、`/studio/*` route），那些已經抽走了。看這份規範就好，那個 README 別照抄。
2. **README.md 主檔的「卡片系統」段落還寫 OSC `/lifecycle`。** 那是更早期 Day 1 卡片的歷史，現在 showcase 沒這些卡了。`/lab` 才是現況。
3. **`zinc-150`（#ececee）是自訂 step**，標準 Tailwind 沒這階；要用就用 var，不要假設別人 IDE 會自動補完。

---

> 有疑問先看 `/lab`。`/lab` 沒有的就在 issue 提，**不要自己加 token**。
