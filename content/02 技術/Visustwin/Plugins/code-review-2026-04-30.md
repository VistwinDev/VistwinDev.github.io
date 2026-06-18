---
created: 2026-04-30
tags: [audit, security, code-review, project/VisTwin]
---

# 2026-04-30 Plugin Code Review

> Scope:六個今日動過的 ext + `AUTHORING_STANDARD.md`
> Tools:`ruff 0.15.12`(rules `E,F,W,B,S,PERF,C4,SIM,RET,RUF`)+ `bandit 1.9.4`
> Audit data:`C:\Visustwin\_audit\{ruff.txt,bandit_all.txt}`(原始 6073 LOC,354 ruff issues,30 bandit findings)

---

## 摘要

**沒有 Critical 等級問題**(Kit 啟動正常、6 ext 功能驗證過、bandit 無 HIGH/MEDIUM)。

| 嚴重度 | 數量 | 必修時機 |
|---|---|---|
| Critical | **0** | — |
| High(真 bug)| **3** | 下個 push 前必修 |
| Medium(品質/可維護性)| **9** | 下個 sprint 內 |
| Low / Nit | **~30** | 有空 / 用 `ruff --fix` 自動處理 |

**其中 3 個 High 都集中在 `visustwin.fonts/font_setup.py` 跟 `*.report/extension.py` 的 async / 反射模式上**,跟 CJK 字型修復與 Phase 3 readers 是同一晚趕出來的東西。

---

## High(下個 push 前修)

### H1. `register_omni_ui_font` 內 `carb` 變 local,font 缺失時會 `UnboundLocalError`

**位置:** `visustwin.fonts/visustwin/fonts/font_setup.py:145`(ruff F823)

**問題:**
```python
def register_omni_ui_font() -> bool:
    font_path = get_cjk_font_path()
    if not os.path.isfile(font_path):
        carb.log_error(...)        # ← line 145, `carb` 在這當 local 看
        return False
    ...
    try:
        import carb.settings        # ← 這行讓整個 function scope 把 `carb` 視為 local
```

Python 名稱解析規則:**只要函式裡任何位置有 `import carb.settings`,整個 function 把 `carb` 當 local 變數**。所以 `carb.log_error` 在 import 之前 reference 會丟 `UnboundLocalError`,而不是預期的「file missing」錯誤訊息。

**目前未爆炸的原因:** 我們 bundle 的 NotoSansTC.otf 一定存在,`os.path.isfile(font_path)` 永遠 True,line 145 從沒執行。但只要有人移走 / 重新命名 font 檔,Kit 啟動就會 stack trace。

**風險:** Hard-to-debug error in production scenarios where the font got moved. Symptom 是 `UnboundLocalError: cannot access local variable 'carb'` — 完全不指向真因。

**建議 fix:**
```python
# 把 `import carb.settings` 移到 module top:
import carb
import carb.settings    # ← 加在 top
```
或 rename 內層 import:
```python
try:
    from carb import settings as _carb_settings
    settings = _carb_settings.get_settings()
    ...
```

### H2. `asyncio.ensure_future` × 8 處沒存 reference,task 可能被 GC

**位置(所有今日改過 ext 都有):** ruff RUF006
- `visustwin.dashboard/extension.py:209, 290`
- `visustwin.solar.report/extension.py:337, 489`
- `visustwin.ventilation.report/extension.py:324, 418` ← **最危險的一個**:`pop_out_async()` 是 report window 的彈出邏輯,被 GC = window 不出現
- `visustwin.wind.analysis/extension.py:391, 524`

**問題:**
```python
asyncio.ensure_future(self._report_window.pop_out_async())
# ↑ 沒人持有這個 task。Python 文件明確說:
#   "Important: Save a reference to the result of this function, to avoid a
#    task disappearing mid-execution. The event loop only keeps weak references
#    to tasks."
```

**風險:** 在 GC 壓力或 long-running session 下,task 可能在 `await` 之間被 collect,Generate 完按鈕沒反應、report window 沒彈,使用者重複按多次 → race condition。

**建議 fix:**
```python
self._task_pop_out = asyncio.ensure_future(self._report_window.pop_out_async())
# 或在 class 用 set 收集:
# self._tasks.add(asyncio.ensure_future(...))
# task.add_done_callback(self._tasks.discard)
```

`visustwin.ventilation.report` 那 2 處最該優先(影響使用者直接看到的 UI)。

