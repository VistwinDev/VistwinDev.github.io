---
created: 2026-04-29
tags: [project/VisTwin, design-system, frontend, ui-inventory]
---

# VisTwin Showcase — UI / 前端形式完整盤點

> 掃描來源:`C:\Visustwin\visustwin-showcase` · branch `main` · commit `7732cd0` "refactor(vision): merge /vision HUD + /vision-ops into single /vision page (#30)"
> 掃描日期:2026-04-29
> 範圍:`src/components/`(40 檔)+ `src/modules/`(86 檔)+ `src/app/`(28 路由)+ `src/hooks/`(10 檔)+ `src/lib/`(13 檔)
> 統計:**169 個 TS/TSX 原始碼檔案** · 7 個 UI 領域 · 23 條 studio 路由 · 24 種互動 pattern

> 這份是「形式」盤點 — 已經有的 design tokens / palette / typography / spacing 已在另一份 design-system 文件,這裡聚焦在**可重用的 component、互動、版面、視覺裝飾**。

---

## 0. 高層俯瞰

```
src/
├── app/                          ← Next.js 16 App Router
│   ├── layout.tsx                ← 根 layout (anti-FOUC + PillHeader + noise + ambient glow)
│   ├── globals.css               ← Tailwind v4 @theme + 雙主題 --c-* + glass-card / hud / live-dot
│   ├── (showcase)/page.tsx       ← StudioShell (3-col Miller)
│   └── (studio)/                 ← 23 路由 + 共用 layout (StudioNav + 216px sidebar)
│       ├── layout.tsx
│       ├── ai/        bim/      build/      camera-path/   console/
│       ├── control/   dashboard/ design/    impact/        ingest/
│       ├── massing/   metrics/   moisture/  monitor/       operate/
│       ├── presentation/ solar/  solar-report/ sunlight/   vision/
│       └── wind/
│
├── components/                   ← 「site-wide」共用 component (40 檔)
│   ├── primitives/               ← 4 件 (GlassCard 是視覺核心)
│   ├── studio/                   ← 17 件 (Studio shell 專用 DNA)
│   ├── cards/                    ← 2 件 (homepage hero cards)
│   ├── motion/                   ← 5 件 (互動 pattern lab)
│   ├── layout/                   ← 3 件 (PillHeader / PluginPill / Gallery)
│   ├── charts/                   ← 8 件 (Recharts wrapper + chart-theme)
│   └── oracle/                   ← 1 件 (OracleChat)
│
├── modules/                      ← 「module-local」實作 (86 檔, 7 模組)
│   ├── bim/        9 檔   ← BIM Inspector + ESG Tracker
│   ├── metrics/   25 檔   ← /metrics BI dashboard (KPI Card / Tabs / Toast / Filter)
│   ├── moisture/  15 檔   ← Moisture & Health
│   ├── monitor-control/ 14 檔  ← /monitor + /control 雙頁
│   ├── solar/     15 檔   ← Solar Studio
│   ├── vision/     5 檔   ← Vision Detector
│   └── wind/       4 檔   ← Wind Studio
│
├── hooks/        10 檔     ← useKitBridge / useOsc / useMqtt / useDataSource / useTheme / etc.
├── lib/          13 檔     ← motion / colormap / massing / solar / vizTheme / studio-shell
├── data/          1 檔     ← plugins-registry.ts (catalog source of truth)
├── i18n/          3 檔     ← next-intl
├── types/         2 檔
├── mocks/         1 檔
└── proxy.ts                ← Next.js 16 middleware
```

**設計重點規律(從這個樹狀結構就能看出):**

1. **`components/` = 整站基礎 / 視覺基底**(GlassCard、StudioHeader、Pill、SegmentedToggle…)。任何 module 都可以 import,不該 fork。
2. **`modules/<name>/` = 該模組獨佔的 view**。目前每個模組都自帶一個內部 `_stubs/primitives.tsx` 或 `primitives/` 子夾,因為 module 是平行開發出來的(`claude/web-plugins-*` branch),最後 merge 時還沒做 primitive 收斂。**這是當前最大的設計債**。
3. `(studio)` route group 把所有 studio 模組放在共用 layout 下,但是 URL 不出現 `/studio`(flat routing)。

---

## 1. Components 完整清單(40 個 site-wide + 從 modules 浮上來的可重用件)

### 1.1 `src/components/primitives/`(4 件)

| 檔案 | 名稱 | Props | 視覺/互動特徵 | 可重用度 | 引用方 |
|------|------|-------|---------------|----------|--------|
| `GlassCard.tsx` | `GlassCard` | `accent?: signal\|teal\|amber\|rose\|hex`, `accentPosition?:{x,y}`, `breathe?`, `interactive?`, `drag?`, `layoutId?` | **整站視覺核心**。`@property --accent` 平滑色彩過渡(400ms),滑鼠位置追蹤 radial-gradient(spring stiffness 120 damping 22 推 CSS var),hover 升起 y:-4 + scale 1.01,可 drag,可 breathe(y:[0,-3,0] 8s 循環)。卡片 24px 圓角 / `backdrop-filter: blur(24px) saturate(140%)` / inset highlight + 0 20px 60px shadow。 | 🟢 整站通用,搬到任何專案都能用 | 60+ 處 |
| `GlassCard.tsx` (export) | `ACCENT_MAP`, `AccentName` | — | 4 色 named accent: signal `#76b900` · teal `#2dd4bf` · amber `#f59e0b` · rose `#fb7185`。其他直接傳 hex。 | 🟢 | — |
| `StatusPill.tsx` | `StatusPill` | `state: live\|demo\|offline\|error`, `lastMessageTs?`, `label?`, `detail?` | 連線狀態 chip。**故意 `border-radius: 0`**(銳角 HUD 風)。內含 6×6 點(`live-dot` / `live-dot-hud` / 灰點 / `live-dot-red`)+ uppercase label。tooltip 顯示「last msg · 3s ago」每秒 tick。 | 🟢 適合任何即時系統 | 多處 |
| `StatusPill.tsx` (export) | `PillState` | `"live"\|"demo"\|"offline"\|"error"` | 4 態 union。 | 🟢 | — |
| `DemoPill.tsx` | `DemoPill` | `label?`, `color?` | 角落 badge。預設 `● MODE DEMO · MOCK DATA` HUD 金。`backdrop-filter: blur(6px)`,銳角。每個 mock-data 頁面都該掛一個。 | 🟢 | — |
| `index.ts` | barrel | re-exports | — | — | — |

### 1.2 `src/components/studio/`(17 件)— Studio DNA

