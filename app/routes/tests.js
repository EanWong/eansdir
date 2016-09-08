var express = require('express');
var router = express.Router();

/* GET testing page */
router.get('/', function(req, res, next) {
  res.render('tests', { title: 'eansdirectory.space | TEST SPACE' });
});

module.exports = router;
