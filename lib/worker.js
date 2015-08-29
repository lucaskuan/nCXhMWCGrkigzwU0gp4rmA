// 'use strict';
//
// /**
//  * Setup a beanstalkd worker
//  * @constructor
//  */
// function Worker() {
//   var client = require('fivebeans');
//   var path = require('path');
//   var runner = new client.runner('defaultID', path.resolve(__dirname, '../config') + '/beanstalkd.yml');
//
//   runner.go();
// }
//
// module.exports = Worker;

'use strict';

var mongoose = require('mongoose');
var Job = mongoose.model('Job');

/**
* Setup a beanstalkd worker
* @constructor
*/
function Worker() {
}

Worker.prototype.startWithClient = function(client, tube) {
	client.watch(tube, function(err, numwatched) {
		console.log('watching %s tube(s)', numwatched);

		if (err) return(new Error(err));

		client.reserve(function(err, jobid, payload) {
			console.log('reserver a job ' + jobid);
			if (err) return(new Error(err));

			Job.findOne({jobid: jobid}, function(err, job) {
				if (err) console.log(err);
				
				console.log(job);
				console.log(job.jobid);
				console.log(job.success);
				if (job && (job.success > 10 || job.failed > 3)) {
					console.log('reached limit, destroy job');
					client.destroy(jobid);
				} else {
					console.log('record success');
					console.log('current success count: ' + job.success);
					console.log('current fail count: ' + job.failed);
					if (job.success == undefined) {
						console.log('set new success');
						Job.update({jobid: jobid}, {success: 1}, function(err) {
							console.log(err);
						});
					} else {
						console.log('inc success count');
						Job.update({jobid: jobid}, {$inc: {success: 1}}, function(err) {
							console.log(err);
						});
					}
					job.save();
      
					client.release(jobid, 0, 10, function(err) { console.log(err) });
					// Job.update({jobid: jobid}, {$inc: {success: 1}});
				}
    
			});
		});
	})
}

module.exports = new Worker;