| 檔案 | 名稱 | 視覺/互動特徵 | 可重用度 |
|------|------|---------------|----------|
| `DnaPrimitives.tsx` | `PhaseBadge` | `◆ PHASE 1A · UI ONLY` 琥珀色 chip。`phase` `note` 兩 prop。 | 🟢 |
| `DnaPrimitives.tsx` | `Pill` | 顏色化 tag,`color` `muted` props。background = `${color}14` border = `${color}3a`(8% / 23% alpha — 整站固定比)。 | 🟢 |
| `DnaPrimitives.tsx` | **`SegmentedToggle<T>`** | `value` `options[{id,label,hint?}]` `onChange`。**用 framer `layoutId="seg-active"` 滑動高亮**。active = signal 綠底 + 18px 綠光暈 + 黑字 `#0b0b0d`。spring 420/34。 | 🟢 整站最常被複製的元件之一 |
| `DnaPrimitives.tsx` | `DnaSwitch` | 34×18 訊號綠 toggle。spring 460/32。`on` `onToggle` `disabled` `ariaLabel`。 | 🟢 |
| `DnaPrimitives.tsx` | `HudCorner` | 角落 L 形 bracket(`tl/tr/bl/br`)。10×10 邊框,只畫 2 邊。 | 🟢 視覺裝飾 |
| `DnaPrimitives.tsx` | `StudioHeader` | 大標 `{ TITLE }`(signal 綠括號包標題)+ subtitle hud-sm + `right` slot 給 PhaseBadge。`clamp(28px, 3.5vw, 40px)` 字級。 | 🟢 |
| `StudioNav.tsx` | `StudioNav` | desktop 左側 200px sidebar:`{// STUDIO · 4 PILLARS}` 標題 → 4 條 PILLARS NavLink → `// FOUNDATIONS` 分隔虛線 → 2 條 FOUNDATIONS。active = signal 綠底 10% + 28% border + signal 文字。`hidden md:flex fixed top-20 bottom-3 left-3 z-30`。 | 🟢 但綁 `TIERS` registry |
| `StudioNav.tsx` | `StudioNavMobile` | mobile pill-strip,`md:hidden` 水平 scroll,sticky top-16。pillar = solid border,foundation = dashed border。 | 🟢 |
| `StudioShell.tsx` | `StudioShell` | 3-column Miller shell on `/`:`gridTemplateColumns: 180px 160px minmax(0, 1fr)`。`fixed left-3 right-3 top-20 bottom-3`。同步 URL 兩個 query `?tier=&p=`,4 種 fallback 組合都自動 reconcile。 | 🟡 邏輯重,但版面 pattern 可抄 |
| `TierRail.tsx` | `TierRail` | 第 1 欄(180px):tier list。Active = signal 綠 10% 底 + glyph 字符當 icon。 | 🟢 同上 |
| `PluginRail.tsx` | `PluginRail` | 第 2 欄(160px):選中 tier 的 plugin list。 | 🟢 |
| `ContentArea.tsx` | `ContentArea` | 第 3 欄(remaining):由 `pluginKey` 動態掛 PluginMount。**用 `AnimatePresence mode="wait"` + key 切換**(opacity 0,y:6 → y:0,duration 0.22)。fallback 「`// NO MOUNT REGISTERED`」。 | 🟢 切換動效 pattern |
| `pluginMounts.tsx` | `PLUGIN_MOUNTS` | `Record<pluginKey, ComponentType>` 註冊表。 | 🟡 |
| `PluginDashboard.tsx` | `PluginDashboard` | `/dashboard` 主畫面。Tier × Group × Ext 三層 collapsible 樹狀,每個 ext 用 `DnaSwitch` 控 enable/disable,`HudCorner` 裝飾,`Pill` 標 LIVE/BETA/WIP/PLANNED。內建搜尋 + ALL ON/OFF + Toast。 | 🟡 結構特殊,部件可抄 |
| `TierOverview.tsx` | `TierOverview` | tier 概覽頁(用在 `/operate`、`/design` 等 tier-only 頁面)。pillar 紫色 / foundation 綠色 Pill。 | 🟢 |
| `OracleOrb.tsx` | `OracleOrb` | **Three.js icosphere 點雲 + GLSL shader**。240px 球體,active 時脈動,可吃 audio element 的 RMS 驅動 amplitude。`size` `active` `audio` `color` 4 props。 | 🟢 但需要 three.js |
| `MassingGenerator.tsx` | `MassingGenerator` | massing 模組主畫面,內含 SegmentedToggle + 預覽 + drop-zone。 | 🟡 |
| `MassingViewer.tsx` | `MassingViewer` | 3D viewer(react-three-fiber)。 | 🟡 |
| `ConsoleView.tsx` | `ConsoleView` | `/console` 主畫面。雙模式 ASK / RUN(Pyodide)的對話框 + REPL。Mode toggle 用 SegmentedToggle。 | 🟡 |
| `CameraPathView.tsx` | `CameraPathView` | camera path animator UI。 | 🟡 |
| `PresentationScene.tsx` | `PresentationScene`, `PresetThumbnail` | 展覽場景元件 + 縮圖卡。 | 🟡 |
| `PresentationView.tsx` | `PresentationView` | 完整 presentation 控制面板。**1012 行,本 repo 最大單檔 component**。 | 🔴 不要動 |
| `SunlightScene.tsx` | `SunlightScene` | 日光 SVG 場景。 | 🟢 |

### 1.3 `src/components/cards/`(2 件)— Homepage hero cards

| 檔案 | 名稱 | 視覺特徵 |
|------|------|----------|
| `LifecycleCard.tsx` | `LifecycleCard` | 120 年生命週期 slider。**`.dot-matrix` 大計數器**(Pixelify Sans, `clamp(4.5rem, 18vw, 9rem)`)+ accent 隨年份 lerp(signal → amber → rose),拖滑桿觸發 6 顆**粒子飛濺**(framer + spring 0.65-1.2s,飛上 -28 ~ -77px,fade out)。透過 OSC bridge 發 `/lifecycle` 訊號。 |
| `LiveEnvCard.tsx` | `LiveEnvCard` | 即時環境卡。`@phosphor-icons` chip(Sun/Cloud/CloudRain…),最多選 2 個 active micro-widget。MQTT bridge 接室內 + Open-Meteo 接室外。teal accent。 |

### 1.4 `src/components/motion/`(5 件)— **互動 pattern lab**

這個資料夾是整站最珍貴的「互動模式庫」展示區。

| 檔案 | 名稱 | 互動模式 | 關鍵技巧 |
|------|------|----------|----------|
| `CardCarousel.tsx` | `CardCarousel` | **3D 透視 drag carousel**。卡片繞 Y 軸旋轉 ±32°,離中心越遠越縮小+淡出。drag/spring snap,velocity threshold 340 px/s。 | `useMotionValue` `useTransform` rotateY/scale/opacity 三 axis;PageDots 寬度跟著 active 從 6→22 |
| `CardFlip.tsx` | `CardFlip` | **單軸 Y 翻牌**(180ms × 2 phase)。`rotateY: 0 → -90 (隱形邊緣) → swap content → 90 → 0`。`scale 1 → 1.04 → 1` 給浮起感。 | `useAnimationControls` 手動編序;flip hint「FLIP →/← BACK」 |
| `CardStack.tsx` | `CardStack` | **Tinder-style 堆疊**。最多顯示 4 張,後面的 y+=7px scale-=0.06。**hover 時 fan out**:y+=36px rotate ±4°(扇形展開)。drag X,distance>90 或 velocity>350 觸發 dismiss(動畫離開→shift 到底部)。 | `AnimatePresence` + `layout`;`dismissDir` ref 記住方向 |
| `OSCButton.tsx` | `OSCButton` + `OSCButtonMatrix` | 4 態 idle/hover/active/toggled。tap 時 send(addr,1),release send(addr,0),toggled 留 accent 微亮(33% bg + 5px dot)。matrix 範例 5×3。 | 4 態 state machine;`whileTap scale: 0.93` spring 500/30 |
| `PageDots.tsx` | `PageDots` | **active dot 上罩 layoutId 環**。`layoutId="page-dot-ring"` 讓環在 active 變動時平滑滑過去。 | `LayoutGroup` + `layoutId` |

