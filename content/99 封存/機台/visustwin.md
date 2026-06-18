---
machine: true
hostname: VisTwin
role: home
user: visus
os: Microsoft Windows 11 Home
created: 2026-05-19
last_check_in: 2026-05-19 21:04
tags: [machine, fleet]
---

# VisTwin

> Fleet node. Auto-maintained by `heartbeat.ps1`. Do not hand-edit the
> HEARTBEAT block below.

<!-- HEARTBEAT:START -->
_Last heartbeat: 2026-05-19 21:04_

## Git repos (~/VisTwin)

| Repo                 | Branch                          | State      | Ahead | Behind | Last commit                                                                                                 |
| -------------------- | ------------------------------- | ---------- | ----- | ------ | ----------------------------------------------------------------------------------------------------------- |
| ArchVizExplorer      | master                          | dirty (8)  | -     | -      | (no commits)                                                                                                |
| kit-app-template     | main                            | dirty (18) | 0     | 2      | 2204ecb Removing .claude folder (#146) (9 weeks ago)                                                        |
| obsidian             | master                          | dirty (5)  | 0     | 0      | 93f3b89 vault backup: 2026-05-19 07:34:52 (14 hours ago)                                                    |
| outside-the-frame    | main                            | dirty (3)  | 0     | 0      | d3b1651 Default /wall-lab to 3D Depth (match showcase preference) (3 hours ago)                             |
| vistwin-kiosk        | master                          | clean      | 0     | 0      | 2e45467 chore: initial analysis report (3 weeks ago)                                                        |
| visustwin-extensions | master                          | dirty (25) | 0     | 0      | 748791c feat: add ventilation.report + visustwin.fonts; report readability + CJK font support (3 weeks ago) |
| visustwin-showcase   | main                            | dirty (3)  | 0     | 0      | 4a04f9b refactor: extract plugins to visustwin-plugins-web; become pure design lab (3 weeks ago)            |
| visustwin-vision     | feat/headless-server-mjpeg      | dirty (3)  | 0     | 0      | 60a8e79 feat: headless server + MJPEG streaming for web-first vision (4 weeks ago)                          |
| visustwin-website    | master                          | dirty (1)  | 0     | 0      | 74b1de6 LocaleSuggest mobile back to top + LanguageSwitcher dropdown align fix (5 weeks ago)                |
| visustwin_yolo       | master                          | clean      | 0     | 0      | a2bc625 初始化 (1 year ago)                                                                                    |
| WebController        | claude/docs-bootstrap-all-repos | clean      | 0     | 0      | 413bd29 docs: extend CLAUDE.md into full agent bootstrap (4 weeks ago)                                      |
| welltek-twin         | claude/docs-bootstrap-all-repos | clean      | 0     | 0      | 5a116eb docs: add agent bootstrap CLAUDE.md (4 weeks ago)                                                   |

## Listening ports

Watched: 3005

## VisTwin processes

(none)
<!-- HEARTBEAT:END -->

## 硬體規格

> 使用者確認 2026-06-14；spec 由 PowerShell WMI + `nvidia-smi` 抓取。

- **品牌型號**：ASUS ROG Zephyrus G15 (GA503QS) — 2021 旗艦款
- **CPU**：AMD Ryzen 9 5900HS（8C / 16T，base 3.3 GHz）+ 內建 Radeon iGPU
- **GPU**：NVIDIA GeForce RTX 3080 Laptop GPU，**8 GB VRAM**（driver 576.52）
- **RAM**：48 GB
- **OS**：Microsoft Windows 11 Home，build 26200（v10.0.26200）
- **目前顯示**：3440 × 1440 @ 60 Hz（外接超寬螢幕；內建面板 15.6" 2560×1440 165Hz 未列入當前 active output）

## Physical AI / Omniverse 適用性

- **Isaac Sim 最低需求**：RTX 卡 + ≥ 8 GB VRAM ✅ **剛好達標**
- **Omniverse Kit**：可開發，但 mobile RTX 不在官方 supported list，會有 caveat（部分 RTX features / DLSS 變體可能 fallback）
- **VRAM 邊界警告**：8 GB 對大型 Isaac scene + 多 sensor 同時 simulation 偏緊；單 robot demo OK，多 KUKA + sensor stack 須留意 OOM
- **主線 A（Physical AI）執行端**：lab 重型機台優先；**本機定位 dev / showcase 攜帶機**，不負擔長時間 training / large-scale simulation

## Related

- [[_fleet-index|Fleet Index]]
- [[../00 系統/技能/dev-state-overview/SKILL|dev-state-overview]]