### H3. 反射存取 `_INSTANCE._sys._positions` 對 ParticleSystem 重構脆弱

**位置:** `visustwin.ventilation.report/engine.py:148-160`(`read_particles_from_simulation`)

**問題:**
```python
inst = getattr(vent_ext, "_INSTANCE", None)
if inst is None or getattr(inst, "_sys", None) is None:
    return None
positions = inst._sys._positions   # ← 三層下劃線私有 attribute,直接 reach in
```

**風險:**
- 如果 `visustwin.ventilation` 重命名 `_positions` → `_heads` 或 refactor `ParticleSystem` 結構,這裡靜默回傳 None(被 try/except 吃掉),report 永遠 fallback 到 stub,**使用者卻不會收到「升級不相容」的訊號**。
- 違反 ext 邊界約束(per `AUTHORING_STANDARD.md` 應該寫 explicit API)。

**建議 fix:** 在 `visustwin.ventilation` 加一個 module-level 公開函式:
```python
# ventilation/__init__.py 或 particles.py
def get_active_positions_cm():
    """Public API for live particle positions, or None if sim not running."""
    inst = _INSTANCE
    if inst is None or inst._sys is None or inst._sys._positions is None:
        return None
    return inst._sys._positions
```
然後 `engine.py` 只用 public:
```python
from visustwin.ventilation import get_active_positions_cm
positions = get_active_positions_cm()
```

---

## Medium(下個 sprint 修)

### M1. CJK font hook 在 2 ext 裡完全重複(DRY 違反)

**位置:**
- `visustwin.dashboard/extension.py:182-189`(11 行)
- `visustwin.ventilation/extension.py:97-104`(11 行,只 prefix 字串不同)

兩段一模一樣 try/except,只 log message 的 ext 名稱不同。

**建議:** 在 `visustwin.fonts/font_setup.py` 加 helper:
```python
def setup_cjk_for_ext(ext_name: str) -> bool:
    """One-call CJK font setup for consumer ext. Returns True if both
    matplotlib + omni.ui paths succeeded."""
    try:
        ok1 = configure_matplotlib_cjk()
        ok2 = register_omni_ui_font()
        return ok1 and ok2
    except Exception as e:
        carb.log_warn(f"[{ext_name}] CJK font setup failed: {e}")
        return False
```
Caller 縮成一行:
```python
from visustwin.fonts.font_setup import setup_cjk_for_ext
setup_cjk_for_ext("visustwin.dashboard")
```

### M2. USD path / 單位換算寫死

**位置:** `visustwin.ventilation.report/engine.py`

```python
# Hardcoded:
_CM_TO_M = 0.01   # 假設 stage metersPerUnit = 0.01,沒從 stage 讀
# 寫死 path convention 是 /World/Ventilation/Inlets/*(經 list_inlets() 抽象,但 list_inlets 自己也寫死)
```

**風險:**
- 若 stage 改用 m 為單位(`UsdGeom.GetStageMetersPerUnit(stage) == 1.0`),所有 inlet 座標被當 cm→m 轉成原本的 1/100,room 變超小。
- 若使用者在別的 USD path 加 inlet,`list_inlets()` 完全抓不到。

**建議 fix:**
```python
from pxr import UsdGeom
mpu = UsdGeom.GetStageMetersPerUnit(stage) or 0.01
# 然後用 mpu 取代 _CM_TO_M
```
USD path 改 traversal 找有 `visustwin:inlet:normal` attribute 的 prim(不限 path):
```python
for prim in stage.Traverse():
    if prim.HasAttribute("VisTwin:inlet:normal"):
        ...
```

### M3. `zip()` × 2 沒加 `strict=False/True`(B905)

**位置:**
- `visustwin.solar.report/engine.py:349`
- `visustwin.wind.analysis/engine.py:252`

`zip(a, b)` 預設長度不等時 silently 截斷較短那邊,可能掩蓋資料 mismatch bug。

**建議:** Python 3.10+ 用 `zip(a, b, strict=True)`(欲嚴格)或 `strict=False`(明確標示意圖)。

### M4. 25 處 `try-except-pass` 沒 log(S110 / B110)

**位置:** 散在 6 個 ext 的 extension.py + report_window.py + engine.py。

雖然 bandit 列 LOW,但運維上**沉默吃掉例外是 production debug 的最大障礙**。我自己加的也犯了(`engine.py:72, 130, 166, 210` 共 4 處)。

