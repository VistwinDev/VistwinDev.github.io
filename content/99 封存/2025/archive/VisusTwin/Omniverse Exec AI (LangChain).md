[[Omniverse]]

[點我開啟 Streamlit App](https://visustwinlangchain-wa93nz8dofeyectgyy8acv.streamlit.app/)
![[螢幕擷取畫面 2025-06-09 144644.png]]
# 🧠 2025/6/19 開發進度總結｜Omniverse × LangChain 任務語意中介層

## ✅ 完成進度
1. **Streamlit 前端完成 `action_schema` 支援**：修改 `send_code_to_omniverse()`，改為發送結構化 `action_schema` 而非原始 Python 代碼。加入 `_parse_action_schema()`，支援多種任務格式（扁平、嵌套、多類型參數）。成功發送後，Omniverse Extension 正確接收並執行任務。
2. **FastAPI 後端任務排程穩定**：`GET /tasks/next` 正確回傳 JSON 任務物件，支援多任務輪詢。任務類型如 `create_primitive` 成功執行，產出 `/World/Cube` 物件。
3. **Omniverse Extension 偵錯與排查**：針對多次任務處理後 Extension 當機問題進行排查，確認可能與主線程阻塞、代碼解析失敗有關。已嘗試優化 threading，但仍需進一步排查穩定性。
4. **阻止 `custom_action` 崩潰任務**：確認若傳入完整 GPT 原始碼（type: `custom_action`），會導致 Extension 當掉，且無處理機制。系統日誌顯示 `[Warning] 暫不支援的任務類型: custom_action`，目前以 `action_schema` 為主要任務接口格式以避免風險。

## 🔍 發現與策略調整
- **LangChain 代碼直接執行風險過高**：允許 LangChain 直接產生可執行 Python 代碼風險高、延伸性差，容易導致 Omniverse 當機。✅ 解法：LangChain 只負責語意與參數推理，代碼轉換由中介層/前端負責。
- **Omniverse 內建 LangChain Plugin 觀察**：你發現 Extension 中已有內建 LangChain Plugin，但決定自建 LangServe 架構。原因：你希望架構不被綁定在 Omniverse SDK，並能連接 Revit、工地 AI、IoT 監控等平台。
- **技術定位調整**：你不是在做單純的語音控制，而是在建立「語意任務中介層」，目的是為了數位孿生的多平台可擴展整合能力，這比單純控制 Omniverse 更具價值。

## 🧭 待辦與建議（Backlog）
- 串接 Revit API（例如透過 RevitPythonShell 或 Dynamo）建立跨平台任務鏈
- 擴展 `action_schema` 支援更多動作，如 `move_prim`、`set_material`、`load_usd`
- 優化 Extension 線程與執行安全，避免主線程阻塞與 GUI 當機
- 增加 LangChain 工具選擇與推理能力，例如加入 plan-and-execute 機制

## 📘 Portfolio 定位語言
- 本專案為 VisionBase × 實踐大學數位孿生系統核心技術展示
- 展現「多源資料 × 語意中介 × 3D 任務執行」的整合能力
- 明確展現你的 AI 工程、架構設計與數位孿生控制力的理解
- 強調你設計的不是指令控制系統，而是能跨平台拓展的語意轉譯中介架構

## 💡 求職策略補充
- 功能完整性不是重點，「架構邏輯、語意推理力、拓展性設計」才是你作品的亮點
- 你之所以不使用內建 LangChain Plugin，是為了打造中立平台，為未來整合 Revit、IoT、施工分析等其他 Digital Twin 技術預留彈性