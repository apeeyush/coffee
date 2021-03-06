var express = require('express');
var router = express.Router();
var pg = require('pg');
var nodemailer = require('nodemailer');
var secrets = require('../config/secrets');
var EmailTemplate = require('email-templates').EmailTemplate;
var path = require('path');

var connectionString = secrets.db;

// Set up mailer to send mails
var transporter = nodemailer.createTransport({
    service: secrets.transporter.service,
    auth: {
        user: secrets.transporter.auth.user,
        pass: secrets.transporter.auth.pass
    }
});


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'COmplete your Favourite FEEd' });
});

/* POST home page */
router.post('/', function(req, res, next) {
  // Grab data from http request and create a record in database
  var data = {email: req.body.email, feed: req.body.feed, hour_of_day: req.body.hour_of_day};
  data['uni_id'] = Math.random().toString(36).substr(2, 12);
  data['sent_count'] = 0
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
  pg.connect(connectionString, function(err, client, done) {
    if (err) {
      return console.error('error fetching client from pool', err);
    }
    client.query("INSERT INTO coffee(email, feed, uni_id, sunday, monday, tuesday, wednesday, thursday, friday, saturday, sent_count, hour_of_day) values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)", [data.email, data.feed, data.uni_id, day_list[0], day_list[1], day_list[2], day_list[3], day_list[4], day_list[5], day_list[6], data.sent_count, data.hour_of_day]);
  });

  // Send verification mail
  var templateDir = path.join(__dirname, '../templates', 'welcome-email')
  var welcome_email = new EmailTemplate(templateDir)
  var user = {confirmation_url:req.headers.host+'/verify/'+data.uni_id}
  welcome_email.render(user, function (err, results) {
    if (err) { return console.error(err)}
    var mailOptions = {
      from: secrets.transporter.from,
      to: data.email,
      subject: 'Feed Subscription Confirmation',
      html : results.html,
      text: results.text
    };
    transporter.sendMail(mailOptions, function(error, info){
      if(error) { console.log(error); }
      else { console.log('Message sent: ' + info.response); }
    });
  });

  // Show successful submission page
  res.render('message', { title: 'Form submitted successfully', message: 'A confirmation mail has been sent to your mail id. Once you confirm your subscription, you will start recieving your feeds. Happy Reading :) ' });
});

/* GET verify page */
router.get('/verify/:uni_id', function(req, res, next) {
  uni_id = req.params['uni_id'];
  pg.connect(connectionString, function(err, client, done) {
    if (err) {
      return console.error('error fetching client from pool', err);
    }
    client.query('SELECT * FROM coffee WHERE uni_id = $1',[uni_id], function(err, result) {
        if (err){ return console.error('error querying the database', err);}
        done();                       // return the client to the connection pool for other requests to reuse
        if(result.rows.length > 0){
          console.log(result.rows[0].verified)
          client.query('UPDATE coffee SET verified=TRUE WHERE uni_id = $1',[uni_id], function(err, result) {
            if (err){ return console.error('error updating verified column!', err);}
          });
          res.render('verify', { title: 'Verify', message: 'Verification Successful!' });
        }else{
          res.render('verify', { title: 'Verify', message: 'Invalid Request!' });
        }
      });
  });
});

/* GET unsubscribe page */
router.get('/unsubscribe/:uni_id', function(req, res, next) {
  uni_id = req.params['uni_id'];
  pg.connect(connectionString, function(err, client, done) {
    if (err) {
      return console.error('error fetching client from pool', err);
    }
    client.query('SELECT * FROM coffee WHERE uni_id = $1',[uni_id], function(err, result) {
        if (err){ return console.error('error querying the database', err);}
        done();                       // return the client to the connection pool for other requests to reuse
        if(result.rows.length > 0){
          client.query('UPDATE coffee SET unsubscribe=TRUE WHERE uni_id = $1',[uni_id], function(err, result) {
            if (err){ return console.error('error updating unsubscribe column!', err);}
          });
          res.render('unsubscribe', { title: 'Unsubscribe', message: 'You have been unsubscribed successfully!' });
        }else{
          res.render('unsubscribe', { title: 'Unsubscribe', message: 'Invalid Request!' });
        }
      });
  });
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
