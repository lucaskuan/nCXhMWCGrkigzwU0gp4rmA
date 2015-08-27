'use strict';

var fivebeans = require('fivebeans');
var fs = require('fs');
var yaml = require('js-yaml');

var mongoose = require('mongoose');
var Job = require('./models/job');
var Currency = require('./models/currency');

var worker = require('./lib/worker.js');
var seeder = require('./lib/seeder.js');

var beansconfig = yaml.load(fs.readFileSync('./config/beanstalkd.yml', 'utf8'));
var beansClient = new fivebeans.client(beansconfig.host, beansconfig.port);

// Setup db connection
var dbConfig = yaml.load(fs.readFileSync('./config/database.yml', 'utf8'));
mongoose.connect('mongodb://' + dbConfig.host + ':' + dbConfig.port + '/' + dbConfig.database, {
	user: dbConfig.user,
	pass: dbConfig.password
});

beansClient.on('connect', function() {
	// All good, start worker and seeder
	// seeder.seedTo(beansClient);
	
	// Start worker
	worker.startWithClient(beansClient, 'testtube');
})
.on('error', function(err) {
	console.log('Connection fail with error');
	console.log(err);
	process.exit(1);
})
.on('close', function() {
	console.log('Server disconnected.');
	process.exit(1);
});

beansClient.connect();
