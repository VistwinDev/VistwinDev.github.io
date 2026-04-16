![[螢幕擷取畫面 2025-06-11 200545.png]]
## 🔍 **Point view（左側主視窗） 參數說明**

### 【Viewer Setting 主選單】

- **Run/Pause**  
    啟動或暫停訓練流程或渲染（一般與主程式的狀態同步）
    
- **Render Mode**  
    渲染模式切換，可以選擇不同的渲染結果視覺化：
    
    - **RGB**：標準彩色影像
        
    - **Depth**：深度圖（像素到相機距離）
        
    - **Edge**：邊緣偵測視圖
        
    - **Normal**：法線（Normals）視覺化
        
    - **Curvature**：曲率視圖（顯示表面彎曲程度）
        
    - **Feature Map**：CNN feature map 可視化
        
    - **Show Input Points**：顯示輸入點雲
        
- **Visualization & Processing Controls**
    
    - **Keep model alive (after training)**  
        訓練後是否保留模型於記憶體，方便即時互動（預設勾選建議）
        
    - **Scaling Modifier**  
        調整點雲縮放倍率（通常 1.0，不會亂動）
        
- **Live Performance Metrics**
    
    - 顯示目前場景的即時指標（如下方「* 102626.000」可能代表當前點數）
        

---

### 【Camera Point View 底部控制區】

- **FPS**  
    顯示主視窗的 frame rate
    
- **Mode / Load camera / Save camera (bin)**  
    攝影機模式選擇、載入／儲存攝影機設定（bin 格式）
    
- **Snap to closest / Snap to**  
    讓相機直接跳到最近的點或特定數值位置
    
- **Fov / Far**  
    攝影機視角（Field of View）／最大可視距離
    
- **Key cameras / Add key / Save key cameras...**  
    設定動畫相機路徑（可用於動畫錄影）
    
- **Play (No Interp) / Record / Stop / Speed**
    
    - **Play (No Interp)**：沿 key camera 路徑播放（無內插）
        
    - **Record**：沿當前路徑錄製相機動畫
        
    - **Stop**：停止播放或錄製
        
    - **Speed**：動畫播放速度
        
- **Load path / Save path**  
    載入／儲存相機動畫路徑
    
- **Save video (from playing) / Save frames (from playing)**  
    將播放動畫錄成影片／存成逐張圖片
    
- **Acceleration / Rot. speed**  
    相機移動的加速度／旋轉速度
    

---

## 🔍 **Top view（右上+右下）參數說明**

### 【Top view（右上）】

- 主視窗顯示目前點雲在俯視圖（xy平面）的分布
    
- 主要用來直觀觀察空間結構和相對佈局
    

---

### 【Top view settings（右下）】

- **Save copy (TM)**  
    （不確定 "TM" 指什麼，但 Save copy 通常是備份當前視圖設定）
    
- **Camera scale / Draw labels / Draw Input Images**
    
    - **Camera scale**：控制攝影機圖示大小
        
    - **Draw labels**：是否顯示標籤
        
    - **Draw Input Images**：在俯視圖顯示輸入影像的縮略圖
        
- **Trackball / Mode / Load camera / Save camera (bin)**
    
    - **Trackball**：開啟軌跡球相機操作
        
    - **Mode**：顯示或切換不同顯示模式
        
    - **Load/Save camera (bin)**：同上，儲存／載入攝影機
        
- **Snap to closest / Show trackball / Far**
    
    - **Snap to closest**：讓相機對齊最近物件
        
    - **Show trackball**：顯示相機操作輔助
        
    - **Far**：最遠可視距離
        
- **Key cameras / Add key / Save key cameras...**  
    與左側 point view 相同，設定相機動畫
    
- **Play (No Interp) / Record / Stop / Speed**  
    相同，控制動畫播放／錄影
    
- **Load path / Save path**  
    同上，儲存或載入動畫路徑
    
- **Save video (from playing) / Save frames (from playing)**  
    與 point view 一樣，錄影或存 frame
    
- **Acceleration / Rot. speed**  
    控制相機動畫的加速度／旋轉速率
    
- **Meshes list / Cameras**  
    下拉菜單，選擇要顯示的 mesh（3D模型）與相機（可切換多攝影機）
    

---

## 🔶 **不確定、待補充區塊**

- **Save copy (TM)**：「TM」若有特殊意義，可能要查 SIBR Viewer 的官方文件
    
- **某些進階菜單（例如 Trackball Mode 下的細項）**，如你有文件或官網連結可提供，我能幫你再查
    
- **Performance Metrics 數字** 若還有其他指標顯示，可以截圖補充

[[Feature-3dgs 開發方向]]