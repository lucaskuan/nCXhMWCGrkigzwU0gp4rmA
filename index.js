'use strict';

var fs = require('fs');
var yaml = require('js-yaml');
var mongoose = require('mongoose');
var restlerP = require('./lib/restler_p.js');

var worker = require('./lib/worker.js');

// Setup db connection
var dbConfig = yaml.load(fs.readFileSync('./config/database.yml', 'utf8'));
mongoose.connect('mongodb://' + dbConfig.host + ':' + dbConfig.port + '/' + dbConfig.database, {
	user: dbConfig.user,
	pass: dbConfig.password
});
mongoose.connection.on('open', function(cb) {
	var consumerWorker = new worker();
	consumerWorker.start();
});