### 1.5 `src/components/layout/`(3 件)

| 檔案 | 名稱 | 用途 |
|------|------|------|
| `PillHeader.tsx` | `PillHeader` | 全站浮動 header(`fixed top-3 left-3 right-3 z-50` rounded-2xl)。內含 wordmark `{ VISTWIN }`(signal 綠括號)、3 個 nav link、`PluginControlPill`、`live-dot` 連線狀態 ALL LIVE/PARTIAL/OFFLINE、`ThemeToggle`(Sun/Moon SVG + spring 500/30 tap)。 |
| `PluginControlPill.tsx` | `PluginControlPill` | header 中那顆 `◉ PLUGIN 12/18` 按鈕。點開展開 320px dropdown(`AnimatePresence` 0.14s + scale 0.98 elasticity)列出 18 個 ext + ALL ON / ALL OFF。outside-click + ESC 關閉。 |
| `MotionGallery.tsx` | `MotionGallery` | 把 5 個 motion patterns 統合在一頁(landing 內嵌)。 |

### 1.6 `src/components/charts/`(8 件)— Recharts wrappers

| 檔案 | 名稱 | 用途 |
|------|------|------|
| `chart-theme.ts` | `CHART_COLORS`, `CATEGORICAL_PALETTE`, `TOOLTIP_STYLE`, `AXIS_TICK` | **共享 chart 配色 + tooltip 樣式 + axis tick**。`CATEGORICAL_PALETTE = [hud, teal, signal, blue, amber, violet, rose]` 7 色循環。`TOOLTIP_STYLE` 暗底 + 金 1px border + mono 11px + blur 6px(銳角 0px)。 |
| `LineChart.tsx` | `LineChart<T>` | 泛型 LineChart,smooth (monotone interpolation) + hideGrid options。 |
| `BarChart.tsx` | `BarChart<T>` | 泛型 BarChart。 |
| `StackedBarChart.tsx` | `StackedBarChart<T>` | 堆疊。 |
| `GaugeChart.tsx` | `GaugeChart` | 半圓量表。`segments` 多色帶。 |
| `HeatmapCanvas.tsx` | `HeatmapCanvas` | 直接畫到 `<canvas>` 的 heatmap(避開 DOM 節點數)。 |
| `WindRose.tsx` | `WindRose` | 8 sector × N speed bucket 風玫瑰。RadialBarChart。 |
| `index.ts` | barrel | — |

### 1.7 `src/components/oracle/`(1 件)

| 檔案 | 名稱 | 用途 |
|------|------|------|
| `OracleChat.tsx` | `OracleChat` | LLM 對話介面。**ThinkingDots 自製**(3 顆 5×5 dot 1.1s 脈衝循環,delay 0.18s 階梯)。**OracleAvatar** 24px 圓角 `◈` 字符 + signal 綠暗底。`useChat` from `@ai-sdk/react`。`status === "submitted"\|"streaming"` 控 isStreaming。 |

### 1.8 從 `src/modules/` 浮上來的可重用 patterns

每個 module 都自帶一份 local primitives — 這是 plugin-branch 平行開發留下的設計債。但其中一些 pattern 值得抽出到共用層:

| 來源 | 名稱 | 形式 | 推薦動作 |
|------|------|------|----------|
| `monitor-control/primitives/ExtPageShell.tsx` | **`ExtPageShell`** | 4-section page wrapper(Scenario / Canvas / Analysis / Actions),每段有 `01-04` 編號 chip + `divider line` + uppercase 標題。內含 `Card` 子元件(glass / flat 兩 tone)。 | 🟢 抽到 `components/layout/` |
| `monitor-control/primitives/ExtPageShell.tsx` | `Card` | `tone: glass\|flat` 簡化版 GlassCard(無 cursor tracking),適合密集 dashboard。 | 🟢 |
| `monitor-control/primitives/StatusPill.tsx` | `StatusPill`(redef), `StatusDot`, `StatusKind` | 比 root `StatusPill` 多 `StatusKind` 變體(更多狀態)。 | 🟡 跟 root 統合 |
| `metrics/components/KPICard.tsx` | **`KPICard`** | KPI 數字卡:大數字(`clamp(22px, 2.6vw, 30px)` mono num,letter-spacing -0.02em)+ unit 灰字 + ↑/↓/— delta + good/bad 色 + 背景 sparkline。hover 整卡 border 變 signal 綠 + glow。 | 🟢 整理乾淨後抽到共用 |
| `metrics/components/Toast.tsx` | **`fireToast(msg)` + `<ToastHost />`** | **整站唯一 Toast 實作**!global listeners array,fixed bottom-right,2.4s auto-dismiss,signal 綠左邊條。 | 🟢 立刻抽到共用 |
| `metrics/components/FilterBar.tsx` | `FilterBar` + `FilterState` | 篩選列(時間/類型/地區),內含日期範圍 + 多選。匯出按鈕。 | 🟡 |
| `metrics/components/TabNav.tsx` | `TabNav` + `TABS` | tab 列(`overview/energy/environmental/...` 6 tabs),每 tab 帶 glyph + note hud-sm。 | 🟢 |
| `metrics/components/UnitTable.tsx` | `UnitTable` | 表格(rows: UnitSnapshot)。 | 🟡 |
| `metrics/components/MultiSeriesChart.tsx` | `MultiSeriesChart` | 多系列圖,基於 LineChart。 | 🟡 |
| `metrics/components/Toast.tsx` | `ToastHost` | global toast 容器。 | 🟢 |
| `wind/primitives.tsx` | `Panel`, `LawsonChips` | Wind 模組局部:Panel = 帶 outline 的 section,LawsonChips = 風行人舒適度 chip 系列。 | 🟡 |
| `solar/_stubs/primitives.tsx` | `SectionCard`, `MonoNum`, 重定 `StatusPill/Pill/HudCorner` | 太陽分析模組大量 redef。 | 🔴 應該砍掉 import 共用版 |
| `moisture/_stubs/primitives.tsx` | `Panel`, `SeverityChip`, `Stat`, `ActionButton` | Moisture 模組局部。`Stat` 是「label + 大值 + delta」迷你 KPI 形式。 | 🟢 `Stat` 可抽 |

### 1.9 完整可重用度表(只列 🟢 / 🟡)

**🟢 可直接搬到任何專案(31 件)**

```
GlassCard · StatusPill · DemoPill
PhaseBadge · Pill · SegmentedToggle · DnaSwitch · HudCorner · StudioHeader
StudioNav / Mobile · TierRail · PluginRail · ContentArea
LifecycleCard · LiveEnvCard
CardCarousel · CardFlip · CardStack · OSCButton · PageDots
PillHeader · PluginControlPill · ThemeToggle (extracted)
LineChart · BarChart · StackedBarChart · GaugeChart · HeatmapCanvas · WindRose · chart-theme
OracleChat · OracleOrb
ExtPageShell · Card · KPICard · Toast/ToastHost · TabNav · Stat
```

