> **LSeg = Language-driven Semantic Segmentation**  
> **CLIP = Contrastive Language–Image Pretraining**

而 LSeg 的整個架構，**就是建立在 CLIP 的基礎上**，把 CLIP 的語意空間延伸到 pixel-level segmentation。

---

## 🧠 簡單來說：

> **CLIP 是語意理解的基礎，LSeg 是把它變成逐像素語意的應用**

---

## ✅ 更具體地解釋：

|類別|CLIP|LSeg|
|---|---|---|
|任務目標|將圖片和文字拉到同一語意空間|將每個「像素」拉到對應的文字語意空間|
|輸入|一張整圖 + 一段文字|圖片（每個像素） + 一組語意標籤文字|
|模型用途|類別辨識、語意匹配|語意 segmentation（甚至 zero-shot）|
|Text Encoder|使用 CLIP 原本的文字 encoder（如 ViT-B/32）|**直接重用 CLIP 的文字 encoder**|
|Image Encoder|CLIP 的整圖 encoder|改造成「per-pixel」的 encoder（ViT, ResNet, etc）|
|特點|可以問圖「這是貓嗎？」|可以問「圖中有哪些東西像是 `grass`？」並畫出區域|
|Zero-shot 能力|對整張圖分類|對像素做 zero-shot 分類|

---

## ✅ LSeg 如何用到 CLIP？

LSeg 把 CLIP 拆成兩部分使用：

1. **Text Encoder（CLIP 原本的文字模組）**  
    → 將文字標籤（如 `"dog"`、`"tree"`、`"metal pole"`）轉成語意向量
    
2. **Image Encoder（改裝過的 CNN or ViT）**  
    → 將圖片的每個像素轉成語意向量
    

然後 LSeg 透過 **contrastive learning** 把 pixel 向量對齊到文字向量  
→ 讓模型學會「這個像素看起來像 'tree'」、「那一區像 'sky'」

---

## 📦 你實際執行 LSeg 時會看到：

- `clip` 模組（來自 openai/CLIP）：被 import 進來做文字嵌入
    
- `ViT` / `ResNet` 背骨：做 per-pixel feature embedding
    
- `CLIPSeg`、`CLIPTextEncoder`：是 LSeg 中的 component
    

---

## 🎯 如果用一句話總結：

> **LSeg 把 CLIP 的「整圖語意理解」能力，延伸成了「逐像素語意對齊」，讓語言控制 segmentation 成為**


[[Gaussian Splatting]]