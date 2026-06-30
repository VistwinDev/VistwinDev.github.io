---
type: principle
name: thesis
updated: 2026-06-30
---

# 命題:E_forge 治 agent 的兩個根本弱點

E_forge 表面是「開發引擎」,真正在治的是 AI agent 的兩個病:

1. **要人催促**(沒自主延續,每步等人推)← 用 **n8n 強制迴圈** 治(自主器官:外部時鐘不等人就 re-invoke)。
2. **記憶力差**(context 滿就忘、跨 session 歸零)← 用 **vault 經驗庫** 治(記憶器官:外部化、可召回)。

兩者必須咬合:有迴圈無記憶 = 瞎忙不變強;有記憶無迴圈 = 知識躺著不動。
飛輪 = 迴圈驅動動作 → 記憶讓動作更聰明 → 動作再產出記憶 → **複利自主**。

E_forge = 一個 harness,讓 agent 不必自己擅長「驅動」與「記憶」,由 harness 供給。
