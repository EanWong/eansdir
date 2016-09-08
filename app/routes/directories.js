var express = require('express');
var router = express.Router();

router.get('/:name', function(req, res) {
  var name = req.params.name;
  res.render('index', { title: 'eansdirectory.space', name: name}); //Temporary until we start using cookies
});

module.exports = router;