**🟡 邏輯重 / 緊耦合(動之前先 review)**

```
StudioShell (跟 plugins-registry 緊耦合)
PluginDashboard · TierOverview · PresentationScene
ConsoleView (用 Pyodide)
MassingGenerator · MassingViewer (three.js)
PresentationView (1012 行)
```

---

## 2. 路由與頁面 Layout

### 2.1 全站根 layout(`src/app/layout.tsx`)

```
<html data-theme="dark|light" suppressHydrationWarning>
  <head>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/.../chiron-hei-hk-webfont"/>
    <script>{anti-FOUC inline: localStorage > prefers > dark}</script>
  </head>
  <body class="min-h-screen antialiased">
    <div class="noise-overlay" />               ← SVG fractalNoise 0.028 opacity overlay
    <div style={ambient signal radial top-left}/> ← 55vw × 55vw signal-glow
    <PillHeader />                              ← fixed top-3
    <main class="relative z-10">{children}</main>
  </body>
</html>
```

### 2.2 Studio layout(`src/app/(studio)/layout.tsx`)

僅 12 行,**極簡:**
```
<div class="relative min-h-screen pt-24">
  <StudioNav />        ← desktop 200px fixed left sidebar
  <StudioNavMobile />  ← mobile pill-strip sticky
  <div class="md:pl-[216px] pl-3 pr-3 pb-4">{children}</div>
</div>
```

→ **任何 studio 頁面只需要**:`<StudioHeader> + <YourView>`,layout 跟 nav 都被殼包住。

### 2.3 全部路由清單(28 條)

**根 layout 下:**

| 路由 | 檔案 | Layout | 主要 component |
|------|------|--------|----------------|
| `/` | `(showcase)/page.tsx` | 根 layout 直接放 | `<StudioShell />` 三欄殼 |
| `/oracle` | `oracle/page.tsx` | 根 layout | `<OracleChat />` |
| `/kit-test` | `kit-test/page.tsx` | 根 layout | bridge 測試頁 |
| `/api/chat` | `api/chat/route.ts` | — | Vercel AI SDK chat endpoint |
| `/api/kit` | `api/kit/route.ts` | — | Kit bridge HTTP wrapper |

**`(studio)` layout 下(23 條):**

每個都是**極簡 server component**:`<StudioHeader title="..." subtitle="..." right={<PhaseBadge/>} /> + <YourView />`。

| 路由 | 內容 | 主要 component |
|------|------|----------------|
| `/ai` | AI Oracle | (TierOverview pattern) |
| `/bim` | BIM Inspector + ESG | `BimReviewView` |
| `/build` | tier-overview | `TierOverview` |
| `/camera-path` | camera path control | `CameraPathView` |
| `/console` | Ask + Run REPL | `ConsoleView` (with Pyodide) |
| `/control` | OSC + MQTT control | `monitor-control/control/ControlView` |
| `/dashboard` | Plugin control hub | `PluginDashboard` |
| `/design` | tier-overview | `TierOverview` |
| `/impact` | tier-overview | `TierOverview` |
| `/ingest` | tier-overview | `TierOverview` |
| `/massing` | Massing Generator | `MassingGenerator` |
| `/metrics` | BI dashboard | `MetricsView` (KPI cards + tabs) |
| `/moisture` | PMV + risk map | `MoistureView` |
| `/monitor` | Camera live + analysis | `monitor-control/monitor/MonitorView` |
| `/operate` | tier-overview | `TierOverview` |
| `/presentation` | Camera travel + exhibition | `PresentationView` |
| `/solar-report` | Solar PDF report | `SolarReport` |
| `/solar` | Sun path + heatmap | `SolarStudio` |
| `/sunlight` | Sun position studio | `SunlightScene` |
| `/vision` | YOLO 控制 + 即時 MJPEG | `VisionClient` |
| `/wind` | Wind tunnel + analysis | `WindStudio` |

### 2.4 Server / Client 拆分慣例(Next.js 16 強制)

```
page.tsx              ← server component(極薄)
  ↓ 只做 metadata + 組裝 + 傳 props
ClientView.tsx        ← "use client"(所有互動)
  ↓ 用 hooks (useState, useEffect, ...)
模組內部 components   ← 可以 server 或 client
```

例如 `vision/page.tsx`(11 行)→ `VisionClient.tsx`(全部互動)。
**任何頁面要加 LocalStorage / Window / WebSocket → 必須在 ClientView,不能在 page.tsx**。

---

## 3. 互動 Pattern 庫(24 種)

整理了整個 repo 用過的所有 motion / interaction patterns:

### 3.1 Hover / Click

| Pattern | 實作位置 | 規格 |
|---------|----------|------|
| Card hover lift | `GlassCard.tsx:110` | `whileHover={{ y: -4, scale: 1.01 }}` |
| Card tap depress | `GlassCard.tsx:111` | `whileTap={{ scale: 0.98 }}` |
| Button tap squish | `OSCButton.tsx`, `ThemeToggle` | `whileTap={{ scale: 0.93 }}` spring 500/30 |
| Hover border glow | `KPICard.tsx`, `DeviceCard`(monitor) | onMouseEnter inline style mutate |
| Link underline draw | `globals.css :.link-underline` | `background-size: 0% → 100% 1px` 550ms 軟曲線 |
| Hover arrow shift | `globals.css [data-arrow]` | group-hover translateX 4px 550ms |

### 3.2 Cursor-tracked

| Pattern | 實作 | 規格 |
|---------|------|------|
| **Radial-glow follows cursor** | `GlassCard` 核心 | `useMotionValue` x/y → `useSpring` (120/22) → `cardRef.style.setProperty('--accent-x/y', vw)`,CSS `@property --accent` 接 400ms 過渡 |

### 3.3 Layout / Morph

| Pattern | 實作 | 用途 |
|---------|------|------|
| **`layoutId` 滑動高亮** | `SegmentedToggle` (`layoutId="seg-active"`) · `PageDots` (`layoutId="page-dot-ring"`) · `CardStack` (`layout` prop) | 多選一切換時,active 標記平滑滑過 |
| `AnimatePresence mode="wait"` 切換 | `ContentArea`(plugin 切換) `LifecycleCard`(phase 切換) `PluginControlPill`(dropdown) | key 一變,舊的 exit 完才 enter |

### 3.4 Drag / Gesture

| Pattern | 實作 | 規格 |
|---------|------|------|
| **3D 透視 drag carousel** | `CardCarousel` | `drag="x"` `dragElastic={0.04}`;onDragEnd 用 `info.offset.x` + `velocity.x` 判前進/後退;`useTransform` rotateY ±32° / scale 0.76-1 / opacity 0-1 |
| **Tinder swipe stack** | `CardStack` | `drag="x"` 只 top card;dist>90 或 vel>350 觸發 dismiss + 飛離 ±480px |
| GlassCard drag(opt-in) | `GlassCard prop drag={"x"\|"y"\|true}` | dragElastic 0.15 |

