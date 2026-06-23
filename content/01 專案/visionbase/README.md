---
# ── pm dashboard (vistwin-pm)：數值為初始預估，請自行調整 ──
pm: true
status: in-progress
owner: Francis
priority: P1
sprint: 2026-W21
progress: 35
area: 主線A · lab
created: 2026-04-29
tags: [project/visionbase, sprint/2026-W18]
---

# Visionbase

實踐大學 visionbase 實驗室。VisTwin 的學校合作單位,2026-04-29 起進駐並開始建置區網盤點與監控站。

## 合作單位

- **單位**:實踐大學 visionbase 實驗室
- **角色**:學校端合作 lab
- **物理進駐日**:2026-04-29

## 網路環境

| 項目 | 值 |
|---|---|
| SSID | visionbase 學校網路 |
| 子網 | `192.168.0.0/24` |
| 開發機本機 IP | `192.168.0.220`(`DESKTOP-JDT5BJ8`,Windows) |
| Router | `192.168.0.1`(ASUS RT-AX1800S,`RT-AX1800S-D6EC.local`) |

## 區網盤點現況(2026-04-29 首次掃描)

掃描範圍 `192.168.0.0/24`,共識別 **34 台裝置 / 29 在線**。完整清單見 [[01 專案/visionbase/network-inventory|network-inventory]]。

主要分類:

| 類別 | 數量 | 說明 |
|---|---:|---|
| 攝影機 | 14 | 3 台 TP-Link Tapo + 11 台 ACTi(`192.168.0.200-210`) |
| NAS | 1 | Synology `VISIONBASE_NAS.local`(`192.168.0.85`) |
| Router | 1 | ASUS RT-AX1800S(`192.168.0.1`) |
| Printer | 1 | Epson(`192.168.0.7`) |
| 機械手臂控制 PC | 1 | `VB-KUKA-Only.local`(`192.168.0.82`),Windows PC,**真正的 KUKA 控制器(KRC)不在此網段**;此 PC 是控制器旁的工作站 |
| 3D 印表機(疑似 Bambu) | 數台 | 從 OUI 判斷(Espressif / AMPAK)+ 開放 990/6000/8883 port |
| 電腦(桌機 / Mac) | 8 | 含本機 + Jantek Windows ×4 |
| 手機 / 平板 | 2 | iPhone / iPad |
| IoT(ESP32 等) | 4 | Espressif / 嵌入式 |
| 其他不明 | 數台 | Apple random MAC、Samsung、Liteon Yang-PC 等 |

## 工作模式

- **開發風格**:vibe coding,iterate 快速,每個 phase commit 一次
- **開發機**:VisTwin 公司端 Windows(`C:` 槽為主開發,`D:` 槽在另一台機器)
- **部署目標**:裝置監控網站跑在開發機(`192.168.0.220:3000`),長期可能搬到 Synology NAS 或專用 mini PC

## 子文件

- [[01 專案/visionbase/visionbase-monitor|visionbase-monitor]] — 今天開發的監控網站
- [[01 專案/visionbase/network-inventory|network-inventory]] — 34 台裝置詳細清單
- [[01 專案/visionbase/kuka-control-feasibility|kuka-control-feasibility]] — KUKA 監控 / 控制可行性研究

## 相關產品

- [[02 技術/VisTwin/README|VisTwin]] — Omniverse 物理空間數位孿生(visionbase 是物理基地)

## 返回

- [[01 專案/CLAUDE|01 Projects]]
