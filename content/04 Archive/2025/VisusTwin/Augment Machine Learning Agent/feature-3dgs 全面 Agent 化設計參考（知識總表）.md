
---
---

## 1. 主要腳本與功能對照

|腳本名稱|功能說明|備註/用法|
|---|---|---|
|`train.py`|主訓練腳本|產生高斯點雲、特徵圖、模型檢查點|
|`render.py`|主渲染腳本|產生渲染圖像/特徵/新視角/多插值|
|`segmentation.py`|LSeg分割主腳本|生成語意mask、支援類別指定|
|`segment_prompt.py`|SAM交互分割腳本|點/框提示互動分割|
|`encode_images.py`|LSeg特徵抽取|提取 CLIP/LSeg 特徵|
|`export_image_embeddings.py`|SAM特徵抽取|提取 SAM 特徵|
|`segmentation_metric.py`|分割評估|語意分割準確率計算、teacher/student 模式|
|`videos.py`|生成渲染視頻|多張圖像自動合成視頻|
|`convert.py`|圖像前處理、資料準備|轉檔、調整圖像大小|

---

## 2. 典型 CLI 指令範例

### **訓練**

sh

複製編輯

`python train.py -s data/DATASET_NAME -m output/OUTPUT_NAME -f lseg --speedup --iterations 7000 python train.py -s data/DATASET_NAME -m output/OUTPUT_NAME -f sam --iterations 7000`

### **渲染**

sh

複製編輯

`python render.py -s data/DATASET_NAME -m output/OUTPUT_NAME --iteration 3000 python render.py -s data/DATASET_NAME -m output/OUTPUT_NAME -f lseg --iteration 3000 --novel_view python render.py -s data/DATASET_NAME -m output/OUTPUT_NAME -f lseg --iteration 3000 --novel_view --multi_interpolate`

### **分割**

**LSeg分割：**

sh

複製編輯

`python segmentation.py --data output/DATASET_NAME/ --iteration 6000 python segmentation.py --data output/DATASET_NAME/ --iteration 6000 --label_src car,building,tree`

**SAM分割：**

sh

複製編輯

`python segment_prompt.py --checkpoint checkpoints/sam_vit_h_4b8939.pth --model-type vit_h --data output/OUTPUT_NAME --iteration 7000 --point 500 800 python segment_prompt.py --checkpoint checkpoints/sam_vit_h_4b8939.pth --model-type vit_h --data output/OUTPUT_NAME --iteration 7000 --box 100 100 1500 1200`

### **評估/生成視頻**

sh

複製編輯

`python segmentation_metric.py --backbone clip_vitl16_384 --weights demo_e200.ckpt --widehead --no-scaleinv --student-feature-dir output/OUTPUT_NAME/test/ours_30000/saved_feature/ --teacher-feature-dir data/DATASET_NAME/rgb_feature_langseg/ --test-rgb-dir output/OUTPUT_NAME/test/ours_30000/renders/ --eval-mode test  python videos.py --data output/OUTPUT_NAME --fps 10 -f lseg --iteration 10000`

---

## 3. 資料夾與輸出結構範例

plaintext

複製編輯

`output/OUTPUT_NAME/ ├── point_cloud/               # 高斯點雲 │   └── iteration_7000/ ├── feature_map/               # 特徵圖 │   └── iteration_7000/ ├── test/                      # 測試集結果 │   └── ours_30000/ │       ├── renders/           # 渲染圖像 │       └── saved_feature/     # 特徵圖 ├── novel_views/               # 新視角結果 │   └── ours_7000/ │       ├── renders/ │       └── saved_feature/ └── chkpnt7000.pth             # 檢查點`

---

## 4. 特殊參數與進階選項

|參數|說明|
|---|---|
|`--speedup`|特徵降維加速。LSeg: 512→128維、SAM: 256→64維，加快訓練/推理，但略降精度。|
|`--debug`|輸出詳細日誌，rasterizer異常自動生成dump檔，可用 `--debug_from` 指定從某次迭代開始。|
|`--convert_SHs_python`|用 PyTorch (非CUDA) 實現球諧函數，適合 CUDA 兼容性問題時，較慢但穩定。|
|`--compute_cov3D_python`|用 PyTorch 實現 3D 協方差，功能與上相似。|

