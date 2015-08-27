var mongoose = require('mongoose');

var jobSchema = new mongoose.Schema({}, {strict: false});

var Job = module.exports = mongoose.model('Job', jobSchema);