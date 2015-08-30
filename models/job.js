/**
 * Job model, store processed job status
 * @author lucaskuan
 */

var mongoose = require('mongoose');

var jobSchema = new mongoose.Schema({}, {strict: false});

var Job = mongoose.model('Job', jobSchema);

module.exports = Job;