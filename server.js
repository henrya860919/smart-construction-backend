const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// 引入路由
// const authRoutes = require('./routes/auth');
const siteRoutes = require('./routes/sites');
// const equipmentRoutes = require('./routes/equipment');
// const userRoutes = require('./routes/users');
// const uploadRoutes = require('./routes/upload');

// 引入中間件
// const errorHandler = require('./middleware/errorHandler');
// const logger = require('./utils/logger');

// ===== 基本中間件 =====
app.use(helmet()); // 安全性標頭
app.use(cors()); // 跨域請求
app.use(express.json({ limit: '10mb' })); // JSON解析
app.use(express.urlencoded({ extended: true })); // URL編碼解析

// 速率限制
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分鐘
  max: 100 // 最多100次請求
});
app.use('/api/', limiter);

// 靜態檔案服務
app.use('/uploads', express.static('uploads'));

// ===== 路由設定 =====
// app.use('/api/auth', authRoutes);
app.use('/api/sites', siteRoutes);
// app.use('/api/equipment', equipmentRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/upload', uploadRoutes);

// 健康檢查端點
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// 404處理
app.use('*', (req, res) => {
  res.status(404).json({ error: '找不到請求的資源' });
});

// 全域錯誤處理
// app.use(errorHandler);

// 啟動伺服器
app.listen(PORT, () => {
//   logger.info(`🚀 智慧工地API伺服器啟動於 port ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
  console.log(`📋 健康檢查: http://localhost:${PORT}/health`);
});

module.exports = app;