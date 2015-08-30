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

Worker.prototype.recordJobStatus = function() {
	this.worker.on('job.handled', function(payload) {
		// Listen to job handling even to log status and destroy job
		console.log('handled job');
		var jobid = payload.id;
		var action = payload.action; // Action can be ['success' | 'release' | 'bury' | custom error]
		console.log('record job');
		console.log(payload);
		var updateData = {};
		if (payload.action == 'release') {
			updateData = {$inc: {success: 1}};
		} else if (payload.action == '') {
		
		}
		Job.findOneAndUpdate({jobid: jobid}, {$inc: {success: 1}}, {upsert: true}).exec().then(function(result) {
			console.log(result);
			var job = result.toJSON();
			console.log(job._id);
			console.log(job.jobid);
			console.log(job.success);
		});
	});

}

module.exports = Worker;
