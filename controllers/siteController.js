const { pool } = require('../config/database');
// const logger = require('../utils/logger');

class SiteController {
  
  // 獲取所有工地
  async getAllSites(req, res) {
    try {
      const [sites] = await pool.execute(`
        SELECT 
          id, name, location, manager, status, 
          progress, budget, start_date, end_date,
          created_at, updated_at
        FROM sites 
        ORDER BY created_at DESC
      `);
      
      res.json({
        success: true,
        data: sites,
        count: sites.length
      });
    } catch (error) {
      logger.error('獲取工地列表失敗:', error);
      res.status(500).json({ error: '伺服器錯誤' });
    }
  }

  // 獲取單一工地
  async getSiteById(req, res) {
    try {
      const { id } = req.params;
      
      const [sites] = await pool.execute(
        'SELECT * FROM sites WHERE id = ?',
        [id]
      );

      if (sites.length === 0) {
        return res.status(404).json({ error: '找不到該工地' });
      }

      // 獲取工地設備
      const [equipment] = await pool.execute(
        'SELECT * FROM equipment WHERE site_id = ?',
        [id]
      );

      // 獲取最新進度
      const [progress] = await pool.execute(`
        SELECT * FROM progress_updates 
        WHERE site_id = ? 
        ORDER BY created_at DESC 
        LIMIT 10
      `, [id]);

      res.json({
        success: true,
        data: {
          site: sites[0],
          equipment: equipment,
          recentProgress: progress
        }
      });
    } catch (error) {
      logger.error('獲取工地詳情失敗:', error);
      res.status(500).json({ error: '伺服器錯誤' });
    }
  }

  // 新增工地
  async createSite(req, res) {
    try {
      const { name, location, manager, budget, start_date, end_date } = req.body;

      const [result] = await pool.execute(`
        INSERT INTO sites (name, location, manager, budget, start_date, end_date, status)
        VALUES (?, ?, ?, ?, ?, ?, '準備中')
      `, [name, location, manager, budget, start_date, end_date]);

      logger.info(`新增工地: ${name}, ID: ${result.insertId}`);

      res.status(201).json({
        success: true,
        message: '工地新增成功',
        data: { id: result.insertId }
      });
    } catch (error) {
      logger.error('新增工地失敗:', error);
      res.status(500).json({ error: '新增工地失敗' });
    }
  }

  // 更新工地
  async updateSite(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;

      // 動態建立UPDATE語句
      const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
      const values = Object.values(updates);
      values.push(id);

      const [result] = await pool.execute(
        `UPDATE sites SET ${fields}, updated_at = NOW() WHERE id = ?`,
        values
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: '找不到該工地' });
      }

      res.json({
        success: true,
        message: '工地更新成功'
      });
    } catch (error) {
      logger.error('更新工地失敗:', error);
      res.status(500).json({ error: '更新工地失敗' });
    }
  }

  // 更新工地進度
  async updateProgress(req, res) {
    try {
      const { id } = req.params;
      const { progress, description, updated_by } = req.body;

      // 更新主表進度
      await pool.execute(
        'UPDATE sites SET progress = ?, updated_at = NOW() WHERE id = ?',
        [progress, id]
      );

      // 記錄進度歷史
      await pool.execute(`
        INSERT INTO progress_updates (site_id, progress, description, updated_by)
        VALUES (?, ?, ?, ?)
      `, [id, progress, description, updated_by]);

      res.json({
        success: true,
        message: '進度更新成功'
      });
    } catch (error) {
      logger.error('更新進度失敗:', error);
      res.status(500).json({ error: '更新進度失敗' });
    }
  }

  // 刪除工地
  async deleteSite(req, res) {
    try {
      const { id } = req.params;

      const [result] = await pool.execute(
        'DELETE FROM sites WHERE id = ?',
        [id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: '找不到該工地' });
      }

      res.json({
        success: true,
        message: '工地刪除成功'
      });
    } catch (error) {
      logger.error('刪除工地失敗:', error);
      res.status(500).json({ error: '刪除工地失敗' });
    }
  }
}

module.exports = new SiteController();