**建議:** 至少改成:
```python
try:
    ...
except Exception as e:
    carb.log_warn(f"[my.ext] non-fatal in <context>: {e}")
```
或用 `contextlib.suppress(...)` 配合單獨 `log_info` 表達「這是預期可吃的」。

### M5. F841 unused locals 共 7 處 — 可能是漏寫的程式碼路徑

**位置:**
- `solar.report/engine.py:223 (n_samples), 338 (unit), 346 (im)`
- `ventilation/particles.py:405 (P)`
- `wind.analysis/engine.py:248 (im), 486 (resolution_sq)`
- `wind.analysis/extension.py:331 (tz)`

**風險:** `im = ax.imshow(...)` 沒用代表沒呼 `colorbar(im)` 或 `clim`,圖可能少 colorbar。`tz` 沒用代表 timezone 計算結果丟掉。

**建議:** 逐個 review,要嘛加上消費,要嘛 `_ = ...` 標明有意為之。

### M6. `extension.toml` deps 沒 version pin

所有 `[dependencies]` 都是 `"omni.kit.uiapp" = {}` 或 `"visustwin.fonts" = {}` — 表示「任何版本都接受」。

**風險:** Kit 內部 ext 升級到 incompatible API 時,我們的 dep solver 可能選到壞版本,使用者第一次發現是 boot 時 dep error 或 runtime AttributeError。

**建議(low priority for now):** 在已知穩的點加 `version = ">=1.0,<2.0"` 風格的 caret pin。但 Kit ecosystem 文化上不太用,所以是 nice-to-have。

### M7. `summary_text.md` 模板硬編在 Python f-string 裡

**位置:** `ventilation.report/engine.py::write_summary_text` 這函式整段 f-string 跨 60+ 行。

**風險:**
- 非工程改文案要學 Python f-string escape(`{{}}` 這種)
- 看不到 markdown 渲染預覽(IDE 沒 syntax highlight 在 Python 內嵌 md)

**建議:** 抽到 `templates/summary_text.md.j2` + 用簡易 string.Template 或 jinja2(已 pip install)render。模組重啟可 reload。

### M8. 狀態字串 `scene=live · particles=live · timeseries=demo` 硬編

**位置:** `ventilation.report/extension.py::_data_source_summary` 形成處。

**風險:** 之後加 `coverage_grid=live` 等新欄位時要在 N 處改字串。

**建議(低)::**
```python
sources = {"scene": scene_src, "particles": parts_src, "timeseries": ts_src}
self._data_source_summary = " · ".join(f"{k}={v}" for k, v in sources.items())
```
是 nit 但 future-proof。

### M9. `_gen.py` 留在 mirror 裡(commit 進 GitHub 了)

**位置:** `visustwin-extensions/exts/visustwin.fonts/data/regions/_gen.py`

不影響運行,但 README / 說明有沒有指這個檔 → 沒有。**建議要嘛在 README 提一下「這個 script 用來重建 cjk-full.txt」,要嘛從 mirror 拿掉(只留 cjk-full.txt 結果)。**

---

## Low / Nit(`ruff --fix` 大部分能自動)

| 類別 | 數量 | 說明 |
|---|---|---|
| **E702**(multiple statements on one line semicolon)| 148 | 99% 是 design-system fallback 那種 `BG_WIN = 0xFFF8F8F8; BG_HEADER = ...` 緊湊定義。風格而非 bug。 |
| **F401**(unused imports)| 25 | 死碼。Theme 模組裡未用到的 token、UI 模組重構後留下的。`ruff --fix` 自動清。 |
| **RUF001 / RUF003**(ambiguous unicode `× – ‘ ’ （ ）`)| 36 + 14 | 中文 string 裡的全形 / 數學符號被 ruff 認為「可能誤打」。**幾乎全部是有意為之**,建議在 ruff 設 `[lint.allowed-confusables = ["×", "–", "‘", "’"]]` 跳過。 |
| **SIM105**(`try-except-pass` → `contextlib.suppress`)| 19 | 風格。 |
| **SIM117**(nested `with` → 單行 `with a, b:`)| 13 | 風格。 |
| **C408**(`dict()` → `{}`)| 7 | 風格。 |
| **B007**(loop var unused)| 3 | 改 `_`。 |
| **E701**(multiple statements with colon)| 16 | 同 E702。 |
| **RET505**(`else` after `return`)| 3 | 風格。 |
| **RUF046**(redundant `int()` cast)| 3 | 風格。 |
| **RUF022**(`__all__` not sorted)| 1 | `visustwin.fonts/__init__.py:16`。 |

