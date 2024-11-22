var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.json({ 
    message: 'Hello ldh',
    // res: JSON.stringify(res),
    // req: JSON.stringify(req)
  });
  console.log(req)
});


module.exports = router;