### 3.5 Burst / Particle

| Pattern | 實作 | 規格 |
|---------|------|------|
| **粒子飛濺** | `LifecycleCard:78-91` | 拖滑桿觸發 6 顆粒子(2-5px),`y: -28 ~ -77`,`opacity: 0.9 → 0`,duration 0.65-1.2s,boxShadow accent 4×size |
| Glow ring expand | `OSCButton:79-92` | toggled 時 `motion.div initial scale 0.8 → 1` radial-gradient 33% alpha |

### 3.6 Pulse / Loop

| Pattern | 實作 | 規格 |
|---------|------|------|
| Live dot pulse | `globals.css @keyframes live-pulse-{signal\|teal\|hud\|amber\|red}` | 6×6 圓 + box-shadow 從 0 擴 8px 0% alpha,2.2s ease-out infinite |
| Bbox alert blink | `globals.css @keyframes bbox-alert` | opacity 1 ↔ 0.45 |
| Status pulse | `globals.css @keyframes status-pulse-fast` | opacity 1 ↔ 0.35 |
| Feed scan line | `globals.css @keyframes feed-scan` | background-position 0 → 0 40px |
| Card breathe | `GlassCard breathe={true}` | `y: [0, -3, 0]` 8s easeInOut infinite |
| Thinking dots | `OracleChat.ThinkingDots` | 3 顆 5×5 dot,opacity [0.25,1,0.25],delay 0.18s 階梯,1.1s 循環 |
| Page enter | `PillHeader` 等 | `initial y:-20 opacity:0 → 0/1` 700ms ease(0.16,1,0.3,1) |
| Card enter | `LifecycleCard`, `LiveEnvCard` | `opacity:0 y:32 scale:0.96 → 1/0/1` 850ms |

### 3.7 Flip / Stack

| Pattern | 實作 | 規格 |
|---------|------|------|
| **Card flip Y-axis** | `CardFlip` | 2-phase: rotate Y 0→-90 (180ms easeIn) + scale 1→1.04,swap content,90→0 (180ms easeOut) |
| Stack fan-out on hover | `CardStack` hovered=true 時 | y 從 i*7 → i*36,rotate 從 ±1.5° → ±4° |

### 3.8 Theme Switch

| Pattern | 實作 | 規格 |
|---------|------|------|
| Anti-FOUC theme bootstrap | `layout.tsx <head> inline script` | `localStorage > prefers-color-scheme > dark`,在 first paint 前 set `data-theme` |
| Theme toggle icon morph | `ThemeToggle` | key=theme + `initial rotate:-30 scale:0.7 opacity:0`,spring 400/22 |
| Body bg / text 過渡 | `globals.css html, body` | `transition: background-color 180ms cubic-bezier(0.16,1,0.3,1)` |

### 3.9 Reveal / Skeleton(現況極弱)

- **沒有 `clip-mask reveal`、`Skeleton loader`、`Shimmer`**。loading 用 `LOADING…` hud 字或 `live-dot-amber`(CACHED 標)。
- **沒有 page transition wrapper**(每個頁面自己處理 enter)。

### 3.10 Reduced motion 尊重

`globals.css @media (prefers-reduced-motion: reduce)`:全部 animation-duration / iteration-count / transition-duration → 0.01ms !important。

`useShouldAnimate()` hook 可額外排除 background tab(visibility !== 'visible' 也回 false)。

---

## 4. 表單元件(現況 + 缺口)

**現有(僅這幾種,且都是內嵌實作不是獨立元件):**

| 類型 | 現況 |
|------|------|
| Button | **沒有**獨立 Button 元件。各處 inline 寫 `<button style={...}>`。模式有兩種:(a) glass(transparent + 1px border-glass)(b) accent(rgba(118,185,0,0.10) + signal 綠 border)。 |
| Toggle (on/off) | `DnaSwitch`(1 個)。 |
| Multi-choice | `SegmentedToggle`(1 個)。 |
| Slider | **沒有**通用 Slider。只有 `LifecycleCard` 內嵌的 `<input type="range" class="slider-lifecycle">`(globals.css 自定 thumb)。 |
| Search input | `PluginDashboard` 內嵌 `<input>`。沒抽出。 |
| Textarea | `OracleChat`、`ConsoleView` 內嵌(各自用 ref + auto-resize 邏輯)。 |
| Select / Dropdown | **完全沒有**。`PluginControlPill` 用 button + AnimatePresence 模擬。 |
| Checkbox / Radio | **完全沒有**。 |
| Color picker | **完全沒有**。 |
| Date picker | **完全沒有**。 |
| Combobox / Autocomplete | **完全沒有**。 |
| File upload / dropzone | `MassingGenerator` 內嵌(沒抽出)。 |

### 缺口

> **整套表單元件等於沒有**。要做標準化儀表板 / setting 頁,必須自寫或引 shadcn/ui。

建議補齊優先級:
1. `<Button variant="ghost\|primary\|destructive" size="sm\|md\|lg">` — 整站 inline button 統一
2. `<Slider>` — `slider-lifecycle` thumb 樣式抽出來
3. `<TextField>` + `<TextArea>` — chat / search 共用
4. `<Select>` + `<Combobox>` — 還沒需要過,但 Phase 2 一定會要

---

## 5. 訊息 / 狀態 / 通知元件

| 類型 | 現況 |
|------|------|
| **Toast** | ✅ **僅 `metrics/components/Toast.tsx`**。global listeners + `fireToast(msg)` 函式調用 + `<ToastHost />` 容器。2.4s auto-dismiss,`bottom-right`,signal 綠左 2px border。**整站只此一份,該抽到 `components/primitives/`**。 |
| Snackbar | 同 Toast,沒區分。 |
| Dialog / Modal | **完全沒有**。`PluginDashboard` 的搜尋是 inline。`PluginControlPill` dropdown 有 outside-click + ESC 但不是真 modal。 |
| Sheet / Drawer | **完全沒有**。 |
| Tooltip | **沒有元件,純用 HTML `title`**(StatusPill 等)。framer 有 `whileHover` 但沒有「氣泡 tooltip 元件」。 |
| Popover | **沒有**。`PluginControlPill` 的 dropdown 是手刻的。 |
| Context menu | **完全沒有**。 |
| Skeleton loader | **完全沒有**。loading 都用「LOADING…」hud 字 + amber dot。 |
| Empty state | 通常 inline `// NO MOUNT REGISTERED` hud 文字 + 解釋句。沒抽出 EmptyState 元件。 |
| Error boundary | **沒有 React `ErrorBoundary`**。chat 用 `error` prop 處理。 |
| Inline alert | `error` 條樣式重複出現多處(rgba(244,63,94,0.08) bg + 28% border + rose 文字 + `// ` 前綴)。沒抽 Alert 元件。 |

### 缺口
> **Toast 應立刻抽出。Dialog / Tooltip / Skeleton / Alert 都應補。Drawer 用了再說。**

---

## 6. 排版容器 / Layout primitives

