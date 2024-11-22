var express = require('express');
var router = express.Router();
const { Article } = require('../../models');
const { Op } = require('sequelize');
const { NotFoundError, success, failure } = require('../../utils/response')

// 公共方法：查询当前文章
async function getArticle(req) {
  const { id } = req.params;
  const article = await Article.findByPk(id);
  if (!article) {
    throw new NotFoundError(`ID: ${id}的文章未找到`);
  }
  return article;
}

// 查询
router.get('/', async function(req, res, next) {
  try {
    const articles = await getArticle(req)
    console.log(articles, "/////");
    
    success(res, '文章查询成功', {articles}, 200)
  } catch (error) {
    failure(res, error)
  }
  
});
// 分页查询
router.get('/page', async function(req, res, next) {
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
    const articles = await Article.findAndCountAll(condition)
    success(res, '查询成功', {articles}, 200)
  } catch (error) {
    failure(res, error)
  }
  
});

// 查看详情
router.get('/:id', async function(req, res, next) {
  try {
    const articles = await getArticle(req)
    success(res, '文章详情查询成功', {articles}, 200)
    
  } catch (error) {
    failure(res, error)
  }
});

// 新建
router.post('/create', async function(req, res, next) {
  try {
    const articles = await Article.create({
      title: req.body.title,
      content: req.body.content
    })
    success(res, '创建文档成功', {articles}, 201)
  } catch (error) {
    failure(res, error)
  }
});

// 删除
router.delete('/:id', async function(req, res, next) {
  try {
    const articles = await getArticle(req)
    await articles.destroy()
    success(res, '文章查询成功', {articles}, 200)
    
  } catch (error) {
    failure(res, error)
  }
})

// 编辑
router.put('/:id', async function(req, res, next) {
  try {
    const articles = await getArticle(req)
    await articles.update(req.body);
    success(res, '文章查询成功', {articles}, 200)
  } catch (error) {
    failure(res, error)
  }
});

module.exports = router;
