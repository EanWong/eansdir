var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.user) { 
    res.render('index', { title: 'eansdirectory.space', TEST:"MESSAGE:",user:req.user.username});
  } else {
    res.redirect('/login');
  }
});

module.exports = router;