**自動修建議:**
```
ruff check <ext-folders> --fix --unsafe-fixes \
    --ignore RUF001,RUF002,RUF003,E702,E701
```
跑完手動 review 一輪。

---

## 自動化工具報告附錄

### Ruff 完整分布(354 issues)

```
148  E702       多重述句一行(semicolon),設計系統 fallback block 為主
 36  RUF001     字串內含混淆 unicode(× – ‘ ’ etc.) — 大多是中文場景的有意用法
 32  字串解碼   附帶 RUF001 的 unicode 名稱,non-actionable
 25  S110       try-except-pass(同 bandit B110)
 25  F401       unused imports
 19  SIM105     建議改 contextlib.suppress
 16  E701       multiple statements after colon
 14  RUF003     comment ambiguous unicode
 13  SIM117     nested with statements
  8  RUF006     dangling asyncio.ensure_future ★ H2
  7  RUF002     docstring ambiguous unicode
  7  F841       unused local variables ★ M5
  7  C408       dict() literal redundant
  3  S606       os.startfile (低風險,Open Folder 按鈕)
  3  RUF100     unused noqa
  3  RUF046     redundant int() cast
  3  B007       unused loop var
  2  S311       random for stub data(false-positive)
  2  B905       zip() without strict ★ M3
  1  F823       carb scoping bug ★ H1
  1  E402       import not at top(matplotlib backend setup,intentional)
```

### Bandit 完整分布(30 LOW)

```
25  B110  try-except-pass
 3  B606  start_process_with_no_shell — `os.startfile()` for Open Folder 按鈕,Windows 上無 shell injection 風險
 2  B311  random module — 用在 stub seed,無 cryptographic context
```
**0 個 HIGH/MEDIUM。**

### Mypy(skip)

不跑。Kit 110 沒提供完整 type stubs(`pxr.Usd`、`omni.ui`、`carb` 都 `--ignore-missing-imports`),信號雜訊比過低。

---

## 建議排序

### 立刻(下個 push 前)
- [ ] **H1** font_setup.py 把 `import carb.settings` 移到 module top — 1 行改
- [ ] **H2** 8 處 `asyncio.ensure_future` 補 reference — 一輪改完
- [ ] **H3** 在 `visustwin.ventilation` 加 public `get_active_positions_cm()`,`engine.py` 改用它 — 跨 ext 改,需測試

### 下個 sprint 內
- [ ] **M1** 抽 `setup_cjk_for_ext()` helper,dashboard + ventilation 兩處共用
- [ ] **M2** USD `metersPerUnit` 動態取代 `_CM_TO_M`,inlet traversal 改 attribute-based
- [ ] **M3** zip 加 strict
- [ ] **M4** 至少 ventilation.report engine.py 那 4 處 `try-except-pass` 加 log_warn(其他 ext 視範圍)
- [ ] **M5** 7 個 unused locals 逐個 review
- [ ] **M7** `summary_text` 模板抽外
- [ ] **M9** mirror 的 `_gen.py` 處理(README 說明 or 移除)

### 有空再修(`ruff --fix` 自動)
- [ ] M6 / M8 字串硬編
- [ ] 全部 Low / Nit 一次過 `ruff check --fix`

### Skip(false positive 不要碰)
- B311 random for stub — 不是 crypto 用途
- B606 / S606 `os.startfile` — Windows 上是安全寫法
- RUF001-3 ambiguous unicode — 中文有意用全形

---

## 後記

最大教訓:**今天趕的 H1 跟 H2 都是「同一個函式裡多 import / 多 await」的 Python 隱藏陷阱**。下次寫 ext 加 helper 前先過 ruff 一輪能省這次審計時間。

`AUTHORING_STANDARD.md` 該補進去的兩條:
1. **「函式內不要再 `import` 已在模組頂部 import 過的東西」** — 防 F823
2. **「`asyncio.ensure_future` 必須存 reference」** — 防 RUF006

加一個 pre-commit hook 跑 `ruff check --select F823,RUF006,B905` 三條最毒的 rule 即可擋下今天這類 bug。
