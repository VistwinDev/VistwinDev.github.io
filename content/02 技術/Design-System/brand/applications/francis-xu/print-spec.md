# 名片 — 許峰銘 Francis Xu · 印刷規格

> 設計定案 2026-07-04(session 迭代 19 版)。母版 HTML 與 PDF 同目錄。
> 依 [brand README](../../README.md) §8 名片規格 + Design System 色彩規範。

## 檔案

| 檔案 | 內容 |
|---|---|
| `vistwin-card-A-print.pdf` | A 版:正面深 slab 品牌面 / 背面白底人物面(2 頁 = 正 + 背)|
| `vistwin-card-B-print.pdf` | B 版:黑白互換(正面白品牌 / 背面深人物)|
| `card-A.html` / `card-B.html` | 母版(可重新輸出 PDF,見下「重建」)|

## 尺寸

- **成品(trim)**:90 × 54 mm,橫式
- **出血(bleed)**:四邊各 3 mm → **PDF 頁面 = 96 × 60 mm**,底色已滿出血
- **安全區**:離裁切線 3 mm 內不置文字(目前版面最小邊距 ~7 mm,安全)

## 色彩

- PDF 為 RGB,交印廠時請印廠轉 CMYK 打樣校色
- **Signal 綠 `#76B900`**(括號、live-dot)→ 指定 **Pantone 376 C**;CMYK 近似 `50 0 100 0`
- 深面底色 `#09090B` → 建議 rich black `C60 M50 Y40 K100`(依印廠標準)
- 灰階:zinc scale(見 Design System §1.1)

## 紙材與工藝(建議)

- **350–400 gsm 霧面棉卡**(消光、不反光,配大量留白)
- 單一招牌工法擇一:深面 `{ }` 括號 **燙綠箔(Pantone 376C 近似箔)** 或 **spot UV**
- **B 版注意**:背面深底白字,一般四色印易發灰 → 指定**白墨絹印**或**燙白箔**打底

## 內容(定稿)

- 正面:`{ VISTWIN }` 外框鎖版(370/540 卡寬,括號已做垂直光學置中修正 +95 units)
  + `● 維思孿生科技` + tagline `智能數位孿生 · 企業系統架構` / EN HUD 行
- 背面:小鎖版 + `維思孿生科技 ●`(右上)/ `許峰銘`(54/540)+ `FRANCIS XU`
  / `執行總監` + `Chief Executive Officer`(左下)/ `+886 905 255 570` + `frncsxu@vistwin.com`(右下)

## 重建

```powershell
& "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --headless --disable-gpu `
  --no-pdf-header-footer --virtual-time-budget=20000 `
  --print-to-pdf="vistwin-card-A-print.pdf" "file:///<此目錄>/card-A.html"
```

字型走 CDN(Chiron Hei HK / Space Grotesk / JetBrains Mono / Noto Sans TC),需連網。
PDF 內字型為嵌入子集;若印廠堅持全外框,將 HTML 文字改由 fontTools 管線轉 path(見 brand README §9)。

## 待辦

- [ ] A / B 版擇定(或 A 正 + B 背混搭)
- [ ] **括號垂直置中修正(+95 units)回寫 `brand/logo/` 全系列母檔**——目前所有正式 logo 檔都有「字偏上」的原始偏移
