var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'COmplete your Favourite FEEd' });
});

/* POST home page */
router.post('/', function(req, res, next) {
  console.log(req.body);
  res.render('index', { title: 'COmplete your Favourite FEEd' });
});

/* GET about page. */
router.get('/about', function(req, res, next) {
  res.render('about', { title: 'About' });
});

/* GET home page. */
router.get('/contact', function(req, res, next) {
  res.render('contact', { title: 'Contact' });
});

module.exports = router;