| 類型 | 現況 |
|------|------|
| **`ExtPageShell`** | ✅ `monitor-control/primitives/ExtPageShell.tsx`。4-section page wrapper(Scenario / Canvas / Analysis / Actions),每段 `01-04` 編號 chip + uppercase 標題 + 1px divider line。**這是整站最定型的 page-content 結構,該抽出共用**。 |
| `Section` (內) | `ExtPageShell` 內,`{ num: '01', label: 'SCENARIO', children }`。 |
| `Card` (簡化) | `ExtPageShell` 內,`tone: glass\|flat`,沒 cursor tracking 的精簡版 GlassCard。 |
| Container `max-w-*` | inline。常見 `max-w-7xl mx-auto`(7xl = 80rem = 1280px)和 `max-w-[1400px]` `max-w-[1600px]`。 |
| Grid helpers | inline。Studio shell 有 `gridTemplateColumns: 180px 160px minmax(0, 1fr)`。Network grid 用 Tailwind `grid grid-cols-1 sm:2 lg:3 xl:4 gap-4`。 |
| Flex helpers | inline。 |
| Divider | 兩種:**1px solid `var(--c-border-subtle)`** 或 **1px dashed `var(--c-pill-border)`**(`StudioNav` 分隔 PILLARS / FOUNDATIONS)。 |
| Stepper | 沒有(用 `01-04` chip 代替)。 |
| Progress bar | 沒有獨立元件。 |
| Tab nav | `metrics/components/TabNav.tsx` 模組 local。 |
| Stat card | `moisture/_stubs/Stat`,`metrics/KPICard`(較複雜版)。 |

### 缺口
> 應該把 `ExtPageShell` + `Section` + `Card` + `Stat` 4 件升到 `components/layout/`。這幾個是真的整站重複用最頻繁的版面 pattern。

---

## 7. 視覺裝飾語彙(decorative vocabulary)

| 元素 | 來源 | 用法 |
|------|------|------|
| **Noise overlay** | `globals.css .noise-overlay` | 全站 fixed 蓋層,SVG fractalNoise 0.85 baseFrequency,200×200,opacity 0.028,mix-blend overlay。 |
| **Ambient signal glow** | `layout.tsx 內嵌 div` | top-left -10% -15% 起 55vw 圓 radial gradient `rgba(118,185,0,0.065)` → transparent 65%。 |
| **HUD corner brackets** | `HudCorner` | 4 角 L 形(10×10),只畫 2 邊邊框。`PluginDashboard` ext card 頭尾用。 |
| **HUD grid bg** | `globals.css .hud-grid / .hud-grid-sm` | 40px / 20px 格線(linear-gradient `var(--c-border-subtle)` 1px),用於 3D canvas 背景。 |
| **HUD dot indicator** | `live-dot-*` × 5 色 | 6×6 圓 + 脈衝 box-shadow。 |
| **Numbered section chip** | `ExtPageShell.Section`、`metrics/TabNav` | `01 / 02 / 03 / 04` mono-num,signal 綠 8% 底 + 22% border + signal 文字。 |
| **Section divider line** | `ExtPageShell.Section` | `flex-1 h-px` `rgba(255,255,255,0.06)`,接在標題後填滿橫向。 |
| **Dashed pill divider** | `StudioNav` | `1px dashed var(--c-pill-border)`,分隔 PILLARS / FOUNDATIONS。 |
| **`◆` (diamond)** | `PhaseBadge` | 琥珀 chip 開頭。 |
| **`◉` (target)** | `PluginControlPill` | 觸發按鈕 icon 字符。 |
| **`◈` (diamond crystal)** | `OracleChat.OracleAvatar` | LLM avatar 字符。 |
| **`↳` (return arrow)** | `LifecycleCard` phase 標、各處 caption | annotation 前綴。 |
| **`{ X }`(curly brackets)** | `StudioHeader`, `PillHeader` wordmark | 包裝品牌字 / 標題,signal 綠括號 + 普通字粗體。 |
| **`//` (comment)** | `// PHASE 1A · SCAFFOLD`、`// NO MOUNT REGISTERED`、`// BRIDGE OFFLINE` | hud 字前綴,代碼註解風格 caption。 |
| **`·`(middle dot)** | spec chain | hud-sm 串接多個資訊 `DEVICES · ONLINE · CAMERAS`。 |
| **`→ / ←`(arrows)** | OPEN WEB → · `← BACK` · `← SWIPE TO CYCLE →` | call-to-action / hint。 |
| **`●`(filled circle)** | DemoPill 開頭 | 緊跟 `MODE DEMO` 之前。 |
| Tabular `lining-nums` | `mono-num` class | 等寬數字,確保 IP / 計數對齊。 |
| `tracking-widest` | wordmark | wordmark `VISTWIN` 字距加大。 |

### 視覺風格 1 句總結
**"Control-room HUD" + glassmorphism + iOS 質感 + 點陣計數器 + 訊號綠脈衝 + 噪訊紋理。**所有裝飾都遵循一條:**code aesthetic** — 大括號、註解符、編號、箭頭、銳角 chip,讓 UI 像在讀程式碼。

---

## 8. 符號系統(Typographic & Glyph)

| 符號 | 用法定義 | 使用範例 |
|------|---------|----------|
| `{ X }` | wordmark / section title 包裝 | `{ VISTWIN }` `{ NETWORK } / 0.3` |
| `// X` | meta-comment / phase / state | `// PHASE 1A · SCAFFOLD` `// BRIDGE OFFLINE` |
| `↳ X` | annotation / phase indicator | `↳ 建築青壯期` `↳ 即將推出` |
| `· ` | chain divider(空隔) | `MODE DEMO · MOCK DATA` `Visionbase 區網裝置監控 · 視覺分析` |
| `→ / ←` | navigation / CTA / hint | `OPEN WEB →` `← SWIPE TO CYCLE →` |
| `●` | filled state dot(LIVE / DEMO) | DemoPill |
| `◆` | phase / build phase indicator | PhaseBadge |
| `◉` | plugin / target | PluginControlPill |
| `◈` | AI / oracle | OracleAvatar |
| `/` | version path | `{ NETWORK } / 0.3` |
| `01 / 02 / 03 / 04` | mono-num section number | ExtPageShell |
| ALL CAPS letterspaced | label / status | `LIVE / FRESH / CACHED / LOADING…` |
| `…` (ellipsis,真三點) | progressive state | `LOADING…` `掃描中…` |
| 中文括號避用 | 一律用半形括號或 `{ }` | — |

---

## 9. Hooks(10 個)

