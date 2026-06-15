## **在 feature-3dgs 專案上做「個別物件偵測」的落地規劃**

### 📝 **報告與計畫書（技術規劃、步驟、目標）**

---

### 1. 目標

- **實現在 feature-3dgs 上針對 3D 場景中「個別物件」的偵測與分割**，可用於：
    
    - 物件級渲染（只顯示特定物體）
        
    - 指定區域進行精細訓練/分析
        
    - 將分割結果導出供下游 AI 使用
        

---

### 2. 技術流程

#### (1) **訓練與重建階段**

- 正常執行 feature-3dgs 的訓練流程，取得高品質 3D Gaussian Splatting 點雲
    

#### (2) **語意分割流程整合**

- **SAM 路線**（推薦切入點最友善）
    
    - 將 3DGS 重建完的場景以「多視角 2D 影像」投影
        
    - 用 Meta SAM 模型對這些影像做分割，產生多物件 mask
        
    - 反投影（back-project）這些 mask 到點雲，為每個點分配語意 label（這裡有現成 open source 實現，或可調用 segment-anything3d 專案）
        
    - 在 Viewer 介面加上按鈕：「高亮 / 單獨渲染被 mask 物件」
        
- **LSeg/CLIP Seg 路線**（如果要做到「輸入語意詞」直接選物件）
    
    - 利用 LSeg (或 CLIP+SAM) pipeline，對每張 2D 圖像根據語意描述生成 mask
        
    - 其他步驟同上
        

#### (3) **互動式選取與自動化**

- 開發/擴充 viewer 的 UI：用滑鼠點擊（SAM 支援互動 prompt），或語言輸入（LSeg支援）
    
- 可自動將分割結果保存下來（生成 JSON mask, per-point label，甚至直接導出指定物件的 3DGS 子集）
    

---

### 3. **所需工具與依賴**

- **SAM (Segment Anything)**：Meta 原版 [segment-anything](https://github.com/facebookresearch/segment-anything) + PyTorch
    
- **segment-anything3d**（可選）：專為 3D 點雲分割設計的 SAM 延伸
    
- **CLIP/LSeg**：如需語意 prompt 指定物件，可考慮 [LSeg](https://github.com/isl-org/semantic-segmentation) 或 [CLIPSeg](https://github.com/timojl/clipseg)
    
- **feature-3dgs**：你已安裝好的主流程
    
- **可能需調整或補充部分 viewer 前端程式**（如 SIBR）
    

---

### 4. **預期挑戰＆可行性說明**

- **2D-3D mask 映射/投影：** SAM 本身只處理2D影像，要精準將mask對應到3D點，需有相機參數與點雲-影像對應（feature-3dgs 通常可取得）。
    
- **多視角合併與衝突處理：** 同一物件可能在不同視角有不同 mask，需做融合或一致性處理。
    
- **效能與準確度：** 若點雲密度極高，分割後渲染與互動速度需優化。
    

---

### 5. **分階段行動計畫**

#### **階段一：可行性驗證（PoC）**

1. 用 3DGS 渲染 pipeline 輸出 N 張多視角 RGB 影像
    
2. 對每張影像用 SAM 做 segmentation，產生物件 mask
    
3. 根據相機內參，將 mask 投影回 3DGS 點雲（可先只做單一視角測試）
    
4. 渲染被 mask 標記過的點雲，驗證分割結果
    

#### **階段二：功能完善與自動化**

5. 集成多視角分割結果，合併成高可信度3D label
    
6. 擴充 Viewer UI，支援高亮/單獨顯示某物件
    
7. 可導出分割點雲、json label、或局部再訓練
    

#### **階段三：語意分割升級（可選）**

8. 集成 LSeg/CLIP Seg，支援「語言輸入」自動選物件
    

---

### 6. **技術參考資源**

- [segment-anything (官方)](https://github.com/facebookresearch/segment-anything)
    
- [segment-anything-3d (3D extension)](https://github.com/Pointcept/segment-anything-3d)
    
- [CLIPSeg: Zero-Shot Segmentation using CLIP](https://github.com/timojl/clipseg)
    
- [LSeg: Language-driven Semantic Segmentation](https://github.com/isl-org/semantic-segmentation)
    
- [SIBR Remote Viewer](https://github.com/EPFL-VILAB/SIBR_viewers)
    

---

## 📄**簡明總結**

1. **SAM 路線最容易上手、即時看到分割效果**，建議從這條線驗證。
    
2. **要做到語意分割或語言驅動選取，可再導入 LSeg/CLIPSeg**。
    
3. **分割結果能直接幫助你在 3DGS 專案中「對個別物件進行偵測、渲染、訓練或導出」。**
    
4. **若需要自動化或批次處理，CrewAI/Agent Framework 也能後續擴充，把這套分割流程封裝成自動調用的 tool。**

[[Feature-3dgs 開發方向]]