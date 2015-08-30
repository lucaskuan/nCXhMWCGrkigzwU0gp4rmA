var mongoose = require('mongoose');

var currencySchema = new mongoose.Schema({
	created_at: {type: Date, default: new Date()},
}, {strict: false});

var Currency = mongoose.model('Currency', currencySchema);

module.exports = Currency;