| 檔案 | 名稱 | 用途 |
|------|------|------|
| `useKitBridge.ts` | `useKitBridge` | WebSocket → Kit bridge `:8765`。auto-reconnect,exposes `state`(per-plugin runtime)+ `sendCommand(op, id)` + `status` + `url`。**整站 plugin 控制核心。** |
| `useCameraBridge.ts` | `useCameraBridge` | Camera control bridge,`CameraVec3`、`CameraEasing` types。 |
| `useKitAction.ts` | `useKitAction` | 一次性 Kit action 包裝,`status: "idle" | "queued" | "done" | "error"`。 |
| `useOsc.ts` | `useOsc` | OSC bridge `ws://localhost:9000`,`send(addr, value)`。 |
| `useMqtt.ts` | `useMqtt` | MQTT bridge `ws://localhost:3001`,給 LiveEnvCard 用。 |
| `useMockStream.ts` | `useMockStream<T>` | 用 schema 驅動的 seeded random stream(2-5 Hz),Phase 2 改成 `useKitStream` 的 dual。 |
| `useDataSource.tsx` | `DataSourceProvider` + `useDataSource` | mode = `"live" | "demo" | "offline"` 切換 context。 |
| `useShouldAnimate.ts` | `useShouldAnimate` | 整合 `prefers-reduced-motion` + tab visibility,回 boolean。 |
| `useTheme.ts` | `useTheme` | 讀 `data-theme` attr,回 `"dark" | "light"`。 |
| `index.ts` | barrel | re-exports useMockStream / useDataSource / useKitAction。 |

---

## 10. Lib(13 個)

| 檔案 | 主要 export | 用途 |
|------|------------|------|
| `motion.ts` | `springs.{snappy,smooth,elastic,hefty,carousel}` | 5 種 spring preset(stiffness/damping)。 |
| `colormap.ts` | `sampleColormap` `colormapCss` `buildLut` `colormapGradient` | viridis / turbo / hud 三種 colormap。 |
| `vizTheme.ts` | `VIZ_PALETTE` `WIND_HEAT_STOPS` `windHeatGradientCss` `hudColormap` | 3D scene + canvas-heatmap 雙主題配色。 |
| `studio-shell.ts` | `TIER_PLUGINS` `findPluginTier` `findPlugin` `STATUS_HEX` | StudioShell 三欄殼的 plugin/tier 解析邏輯。 |
| `massing.ts` | `generateMass` `PRESETS` (3 種 building mass) | massing 生成。 |
| `solar.ts` | `sunPosition` `sunTimes` `sunArc` `sunDirection` `rad` `deg` | NOAA solar position 計算。 |
| `sunlight/cities.ts` | 全球城市 lat/lon 資料庫 | sunlight studio。 |
| `sunlight/noaa.ts` | NOAA algorithm | 同上。 |
| `presentation.ts` | `CAMERA_PRESETS` `EASING_CURVES` `easingFor` `SCENE_BUILDINGS` | presentation camera 預設 + 建築場景。 |
| `pyodide-runner.ts` | `PYODIDE_VERSION` `pyodideBaseUrl` `isLoading` | 在瀏覽器跑 Python。 |
| `ws.ts` | `createWSClient` `WSClient` interface | 共用 WebSocket helper(reconnect / heartbeat / queue)。 |
| `ai/provider.ts` | `chatModel` (groq llama-3.3-70b) | LLM provider config。 |

---

## 11. 工程約定(從 `CLAUDE.md` + `AGENTS.md` 萃取)

### 路由
- ✅ Flat:`/<module>`(`/console` `/wind` `/solar`),**禁止** `/studio/<module>`
- `(studio)` 是 route group,不出現在 URL
- 新模組必須加到 [`StudioNav.tsx ITEMS`](src/components/studio/StudioNav.tsx) — 不加就看不到入口
- `/dashboard` 永遠是 Plugin Control,**禁止**改成 BI;BI 用 `/metrics`

### 模組結構
```
src/app/(studio)/<module>/
  page.tsx          ← server,thin wrapper(metadata + StudioHeader + <ClientView/>)
  ClientView.tsx    ← "use client";所有互動
src/modules/<module>/
  mocks.ts                    ← seeded random,deterministic
  <ModuleView>.tsx            ← 主畫面
  tabs/  或  analysis/         ← optional sub-sections
  MODULE_NOTES.md             ← optional
```

### Mock 規格
- Seeded random(固定 seed → deterministic demo)
- Update rate **2-5 Hz**(超過 5 Hz 會卡 layout)
- `useMockStream` 跟未來 `useKitStream` 同 interface(Phase 2 drop-in)
- 斷線時 fallback to mock,UI 仍可用

### Anti-patterns
- ❌ `/studio/<module>` URL
- ❌ 自寫 StudioLayout / ExtPageShell wrapper
- ❌ 在 server component 直接讀 `localStorage` / `window`(SSR 會炸)
- ❌ 開工前不 ls 現有 `(studio)/` + 不讀 console / massing 範例
- ❌ 重新發明 LineChart / BarChart / KPICard(plugin branch 已有)

### Next.js 16 特殊點
- `middleware.ts` → **`src/proxy.ts`**,export `proxy`
- page props 的 `params` / `searchParams` 是 **async**
- React 19 `use()` / Server Actions 已是一級

---

## 12. 缺口分析(總結)

### 紅色:做新項目前必須補的

| 缺口 | 影響 | 建議 |
|------|------|------|
| **沒有共用 Toast** | 每個 module 自己手刻或用 alert | 把 `metrics/Toast.tsx` 抽到 `components/primitives/Toast.tsx` |
| **沒有 Button 元件** | 每處 inline,難維護 | 抽 `<Button variant size>`,base 用 OSCButton 4-state 機制 |
| **沒有 ExtPageShell 共用版** | `monitor-control` 自己有,其他 module 沒用到 | 抽到 `components/layout/ExtPageShell.tsx` |
| **沒有 Skeleton loader** | loading 用「LOADING…」字撐場 | 寫一個 shimmer 版 |
| **沒有 Dialog / Modal** | 真要做設定頁會缺 | shadcn 或自寫(headless-ui) |
| **沒有 Tooltip 氣泡** | 純用 HTML title | radix-ui `<Tooltip>` 或自寫 |
| **沒有 Form 一整套** | Input / Select / Checkbox / Radio / DatePicker / Slider 全部沒有 | 看是否 Phase 2 引 shadcn,還是繼續手刻 |

### 黃色:有但需要整合

| 重複 | 影響 | 建議 |
|------|------|------|
| **每個 module 自帶 `_stubs/primitives.tsx`** | 設計債 | 統一為共用版 |
| `StatusPill` 在 root + monitor-control 各一份 | 微差異 | 合併並擴 `StatusKind` |
| `LineChart` / `BarChart` / `HeatmapCanvas` 在 charts/ + metrics 各一份 | 早期 plugin-branch 平行 | 全 import root chart |
| Wind / Solar / Moisture / BIM 的內部 chart 包裝重複 | 同上 | 同上 |

### 綠色:已經很好

- GlassCard / DnaPrimitives / chart-theme / vizTheme / hooks 設計成熟
- 主題系統(雙主題 CSS vars + anti-FOUC)成熟
- Motion lab(5 patterns)是寶藏,直接搬

---

## 13. 風格測試 testbed 建議

**測新風格(換主色 / 換字 / 換 motion 曲線 / 試 brutalist)應該動哪幾個檔案、不該動哪幾個?**

### 🟢 testbed 候選(props 可調 / 視覺顯眼 / 不會 ripple 全站)

