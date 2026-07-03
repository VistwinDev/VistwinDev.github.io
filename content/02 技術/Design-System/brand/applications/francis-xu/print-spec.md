# 名片 — 許峰銘 Francis Xu · 印刷規格

> 設計定案 2026-07-04。母版 HTML 與 PDF 同目錄。
> 依 [brand README](../../README.md) 品牌規範 + Design System 色彩/字型規範。
> **此為可重用模板**:換人時只改文字內容,版式/字距用固定系統值,不隨姓名長短調整。

## 檔案

A / B 兩版 × 國際 / 台灣兩尺寸 = 四份 PDF(每份 2 頁 = 正 + 背)。
A = 深品牌面 / 白人物面;B = 黑白互換。

| 檔案 | 內容 |
|---|---|
| `vistwin-card-A-intl-3.5x2.pdf` · `vistwin-card-B-intl-3.5x2.pdf` | **國際版 3.5 × 2 in** |
| `vistwin-card-A-tw-90x54.pdf` · `vistwin-card-B-tw-90x54.pdf` | **台灣版 90 × 54 mm** |
| `card-A-intl.html` · `card-B-intl.html` | 國際版母版 |
| `card-A-tw.html` · `card-B-tw.html` | 台灣版母版 |

## 尺寸（兩個版本並存)

**國際 / 美加版**
- 成品 **3.5 × 2 in**(88.9 × 50.8 mm),比例 1.75,美規出血 0.125 in
- PDF 頁面 3.75 × 2.25 in;已驗 MediaBox = **270 × 162 pt** ✓
- 母版 96dpi 原生像素排版(trim 336 × 192 px)

**台灣版**
- 成品 **90 × 54 mm**(比例 1.667),出血 3 mm
- PDF 頁面 96 × 60 mm;已驗 MediaBox = **271.9 × 169.9 pt**(≈ 96×60 mm)✓
- 母版原生排版(trim 340 × 204 px);名片簿 / 名片夾相容

兩版皆:離裁切線 3 mm(台)/ 0.125 in(國)內不置文字;文字與 logo 全向量、無縮放,列印清晰。

## 色彩

- PDF 為 RGB;交印廠請印廠轉 CMYK 打樣校色
- **Signal 綠 `#76B900`**(括號、live-dot)→ 指定 **Pantone 376 C**;CMYK 近似 `50 0 100 0`
- 深面底色 `#09090B` → 建議 rich black `C60 M50 Y40 K100`(依印廠標準)
- 灰階:zinc scale(見 Design System §1.1)

## 紙材與工藝（建議）

- **350–400 gsm 霧面棉卡**(消光、不反光,配大量留白)
- 單一招牌工法擇一:深面 `{ }` 括號 **燙綠箔(Pantone 376C 近似箔)** 或 **spot UV**
- **B 版注意**:背面深底白字,一般四色印易發灰 → 指定**白墨絹印**或**燙白箔**打底

## 內容（定稿）

**正面**(品牌面,三層):
- 頂:`● 維思孿生科技`(公司名+綠點微鎖版,11px→scaled / 0.18em)
- 中:`{ VISTWIN }` 外框鎖版 — 括號已縮至**與字母同高、上下對齊、左右氣口對稱**
- 底:tagline `數位孿生 × 人工智能 × 系統部署` + HUD `Digital twin × AI × System deployment`

**背面**(人物面):
- 上:小鎖版 `{ VISTWIN }` + `維思孿生科技 ●`(綠點右,與正面對稱)
- 主:`許峰銘`(大標)/ `Francis Xu`(字首大寫,非全大寫)
- 底:`執行總監` / `Chief Executive Officer` ‧ `+886 905 255 570` / `frncsxu@vistwin.com`

## 模板規則（換人沿用）

- 英文名:**字首大寫**、Space Grotesk 500、字距 0.02em(固定,不為對齊中文名寬度而調)
- 綠色僅出現在 `{ }` 括號與 live-dot,≤5%
- 公司名+綠點:11px / 0.18em,綠點與末字視覺間距約統一
- 職稱中英分列:中文掛「執行總監」、英文全稱「Chief Executive Officer」(使用者刻意,非 CEO 縮寫)

## 重建

```powershell
& "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --headless=new --disable-gpu `
  --no-pdf-header-footer --virtual-time-budget=20000 `
  --print-to-pdf="vistwin-card-A-print.pdf" "file:///<此目錄>/card-A.html"
```

字型走 CDN(Chiron Hei HK / Space Grotesk / JetBrains Mono / Noto Sans TC),需連網。
PDF 內字型為嵌入子集;若印廠堅持全外框,將 HTML 文字改由 fontTools 管線轉 path(見 brand README §9)。

## 待辦 / 選項

- [x] 國際 3.5×2in + 台灣 90×54mm 各出 A / B(共四份,已定案)
- [ ] 實際送印時挑「主用版」(A 或 B),或兩版都印一小批
- [ ] 括號垂直置中修正(brand `logo/` 母檔仍有「字偏上」原始偏移,可一併回寫全系列)
