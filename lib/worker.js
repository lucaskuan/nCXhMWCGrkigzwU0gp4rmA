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
    console.log(numwatched);
    
    if (err) return(new Error(err));
    client.reserve(function(err, jobid, payload) {
      if (err) return(new Error(err));
      var newJob = new Job({jobid: jobid})
      newJob.save();
      // var job = Job.findOne({jobid: jobid}, function(err, job) {
      //   if (job) {
      //
      //   }
      // });
      // console.log(job);
      client.release(jobid, 0, 10, function(err) {});
    });
  })
}

module.exports = new Worker;

