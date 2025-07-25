# 智慧工地戰情室系統 - 後端API

## 🏗️ 專案介紹

智慧工地戰情室系統的後端API，提供工地管理、設備監控、進度追蹤等功能。

## ⚡ 快速開始

### 1. 複製專案
\`\`\`bash
git clone <repository-url>
cd smart-construction-backend
\`\`\`

### 2. 安裝依賴
\`\`\`bash
npm install
\`\`\`

### 3. 設定環境變數
\`\`\`bash
cp .env.example .env
# 編輯 .env 檔案設定資料庫等資訊
\`\`\`

### 4. 初始化資料庫
\`\`\`bash
mysql -u root -p < database/init.sql
\`\`\`

### 5. 啟動服務
\`\`\`bash
# 開發環境
npm run dev

# 生產環境
npm start
\`\`\`

## 📋 API文檔

### 認證相關
- `POST /api/auth/login` - 使用者登入
- `POST /api/auth/register` - 使用者註冊
- `POST /api/auth/refresh` - 刷新Token

### 工地管理
- `GET /api/sites` - 獲取工地列表
- `GET /api/sites/:id` - 獲取工地詳情
- `POST /api/sites` - 新增工地
- `PUT /api/sites/:id` - 更新工地
- `PATCH /api/sites/:id/progress` - 更新進度
- `DELETE /api/sites/:id` - 刪除工地

### 設備管理
- `GET /api/equipment` - 獲取設備列表
- `GET /api/sites/:id/equipment` - 獲取工地設備
- `POST /api/equipment` - 新增設備
- `PUT /api/equipment/:id` - 更新設備

### 檔案上傳
- `POST /api/upload/photo` - 上傳照片
- `POST /api/upload/document` - 上傳文件

## 🔧 技術棧

- **框架**: Express.js
- **資料庫**: MySQL 8.0
- **認證**: JWT
- **檔案處理**: Multer
- **日誌**: Winston
- **測試**: Jest
- **容器化**: Docker

## 📁 專案結構說明

- `config/` - 配置檔案
- `controllers/` - 控制器（處理請求邏輯）
- `middleware/` - 中間件（認證、驗證等）
- `models/` - 資料模型
- `routes/` - 路由定義
- `services/` - 業務邏輯服務
- `utils/` - 工具函數

## 🚀 部署

### Docker部署
\`\`\`bash
docker-compose up -d
\`\`\`

### NAS部署
1. 將專案複製到NAS
2. 安裝Node.js和MySQL
3. 執行 `npm install --production`
4. 設定systemd service
5. 啟動服務

## 🧪 測試

\`\`\`bash
# 執行所有測試
npm test

# 執行特定測試
npm test -- auth.test.js
\`\`\`

## 📝 開發注意事項

1. 所有API都需要JWT認證（除了登入註冊）
2. 檔案上傳限制10MB
3. 資料庫使用連線池，注意連線管理
4. 所有敏感資訊都要放在.env中
5. 記得寫測試和注釋

## 🔒 安全性

- 使用Helmet設定安全標頭
- 速率限制防止API濫用
- JWT Token過期機制
- 輸入資料驗證
- SQL注入防護

## 📞 聯絡資訊

開發者：陳思翰  
Email: [your-email@example.com]  
GitHub: [your-github]
\`\`\`

---

## 🎯 下一步行動

1. **建立專案資料夾**：
   ```bash
   mkdir smart-construction-backend
   cd smart-construction-backend