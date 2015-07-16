var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgres://peeyush:password@localhost:5432/coffee';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'COmplete your Favourite FEEd' });
});

/* POST home page */
router.post('/', function(req, res, next) {
  console.log(req.body);

  // Grab data from http request
  var data = {email: req.body.email, feed: req.body.feed};
  data['uni_id'] = Math.random().toString(36).substr(2, 12);
  var day_list = [0,0,0,0,0,0,0];
  for (var key in req.body){
    if (key == 'sunday')
      day_list[0] = 1;
    else if (key == 'monday')
      day_list[1] = 1;
    else if (key == 'tuesday')
      day_list[2] = 1;
    else if (key == 'wednesday')
      day_list[3] = 1;
    else if (key == 'thursday')
      day_list[4] = 1;
    else if (key == 'friday')
      day_list[5] = 1;
    else if (key == 'saturday')
      day_list[6] = 1;
  }
  console.log(day_list);
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, function(err, client, done) {
    if (err) {
      return console.error('error fetching client from pool', err);
    }
    client.query("INSERT INTO coffee(email, feed, uni_id, sunday, monday, tuesday, wednesday, thursday, friday, saturday) values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)", [data.email, data.feed, data.uni_id, day_list[0], day_list[1], day_list[2], day_list[3], day_list[4], day_list[5], day_list[6]]);
  // client.query('SELECT $1::int AS number', ['1'], function(err, result) {
  //   done();
  //   if (err) {
  //     return console.error('error running query', err);
  //   }
  //   console.log(result.rows[0].number);
  // });
  });
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
