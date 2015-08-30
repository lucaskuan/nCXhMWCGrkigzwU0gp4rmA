'use strict';

var client = require('fivebeans');
var path = require('path');
var Job = require('../models/job');

/**
 * Setup a beanstalkd worker
 * @constructor
 */
function Worker() {

}

Worker.prototype.start = function() {
	this.runner = new client.runner('defaultID', path.resolve(__dirname, '../config') + '/beanstalkd.yml');
	this.runner.go();
};

module.exports = Worker;
