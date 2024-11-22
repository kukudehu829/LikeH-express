var express = require('express');
var router = express.Router();
const { Article } = require('../models');
const { Op } = require('sequelize');

// 查询
router.get('/', async function(req, res, next) {
  try {
    const {title, offset = 1, limit = 10}  = req.query
    const condition = {
      order: [
        // 将转义 title 并针对有效方向列表进行降序排列
        ['id', 'DESC'],
      ],
      offset: offset - 1,
      limit
    }
    if (title) {
      condition.where = {
        title: {
          [Op.like]: `%${title}%`
        }
      }
    }
    const articies = await Article.findAndCountAll(condition)
    res.json({
      status: true,
      message: '查询成功',
      data: {
        articies
      }
    })
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'catch兜住了',
      errors: [error.message]
    })
  }
  
});

// 查看详情
router.get('/:id', async function(req, res, next) {
  try {
    const { id } = req.params;
    const articies = await Article.findByPk(id)
    if (articies) {
      res.json({
        status: true,
        message: '查询成功',
        data: {
          articies
        }
      })
    } else {
      res.status(404).json({
        status: true,
        message: '查询不到',
      })
    }
    
  } catch (error) {
    res.status(500).json({
      status: false,
      message: '查询详情为空',
      errors: [error.message]
    })
  }
});

// 新建
router.post('/create', async function(req, res, next) {
  try {
    const articies = await Article.create({
      title: req.body.title,
      content: req.body.content
    })
    res.status(201).json({
      status: true,
      message: '查询成功',
      data: {
        articies
      }
      })
    
  } catch (error) {
    res.status(500).json({
      status: false,
      message: '创建失败',
      errors: [error.message]
    })
  }
});

// 删除
router.delete('/:id', async function(req, res, next) {
  try {
    const { id } = req.params;
    const articies = await Article.findByPk(id)
    if (articies) {
      await articies.destroy()
      res.json({
        status: true,
        message: '删除成功',
        data: {
          articies
        }
      })
    } else {
      res.status(404).json({
        status: true,
        message: '查询不到',
      })
    }
    
  } catch (error) {
    res.status(500).json({
      status: false,
      message: '删除失败',
      errors: [error.message]
    })
  }
})

// 编辑
router.put('/:id', async function(req, res, next) {
  try {
    const { id } = req.params;
    const articies = await Article.findByPk(id)
    if (articies) {
      articies.set(req.body);
      await articies.save();
      res.json({
        status: true,
        message: '更新成功',
        data: {
          articies
        }
      })
    } else {
      res.status(404).json({
        status: true,
        message: '查询不到',
      })
    }
    
  } catch (error) {
    res.status(500).json({
      status: false,
      message: '编辑失败',
      errors: [error.message]
    })
  }
});

module.exports = router;
