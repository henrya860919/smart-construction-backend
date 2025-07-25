const express = require('express');
const router = express.Router();
const siteController = require('../controllers/siteController');
// const auth = require('../middleware/auth');
// const { validateSite } = require('../middleware/validation');

// 獲取所有工地
router.get('/', siteController.getAllSites);

// 獲取單一工地詳情
router.get('/:id', siteController.getSiteById);

// 新增工地
router.post('/', siteController.createSite);

// 更新工地
router.put('/:id', siteController.updateSite);

// 更新工地進度
router.patch('/:id/progress', siteController.updateProgress);

// 刪除工地
router.delete('/:id', siteController.deleteSite);

module.exports = router;