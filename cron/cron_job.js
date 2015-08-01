/**
 * Start cronjob to send feeds 
 */

var FeedParser = require('feedparser');
var request = require('request');
var CronJob = require('cron').CronJob;
var pg = require('pg');
var secrets = require('../config/secrets');
var connectionString = secrets.db;
var nodemailer = require('nodemailer');
var EmailTemplate = require('email-templates').EmailTemplate;
var path = require('path');

// Set up mailer to send mails
var transporter = nodemailer.createTransport({
    service: secrets.transporter.service,
    auth: {
        user: secrets.transporter.auth.user,
        pass: secrets.transporter.auth.pass
    }
});

// Increment sent_count in database for record with given id
var incrementSentCount = function(id){
  pg.connect(connectionString, function(err, client, done) {
    if (err) {
      return console.error('error fetching client from pool', err);
    }
    client.query("UPDATE coffee SET sent_count = sent_count + 1 WHERE id=$1", [id], function(err, result){
      if (err) {
        return console.error('error fetching client from pool', err);
      }
    });
  });
};

// Send feed email for all rows
var sendFeeds = function(rows){
  for (var i = 0; i < rows.length; i++) {
    var row = rows[i];
    // console.log(row);
    var req = request(row['feed'])
     , feedparser = new FeedParser();

    req.on('error', function (error) {
      console.log('Invalid URL');
    });
    req.on('response', function (res) {
      var stream = this;
      if (res.statusCode != 200) return this.emit('error', new Error('Bad status code'));
      stream.pipe(feedparser);
    });
    feedparser.on('error', function(error) {
      console.log('Error parsing stream!');
    });
    var feedlist = []
    feedparser.on('readable', function() {
      var stream = this
        , meta = this.meta
        , item;
      while (item = stream.read()) {
        feedlist.push(item);
      }
    });
    feedparser.on('end', function(){
      item_num = feedlist.length-row['sent_count'];
      if (item_num>0){
        var feed = feedlist[item_num-1];
        // Send feed mail
        var templateDir = path.join(__dirname, '../templates', 'feed-email');
        var feed_email = new EmailTemplate(templateDir);
        console.log(feed);
        var feed_details = {
          title: feed['title'],
          link:feed['link'],
          description:feed['description'],
          meta_title:feed['meta']['title'],
          meta_description:feed['meta']['description'],
          unsubscribe_link:secrets.host+'/unsubscribe/'+row['uni_id']
        };
        console.log(feed_details);
        feed_email.render(feed_details, function (err, results) {
          if (err) { return console.error(err)}
          var mailOptions = {
            from: 'Peeyush Agarwal <coffeefeeder@gmail.com>',
            to: row['email'],
            subject: 'Your feed from '+ feed_details['meta_title'],
            html : results.html,
            text: results.text
          };
          transporter.sendMail(mailOptions, function(error, info){
            if(error){ console.log(error); }
            else{
                console.log('Message sent: ' + info.response);
                incrementSentCount(row['id']);
            }
          });
        });
      }
    });
    feedparser.on('error', function(){
      console.log('Error!');
    });
  }
};

/* Start a cronjob that runs every hour */
new CronJob('00 * * * * *', function() {
  var d = new Date();
  var hour_of_day = d.getUTCHours();       /* 0-23 */
  var day_of_week = d.getUTCDay();  /* Sunday=0, Monday=1, .. */
  console.log('Cron Job Started!');

  pg.connect(connectionString, function(err, client, done) {
    if (err) {
      return console.error('error fetching client from pool', err);
    }
    if (day_of_week == 0) /* Sunday */
      var query = client.query("SELECT id, uni_id, email, feed, sent_count FROM coffee WHERE hour_of_day=$1 AND sunday=TRUE AND verified=TRUE AND unsubscribe=FALSE",[hour_of_day]);
    else if (day_of_week == 1)
      var query = client.query("SELECT id, uni_id, email, feed, sent_count FROM coffee WHERE hour_of_day=$1 AND monday=TRUE AND verified=TRUE AND unsubscribe=FALSE",[hour_of_day]);
    else if (day_of_week == 2)
      var query = client.query("SELECT id, uni_id, email, feed, sent_count FROM coffee WHERE hour_of_day=$1 AND tuesday=TRUE AND verified=TRUE AND unsubscribe=FALSE",[hour_of_day]);
    else if (day_of_week == 3)
      var query = client.query("SELECT id, uni_id, email, feed, sent_count FROM coffee WHERE hour_of_day=$1 AND wednesday=TRUE AND verified=TRUE AND unsubscribe=FALSE",[hour_of_day]);
    else if (day_of_week == 4)
      var query = client.query("SELECT id, uni_id, email, feed, sent_count FROM coffee WHERE hour_of_day=$1 AND thursday=TRUE AND verified=TRUE AND unsubscribe=FALSE",[hour_of_day]);
    else if (day_of_week == 5)
      var query = client.query("SELECT id, uni_id, email, feed, sent_count FROM coffee WHERE hour_of_day=$1 AND friday=TRUE AND verified=TRUE AND unsubscribe=FALSE",[hour_of_day]);
    else if (day_of_week == 6)
      var query = client.query("SELECT id, uni_id, email, feed, sent_count FROM coffee WHERE hour_of_day=$1 AND saturday=TRUE AND verified=TRUE AND unsubscribe=FALSE",[hour_of_day]);
    var rows = [];
    query.on('row', function(row, res) {
      rows.push(row);
    });
    query.on('end', function() {
      client.end();
      sendFeeds(rows);
    });
  });
}, null, true, 'GMT');
