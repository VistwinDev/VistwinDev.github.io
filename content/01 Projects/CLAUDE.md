## 檔案輸出規則

**PPTX（工作檔）** → 暫存到 `C:\Users\visus\Documents\_pptx_workspace\`
- 這是可反覆修改的來源檔，不進 Obsidian
- 命名格式：`ProjectName_vN.pptx`

**PDF（最終輸出）** → 存到 Obsidian 對應專案資料夾 `01 Projects\<專案名稱>\`
- PDF 是「這版確認了」的里程碑，進 Obsidian 成為知識庫記錄
- 命名格式：`ProjectName_vN.pdf`

其他產出（.docx、草稿、報告）同樣存到 `01 Projects\<專案名稱>\`

## pptx / PDF 生成 QA 流程

生成 .pptx 後：
1. 存到 `_pptx_workspace\` 
2. 轉成 PDF：`cp` 到 `/tmp/`，在 Linux sandbox 用 `soffice --headless --convert-to pdf`
3. `pdftoppm` 轉圖片做視覺 QA
4. QA 通過後，PDF 存到 `01 Projects\<專案名稱>\`
5. **不要在 Windows 路徑執行任何會開視窗的程式**
