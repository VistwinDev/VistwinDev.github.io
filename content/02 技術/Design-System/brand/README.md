# VisTwin Brand & Logo — 標誌使用規範

> 本檔是 [VisTwin Design System](../README.md) 的 **§Logo 章節**。設計系統定義
> 配色、字型、HUD 語彙;本檔定義**標誌本身**——構成、留白、最小尺寸、變體、
> 誤用、雙語鎖版規則,以及全部可用檔案的索引。
>
> 核心原則延續系統語言:**克制、工程感、單一信號綠、純字標**。
> 標誌是純文字字標(wordmark),沒有獨立圖形符號——`{ }` 括號即品牌符號。

---

## 0 · 標誌系統(三件組 + 衍生)

| 變體 | 檔名 | 用途 |
|---|---|---|
| **主標誌 Primary**(堆疊括號鎖版) | `logo/vistwin-primary.svg` | 預設首選。封面、關於頁、簡報、正式文件 |
| **橫式 Horizontal** | `logo/vistwin-horizontal.svg` | 導覽列、信頭、email、頁首頁尾等橫向窄帶 |
| **英文字標 EN wordmark**(`{ VISTWIN }`) | `logo/vistwin-wordmark-en.svg` | 中文無法辨識的極小尺寸 / 純英文場合 |
| **縮寫標記 / Favicon**(`Vist.`) | `favicon/vist-mark-{light,dark,maskable}.svg` | 瀏覽器分頁、app icon、社群頭像、桌捷 |
| **社群頭像 Avatar**(全稱) | `favicon/avatar-social.svg` | 需放全名的大頭貼(FB / LinkedIn / GitHub org) |

每個 logo 變體都有 4 種配色版本(見 §4)。

> **縮寫標記 = `Vist.`**(Space Grotesk Bold,大寫 V,**句點即綠 signal 點** `#76B900`)。
> 早期 `{ V }` 版因易與 Channel V 混淆已棄用。檔案:
> `vist-mark-light`(白底深 V)· `vist-mark-dark`(黑底白 V)· `vist-mark-maskable`(圓角黑底,
> 供 iOS/Android app icon)· `vist-mark-transparent[-white]`(透明底,疊圖用)。各有 512 / 1024 PNG。

---

## 1 · 構成 Construction

主標誌由三段組成,**比例已鎖定,不可重排**:

```
{   VISTWIN   }      ← Space Grotesk Bold,字距 -0.03em,括號 = signal 綠
維 思 孿 生 科 技      ← Noto Sans CJK TC Medium,字距 +0.12em,zinc-600
```

- 英文行高 = **cap-height（基準單位 X = ½ cap-height）**。
- 中文行置中對齊英文行,基線間距 = 0.80 × cap-height。
- 括號與字之間留 0.28 × cap-height 的氣口。

> 構成圖見 `construction/logo-construction.svg`。

---

## 2 · 留白 Clearspace

四周淨空 **≥ X**(X = ½ cap-height ≈ 一個括號豎筆的高度)。
此範圍內不得有任何文字、線條、其他標誌或裁切邊。橫式版同樣以 X 為準。

```
┌─────────────────────────────┐   ← 虛線外即可放其他元素
│   X                         │
│   ┌───────────────────┐     │
│ X │   {  VISTWIN  }    │ X   │
│   │   維思孿生科技      │     │
│   └───────────────────┘     │
│                       X     │
└─────────────────────────────┘
```

---

## 3 · 最小尺寸 Minimum size

辨識度下限,低於此值請換用更精簡的變體:

| 變體 | 數位最小寬 | 印刷最小寬 |
|---|---|---|
| 主標誌(含中文) | 160 px | 32 mm |
| 橫式 | 200 px | 40 mm |
| 英文字標 `{ VISTWIN }` | 96 px | 20 mm |
| Favicon `{ V }` | 16 px | — |

中文在 < 14 px 會糊掉——這時改用**英文字標**或 favicon,不要硬縮主標誌。

---

## 4 · 配色變體 Colour variants

延續系統 §1:zinc 灰階 + **唯一** signal 綠 `#76B900`。每個 logo 有四版:

| 版本 | 檔名後綴 | 字標 | 括號 | 中文 | 用在 |
|---|---|---|---|---|---|
| Light（預設) | *(無)* | zinc-900 `#18181B` | 綠 `#76B900` | zinc-600 `#52525B` | 白 / zinc-50 底 |
| Dark（反白) | `-dark` | zinc-100 `#F4F4F5` | 綠 `#76B900` | zinc-400 `#A1A1AA` | zinc-900/950 深底 |
| Mono black | `-mono-black` | 全 `#18181B` | 同左 | 同左 | 傳真、蓋章、單色印刷、雷雕 |
| Mono white | `-mono-white` | 全 `#FFFFFF` | 同左 | 同左 | 深色照片 / 影片浮水印 |

規則:
- **綠色只出現在括號(或橫式版的 live-dot)**,其餘一律灰階。整版綠 = 禁止。
- 彩色版優先;**僅在**單色印製、蓋章、繡花、雷雕等製程才用 mono。
- 深底必用 `-dark` 或 `-mono-white`,**不可**把 light 版直接放深底。

---

## 5 · 雙語鎖版規則 Bilingual lock

中英是**鎖死的組合**,任一情境都成立:

- ❌ 不可只用「維思孿生科技」而拿掉 `{ VISTWIN }`(反之可——英文字標可單獨用)。
- ❌ 不可翻譯或改寫中文名(法定登記為「維思孿生科技」)。
- ❌ 不可改變上英下中的相對位置、字級比例、或拆成兩塊分開擺。
- ✅ 中文可在純英文國際場合省略(用英文字標),但**絕不**反過來。

---

## 6 · 誤用 Don'ts

| | |
|---|---|
| ❌ 換字型(用 system Arial / 黑體假冒) | 必須用外框檔,字型已轉 path |
| ❌ 換色、加第二強調色、整體上綠 | 綠只在括號 |
| ❌ 加漸層、陰影、外框光暈、emoji | 違反系統 §0 |
| ❌ 旋轉、傾斜、加粗、壓扁、describe 變形 | 等比縮放 only |
| ❌ 放低對比底(綠括號壓在綠/亮底) | 用 dark / mono 版 |
| ❌ 重新排列括號與字、改括號為 () [] | `{ }` 是品牌符號 |
| ❌ 把 logo 塞進有色色塊當貼紙 | 系統禁裝飾色條 |

---

## 7 · 檔案格式 File formats

- **SVG = 主檔**。所有文字**已轉外框路徑(outlined)**,因此**在任何機器、任何
  軟體都不依賴安裝字型**即正確算繪——可安全交給印刷廠、外包、客戶。
- **PNG** 為點陣輸出,透明底,供無法吃 SVG 的場合(email、部分社群、Office)。
- 需要新尺寸 PNG 時,從對應 SVG 重新匯出即可(見 §9 重建)。
- 印刷正式件若需 CMYK / PDF,把 SVG 丟給印廠轉,並指定特別色:
  signal 綠近似 **Pantone 376 C** / CMYK 約 `50 0 100 0`(打樣校色為準)。

---

## 8 · 應用物 Applications

| 物件 | 檔案 | 規格 |
|---|---|---|
| 名片 正 | `applications/business-card-front.svg` | 90 × 54 mm,深 slab + 置中鎖版 |
| 名片 反 | `applications/business-card-back.svg` | 90 × 54 mm,淺底 hairline frame + 聯絡欄 |
| 信頭 A4 | `applications/letterhead-a4.svg` | 210 × 297 mm,橫式 logo + HUD meta |
| Email 簽名 | `applications/email-signature.html` | 純 HTML 文字版 + 圖片版二選一 |

名片 / 信頭 / 簽名內的 `___` 為待填欄位(姓名、統編、地址、電話、網域)。
網域目前以 `vistwin.tech` 佔位,確定後全域替換。

---

## 9 · 重建 Regeneration

所有資產由文字外框管線生成(非手繪),可重現、可批改:

- 字型(本機需安裝):Space Grotesk(Latin)· Noto Sans CJK TC(中文)·
  JetBrains Mono(HUD)。`brew install --cask font-space-grotesk font-noto-sans-cjk-tc font-jetbrains-mono`
- 管線:`fontTools` 讀字型 glyf/CFF → `SVGPathPen` 轉 path → 組版輸出 SVG;
  PNG 用 `qlmanage`(macOS Quick Look)點陣。
- 生成腳本與字距/比例參數見專案記憶與 session 紀錄;改 logo 從同管線重跑,
  不要用手動描圖,以保字形精準。

---

## Related
- [VisTwin Design System](../README.md) — 配色 / 字型 / HUD 母規範
- [[Entity_Map]] — 「維思孿生科技」法人邊界正典
- `03 公司/` — 商標申請進度(目前暫緩監控搶註;此 logo 即未來送件基礎)
