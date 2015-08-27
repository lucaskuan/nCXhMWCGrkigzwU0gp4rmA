var mongoose = require('mongoose');

var currencySchema = new mongoose.Schema({}, {strict: false});

var Currency = module.exports = mongoose.model('Currency', currencySchema);