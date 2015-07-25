var pg = require('pg');
var secrets = require('../config/secrets');

var connectionString = secrets.db;

var client = new pg.Client(connectionString);
client.connect();
//var query = client.query('DROP TABLE IF EXISTS coffee');
var query = client.query('CREATE TABLE coffee(id SERIAL PRIMARY KEY, uni_id VARCHAR not null, email VARCHAR not null, feed VARCHAR not null, sent_count INT, hour_of_day INT, monday BOOLEAN DEFAULT FALSE, tuesday BOOLEAN DEFAULT FALSE, wednesday BOOLEAN DEFAULT FALSE, thursday BOOLEAN DEFAULT FALSE, friday BOOLEAN DEFAULT FALSE, saturday BOOLEAN DEFAULT FALSE, sunday BOOLEAN DEFAULT FALSE, verified BOOLEAN DEFAULT FALSE, unsubscribe BOOLEAN DEFAULT FALSE)');
query.on('end', function() { client.end(); });
