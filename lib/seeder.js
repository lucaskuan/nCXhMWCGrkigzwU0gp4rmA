(function() {
	'use strict';

	var fivebeans = require('fivebeans');
	var uuid = require('node-uuid');
	var host = 'localhost';
	var port = 11300;
	var tube = 'testtube';

	var job = {
		type: 'currency',
		payload: {
			uuid: uuid.v1(),
			from: 'HKD',
			to: 'USD',
		},
	};

	/**
	 * Seed action completion handler
	 * 
	 * @param {boolean} success - when specify, means we successfully added a job to queue. Otherwise, means jobs already existed.
	 */
	function seedCompletion(success) {
		if (success) {
			console.log('Seeded tube, bye.');
		} else {
			console.log('Already have jobs in tube, start working on it.');
		}
		emitter.end();
	};

	/**
	 * Seed job action
	 *
	 * @param {Fivebeans} emitter - a connected Fivebeans instance
	 */
	function seedJob(emitter) {
		emitter.put(0, 0, 60, JSON.stringify(job), function(err, jobid) {
			console.log('Queued a currency scrapper job in "' + tube + '". Job id: ' + jobid);
			seedCompletion();
		});
	}
	
	var emitter = new fivebeans.client(host, port);
	emitter.on('connect', function() {
		console.log('Connected to beanstalkd server');
		emitter.use(tube, function(err, tname) {
			console.log('using ' + tname);
			emitter.peek_ready(function(err, jobid, payload) {
				if (err) {
					seedJob(emitter);
				} else {
					seedCompletion(false);
				}
			});
		});
	});

	emitter.connect();
})();