---

## 5. 標準工作流程

### A. **基礎訓練/分割流程**

1. **數據前處理**
    
    sh
    
    複製編輯
    
    `python convert.py -s <location> [--resize]`
    
2. **特徵提取**
    
    - **LSeg**
        
        sh
        
        複製編輯
        
        `python encode_images.py --backbone clip_vitl16_384 --weights demo_e200.ckpt --widehead --no-scaleinv --outdir data/DATASET_NAME/rgb_feature_langseg --test-rgb-dir data/DATASET_NAME/images`
        
    - **SAM**
        
        sh
        
        複製編輯
        
        `python export_image_embeddings.py --checkpoint checkpoints/sam_vit_h_4b8939.pth --model-type vit_h --input data/DATASET_NAME/images --output data/OUTPUT_NAME/sam_embeddings`
        
3. **訓練**
    
    sh
    
    複製編輯
    
    `python train.py -s data/DATASET_NAME -m output/OUTPUT_NAME -f lseg --speedup --iterations 7000`
    
4. **渲染**
    
    sh
    
    複製編輯
    
    `python render.py -s data/DATASET_NAME -m output/OUTPUT_NAME --iteration 3000`
    
5. **分割**
    
    - **LSeg**
        
        sh
        
        複製編輯
        
        `python segmentation.py --data output/DATASET_NAME/ --iteration 6000`
        
    - **SAM**
        
        sh
        
        複製編輯
        
        `python segment_prompt.py --checkpoint checkpoints/sam_vit_h_4b8939.pth --model-type vit_h --data output/OUTPUT_NAME --iteration 7000 --point 500 800`
        

### B. **進階/自動評估流程**

1. **含評估的訓練**
    
    sh
    
    複製編輯
    
    `python train.py -s data/DATASET_NAME -m output/OUTPUT_NAME -f lseg --speedup --iterations 7000 --eval`
    
2. **新視角渲染**
    
    sh
    
    複製編輯
    
    `python render.py -s data/DATASET_NAME -m output/OUTPUT_NAME -f lseg --iteration 3000 --novel_view --multi_interpolate`
    
3. **分割評估**
    
    sh
    
    複製編輯
    
    `python segmentation_metric.py --backbone clip_vitl16_384 --weights demo_e200.ckpt --widehead --no-scaleinv --student-feature-dir output/OUTPUT_NAME/test/ours_30000/saved_feature/ --teacher-feature-dir data/DATASET_NAME/rgb_feature_langseg/ --test-rgb-dir output/OUTPUT_NAME/test/ours_30000/renders/ --eval-mode test`
    
4. **生成視頻**
    
    sh
    
    複製編輯
    
    `python videos.py --data output/OUTPUT_NAME --fps 10 -f lseg --iteration 10000`
    

---

## 6. 常用依賴（requirements.txt 範本）

txt

複製編輯

`setuptools plyfile pytorch-lightning==2.4.0 opencv-python imageio ftfy regex tqdm git+https://github.com/openai/CLIP.git altair streamlit protobuf timm tensorboard tensorboardX matplotlib test-tube wandb torchmetrics scikit-image scikit-learn git+https://github.com/zhanghang1989/PyTorch-Encoding/ pycocotools onnxruntime  onnx`

---

## 7. 注意事項

- **環境建議：** Python 3.8、CUDA 11.8、PyTorch 2.4.0，依 requirements.txt 安裝所有依賴。
    
- **資料夾命名與路徑**要一致，方便自動化 pipeline 。
    
- **多模型/多流程**支援良好，適合 agent platform 自動串接、批量調參、分割與評分。
    
- **output 資料夾結構/命名規則**建議統一，避免日後路徑對應混亂。
    

---

## 8. 進階應用說明

- 可以只單步訓練、渲染、分割，也可全自動 pipeline 流程（訓練→渲染→分割→評估）。
    
- 所有 CLI 指令參數都可直接被 CrewAI Studio/agent 調用，易於批量自動化。
    
- 結果/模型可直接 export/import 搬移到新平台/新機器，前提是資料夾/依賴一致。\


[[Augment Machine Learning Agent (CrewAI)]]