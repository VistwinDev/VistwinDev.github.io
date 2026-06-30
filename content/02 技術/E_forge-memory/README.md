# E_forge 記憶區(dev 型 · Win 超級 App 專屬)

> 這是 **E_forge(dev 型 / Windows 超級 App)的本地記憶區**。對話 agent、loop 引擎、
> headless worker 都從這裡讀「開發準則 + 當前狀況 + 過往經驗」,所以**一開口就知道
> 我們在幹嘛、規矩是什麼、做到哪**。
>
> 與 **manager 型(Mac 超級 App)** 是同一個家族的兩端;manager 端另有自己從對話 + vault
> 累積的記憶庫。見 vault 既有筆記。

---

## ⚠ 衝突隔離契約(務必遵守)

兩個超級 App 共用同一個 vault,所以 E_forge 寫入**嚴格自我約束**,避免跟 manager 端 /
Obsidian 同步 / 手寫筆記撞車:

1. **只寫這個資料夾內**(`02 技術/E_forge-memory/**`)。**絕不**新增、改寫區外任何筆記。
2. **絕不下 `pm:` frontmatter**——這樣 manager 的 `pm: true` opt-in 永遠抓不到 E_forge 的檔。
3. **單一事實一個小檔、append-only**:不把多件事塞一檔,降低行級 merge 衝突。
   要修正舊結論 → 開新檔 + 在舊檔 frontmatter 標 `superseded_by`,不直接改舊內容。
4. **引用區外知識用唯讀連結**(wikilink / 路徑),不複製、不搬動。

## 結構

```
E_forge-memory/
├── README.md          ← 本檔(隔離契約 + 索引)
├── principles/        ← 準則(type: principle)— 不太變的規矩,從討論萃取
├── status/            ← 狀況(type: status)— 會變的當前狀態 + changelog
└── experience/        ← 經驗(type: experience)— 每輪 loop 的決策+結果+判決
    └── <domain>/<project>/exp-*.md
```

對話 agent 載入順序:`principles/*` → `status/current` → 最近的 `experience/*`。

## 來源連結(過去的 vault — 唯讀引用)

- 設計系統(rubric 來源):[[02 技術/Design-System/README|VisTwin Design System]]
- 當前焦點:[[Now]]
- 實體關係:[[00 系統/Entity_Map|Entity Map]]
