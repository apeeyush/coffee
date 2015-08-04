/**
 * This is a sample config file.
 * Fill the config variables for yourself and rename it to secrets.js to load your config options
 */
var express = require('express');
var app = express();

// Calculate the host url
if(app.get('env')==='development'){
  host_url = 'localhost:3000';
}else if(app.get('env')==='production'){
  host_url = '';
}

module.exports = {
  db: process.env.DATABASE_URL || 'postgres://peeyush:password@localhost:5432/coffee',
  host: host_url,
  transporter: {
    service: 'xx',				    // e.g. : 'Gmail'
    auth: {
        user: 'xxx@xx.xx',		// e.g. : 'my_id@gmail.com'
        pass: 'xxxxxxx'			  // e.g. : 'my_password'
    },
    from: 'Name <email>'      // e.g. : 'Peeyush Agarwal <coffeefeeder@gmail.com>'
  }
};
