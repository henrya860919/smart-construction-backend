const mysql = require('mysql2');
require('dotenv').config();

// 建立連線池
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'smart_construction',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000
});

// 使用Promise版本
const promisePool = pool.promise();

// 測試連線
const testConnection = async () => {
  try {
    const [rows] = await promisePool.execute('SELECT 1 as test');
    console.log('✅ 資料庫連線成功');
    return true;
  } catch (error) {
    console.error('❌ 資料庫連線失敗:', error.message);
    return false;
  }
};

module.exports = {
  pool: promisePool,
  testConnection
};