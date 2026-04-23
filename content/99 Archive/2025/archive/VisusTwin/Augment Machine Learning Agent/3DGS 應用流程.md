## 3️⃣ **特別針對 ML/3DGS Training 應用攻略**

### ⭐ 標準操作流

1. **設計好訓練/調參工具** → 新增到 Tools
    
2. **建好 Trainer/Eval/Tuner agent** → 新增到 Agents
    
3. **組成 ML crew** → 在 Crews 加入全部 agent
    
4. **任務設計：**
    
    - Trainer 執行 `train.py`，回傳結果到 Results
        
    - Eval 讀結果，判斷 loss/PSNR
        
    - Tuner 根據 log 決定新一輪參數
        
5. **Kickoff 啟動全流程，Results 實時監控效果**
    
6. **Import/export 將這套 workflow 複用到新專案**
    

---

## ✨ **總結一份「ML Agent Platform」專案使用手冊（小白也看得懂）**

---

### CrewAI Studio 使用手冊（3DGS/ML Training 版）

**1. 工具：**  
在 Tools 加入你要的訓練、渲染、分析工具，設定好參數。

**2. 代理人：**  
在 Agents 新增訓練、評估、調參等角色，指派他們會用哪些工具。

**3. 團隊：**  
去 Crews 把這些 agent 集合起來，組成你的 ML pipeline 小隊。

**4. 任務：**  
進入 Tasks，把每個步驟的細節寫好（比如先訓練、再評分、再調參）。

**5. 知識庫：**  
把參數範本、指令規範寫進 Knowledge，讓調參 agent 可以直接引用。

**6. 啟動：**  
用 Kickoff 一鍵跑全流程，系統會自動調度每個 agent 幫你完成。

**7. 結果：**  
看 Results 看 loss、分數、模型存檔等所有執行結果，隨時比對哪一輪最強。

**8. 匯入/匯出：**  
設定好 workflow，可以隨時備份、分享、換新機或跨團隊協作。

[[Augment Machine Learning Agent (CrewAI)]]