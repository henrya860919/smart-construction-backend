const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');

class AuthMiddleware {
  
  verifyToken(req, res, next) {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: '無訪問權限，需要Token' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ error: 'Token無效' });
    }
  }

  requireRole(roles) {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({ error: '需要登入' });
      }

      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ error: '權限不足' });
      }

      next();
    };
  }

  async checkSitePermission(req, res, next) {
    try {
      const siteId = req.params.id;
      const userId = req.user.id;

      // 檢查使用者是否有該工地權限
      const [permissions] = await pool.execute(`
        SELECT * FROM site_permissions 
        WHERE user_id = ? AND site_id = ?
      `, [userId, siteId]);

      if (permissions.length === 0 && req.user.role !== 'admin') {
        return res.status(403).json({ error: '無該工地訪問權限' });
      }

      next();
    } catch (error) {
      res.status(500).json({ error: '權限檢查失敗' });
    }
  }
}

module.exports = new AuthMiddleware();