# 名片 — 許峰銘 Francis Xu · 印刷規格

> 設計定案 2026-07-04。母版 HTML 與 PDF 同目錄。
> 依 [brand README](../../README.md) 品牌規範 + Design System 色彩/字型規範。
> **此為可重用模板**:換人時只改文字內容,版式/字距用固定系統值,不隨姓名長短調整。

## 檔案

黑版 / 白版 × 國際 / 台灣兩尺寸 = 四份 PDF(每份 2 頁 = 正 + 背)。
**黑版** = 正反皆深(白 VISTWIN / 白 許峰銘);**白版** = 正反皆白(黑 VISTWIN / 黑 許峰銘)。
綠只在 `{ }` 括號與 live-dot。字標維持官方**全大寫 `{ VISTWIN }`** 外框鎖版(與品牌系統一致)。

| 檔案 | 內容 |
|---|---|
| `vistwin-card-black-intl-3.5x2.pdf` · `vistwin-card-white-intl-3.5x2.pdf` | **國際 3.5 × 2 in**(黑 / 白)|
| `vistwin-card-black-tw-90x54.pdf` · `vistwin-card-white-tw-90x54.pdf` | **台灣 90 × 54 mm**(黑 / 白)|
| `card-black-intl.html` · `card-white-intl.html` | 國際版母版 |
| `card-black-tw.html` · `card-white-tw.html` | 台灣版母版 |

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

## 內容 / 版面（最終定稿）

**兩頁共通上排**:左 `● 維思孿生科技`(綠點在左);右 = **聯絡資訊 + 綠箭頭 `↗`**——
正面 `vistwin.com ↗`、背面 `<email> ↗`。**正反面聯絡皆在右上、同 9px 同字距、與左方公司名上下緣切齊。**

**正面**(品牌面):
- 上排如上;中:`{ VISTWIN }` 大標,**放大到左緣貼左界、右緣接近右界(既靠左又置中)、上下置中**;
- 左下:一條短槓 + tagline `數位孿生 × BIM應用 × 人工智能部署` + HUD `Digital twin × Applied BIM × AI deployment`。
  - **BIM 刻意標「應用 / Applied」**:VisTwin 做的是 BIM 之上的應用,非 BIM 建模本身;與「人工智能部署」平行(皆「我們應用/落地」),`數位孿生` 才是核心產品。

**背面**(人物面,四角平衡構圖):
- 右上:Email + `↗`(如上,與左公司名切齊);
- 中左:`許峰銘`(大)+ `執行總監`——視覺主角;其下一條短槓;
- 左下:`{ VISTWIN }` 小鎖版(**字灰、綠括號**)當頁腳壓底;
- 右下三排:`Francis Xu` / `Chief Executive Officer` / `+886 905 255 570`(名字/職稱/電話,電話壓最底);
- **切齊**:左下小標下緣 = 右下三排下緣;右上聯絡上緣 = 公司名上緣(flex `flex-start`/`flex-end`,實測差 0)。

## 設計系統(模板規則,換人沿用)

- **層次 = 三階**。純身分(亮/黑)只給三件:**大標 `{ VISTWIN }` / 中文名 `許峰銘` / 中文職稱 `執行總監`**;
  其餘全部次階;tagline 英文 HUD 為最弱階。灰階照 mirror-flip:
  白版 `#18181B / #52525B / #A1A1AA`;黑版 `#F4F4F5 / #A1A1AA / #52525B`。
- **字體三支**:CJK = Chiron Hei HK;**小拉丁全部 mono(JetBrains Mono)**(拼音/職稱英/電話/Email/網址);
  大標 = 外框 Space Grotesk。mono 字距統一 `0.02em`;疏排線(公司名/tagline/HUD)`0.2em`;中文名/標籤 `0.08em`。
- **綠只在**:`{ }` 括號、公司名 `●`、**兩頁右上聯絡箭頭 `↗`(正面網址 + 背面 Email)**。
  **槓:白版綠、黑版灰**,`.bar` 兩頁同絕對位置(left:29 / bottom:54,翻面重合);背面槓落在大名下方。
- **背面小鎖版 `{ VISTWIN }` 字為次階灰**(白版 `#52525B` / 黑版 `#A1A1AA`),非深身分色——只有正面大標、中文名、中文職稱是純身分色。
- **英文名 = 字首大寫**(Francis Xu,mono 400);職稱中英分列(中文「執行總監」+ 英文全稱「Chief Executive Officer」,
  刻意非 CEO 縮寫)。網域 `vistwin.com`(不用 www/https)。
- **加工**:霧底 + 亮字;白版 spot UV、黑版燙白+綠箔;**直角不圓角**(見「印廠下單說明」)。

## 重建

```powershell
& "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --headless=new --disable-gpu `
  --no-pdf-header-footer --virtual-time-budget=20000 `
  --print-to-pdf="vistwin-card-A-print.pdf" "file:///<此目錄>/card-A.html"
```

字型走 CDN(Chiron Hei HK / Space Grotesk / JetBrains Mono / Noto Sans TC),需連網。
PDF 內字型為嵌入子集;若印廠堅持全外框,將 HTML 文字改由 fontTools 管線轉 path(見 brand README §9)。

## 待辦 / 選項

- [x] 國際 3.5×2in + 台灣 90×54mm 各出 黑 / 白(共四份,已定案)
- [ ] 實際送印時挑「主用版」(黑 或 白),或兩版都印一小批
- [ ] 括號垂直置中修正(brand `logo/` 母檔仍有「字偏上」原始偏移,可一併回寫全系列)