| 元件 | 為什麼是好的測試對象 |
|------|----------------------|
| **GlassCard accent / breathe / interactive** | 改 props 立刻看到影響;不改 source。改 `ACCENT_MAP` 可以全站換主色。 |
| **CardCarousel / CardFlip / CardStack** | 都是孤立的 demo 元件,改一個不影響別頁。 |
| **OSCButton matrix** | 自帶 demo 矩陣 5×3,直接改 accent 就看到變化。 |
| **PageDots accent** | 改 prop 可比 layoutId 環行為。 |
| **PluginControlPill dropdown** | 改 spring / motion params 可試「該不該那麼快」。 |
| **DnaSwitch / SegmentedToggle** | active 色、spring 都可調 props;適合做 「accent system」 的 a/b test。 |
| **chart-theme.ts** | 改 `CATEGORICAL_PALETTE` / `TOOLTIP_STYLE` 可一次影響所有 charts。 |
| **PhaseBadge color** | 整站 amber 警告風格,要試 brutalist 改這裡看效果。 |
| **OracleOrb color shader** | 換 base color、`uNoiseScale`、`uBasePointSize` 看視覺。 |

### 🔴 不該動的(改了會牽動全站)

| 元件 / 檔 | 原因 |
|-----------|------|
| `globals.css :root --c-*` 變數 | 改錯會所有頁面崩 |
| `app/layout.tsx` 的 anti-FOUC script | 動了首次 paint 會 FOUC |
| `StudioNav` ITEMS / `plugins-registry.ts` | 動了所有 studio 頁的 sidebar 都跑掉 |
| `StudioShell` URL reconciliation | 動了首頁三欄殼會 query 解析錯 |
| `PresentationView.tsx`(1012 行) | 不要碰 |
| `hooks/useKitBridge.ts` | 動了 plugin 控制全壞 |
| `next.config.ts` / `proxy.ts` | route 級別影響 |

### 🧪 用 visionbase-monitor 做測試的具體入口

`visionbase-monitor` 已經 import 了 showcase 三件核心(`GlassCard`、`StatusPill`、`motion.ts`),且有自己的:
- `src/components/network/DeviceCard.tsx` — 卡片 testbed(改 accentForType / category icon / ownership pill style)
- `src/components/primitives/SegmentedToggle.tsx` — 控件 testbed(滑動高亮的 spring/color)
- `src/app/network/page.tsx` HUD bar — 分區/編號/分隔/分類色票 testbed
- `src/app/globals.css` — 直接複製自 showcase,可在這份 fork 動 token 試新主題

→ **建議流程:**
1. 在 `visionbase-monitor` 開 `style-test/<theme>` branch
2. 動 `globals.css` 的 `--c-*` token + `ACCENT_MAP` + `springs` preset
3. 在 `/network` 看 30 張不同 device card 同時呈現 → 一頁就看到「卡片 + ownership pill + category icon + filter chip + HUD bar + Phosphor icon」全部 7 個 pattern 的反應
4. 滿意後把改動 cherry-pick 回 showcase

### 📐 建議的「`style-test/`」branch 工作流

```
visustwin-showcase
  └─ style-test/brutalist
       └─ 改 globals.css token + chart-theme palette
       └─ 比對 /metrics + /dashboard + /wind 三頁
       └─ 通過 → cherry-pick to main

visionbase-monitor
  └─ style-test/<theme>
       └─ 同樣只改 token + ACCENT_MAP + springs
       └─ /network 一頁看密集 cards 反應
       └─ 通過 → 把 globals.css diff 拉回 showcase
```

或更激進:**把 globals.css 跟 motion.ts 從兩邊 git submodule 化或 npm workspace 化**,讓兩個 repo 共用同一份 design source。Phase 2 的 design-system 應該往這方向走。

---

## 附錄 A:Components 完整速查(40 件,site-wide)

```
primitives/
  GlassCard            (cursor-tracked radial-glow card,4 accent + hex)
  StatusPill           (live/demo/offline/error,銳角 chip + tooltip)
  DemoPill             (角落 MODE DEMO 標)
  index.ts             (barrel)

studio/
  DnaPrimitives        (PhaseBadge · Pill · SegmentedToggle · DnaSwitch · HudCorner · StudioHeader)
  StudioNav            (desktop sidebar) + StudioNavMobile (pill-strip)
  StudioShell          (3-col Miller shell on /)
  TierRail             (col 1)
  PluginRail           (col 2)
  ContentArea          (col 3,AnimatePresence 切換)
  pluginMounts         (registry)
  PluginDashboard      (plugin control hub)
  TierOverview         (tier-only landing)
  OracleOrb            (three.js point cloud)
  MassingGenerator     (massing UI)
  MassingViewer        (3D viewer)
  ConsoleView          (Ask + RUN dual mode)
  CameraPathView       (camera animator UI)
  PresentationScene    (1 scene)
  PresentationView     (full presenter,1012 行)
  SunlightScene        (SVG sun path)

cards/
  LifecycleCard        (年份 slider + 點陣計數器 + 粒子飛濺 + OSC)
  LiveEnvCard          (chip selector + MQTT/Open-Meteo)

motion/
  CardCarousel         (3D drag carousel)
  CardFlip             (Y-axis 翻牌)
  CardStack            (Tinder swipe)
  OSCButton            + OSCButtonMatrix (4-state OSC button)
  PageDots             (active dot + layoutId 環)

layout/
  PillHeader           (全站 fixed pill header)
  PluginControlPill    (header 中 plugin dropdown)
  MotionGallery        (5 patterns 統合展示)

charts/
  chart-theme          (palette / tooltip / axis)
  LineChart  BarChart  StackedBarChart  GaugeChart  HeatmapCanvas  WindRose
  index.ts

oracle/
  OracleChat           (LLM 對話,ThinkingDots + OracleAvatar 自製)
```

## 附錄 B:Modules 速查(86 件,7 個模組)

```
bim/        BimReviewView, BimViewer, LocalPrimitives, ScenarioPanel, StageTree, EsgTab, InspectorTab
metrics/    MetricsView, KPICard, TabNav, FilterBar, MultiSeriesChart, Toast/ToastHost,
            UnitTable, 6 個 _stubs (BarChart/GaugeChart/HeatmapCanvas/LineChart/ScatterChart/StatusPill/tokens),
            6 tabs (Overview/Energy/Environmental/Esg/Occupancy/Safety)
moisture/   MoistureView, FilterBar, FloorPlan, Gauge, LineChart, PmvScatter, TabNav, Toast,
            3 tabs (Comfort/RiskMap/Trend), _stubs (Panel/SeverityChip/Stat/ActionButton)
monitor-control/  ControlView (CameraPresetWall + ExtCardWall + MqttDeepLink),
                  MonitorView (CameraCanvas + EventFeed + AnalysisCharts + MoistureBlock + RecordingsGrid),
                  primitives (Charts/ExtPageShell/StatusPill)
solar/      SolarStudio, Actions, Scenario, AnnualBarChart, CompareBars, Gauges, UnitRankingTable,
            4 tabs (HeatmapFacade/ShadowPlan/SolarReport/SunPathPolar), _stubs
vision/     VisionView, VisionLiveCanvas, useVisionServer, analyzers, presets
wind/       WindStudio, WindCanvas, primitives (Panel/LawsonChips/etc.)
```

---

> 寫完。下次有人問「showcase 有什麼 component 可以抄」,直接給這份。
