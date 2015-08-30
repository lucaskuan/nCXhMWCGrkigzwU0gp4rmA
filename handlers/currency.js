'use strict';

var restClient = require('restler');
var Promise = require('bluebird');

var Job = require('../models/job');
var Currency = require('../models/currency');

module.exports = function() {
	/**
	* Currency job handler constructor
	*
	* @constructor
	*/
	function CurrencyHandler() {
		this.type = 'currency';
	}
  
	/**
	* Expose function to start working on job
	*
	* @param {object} payload - Job payload that has been reserved
	* @param {function} cb - Job process status callback to fivebeans
	*/
	CurrencyHandler.prototype.work = function(payload, cb) {
		console.log(payload);
		var updateOption = {};
		var delay = 10;
		var self = this;
		
		this.getCurrency(payload).then(function(data) {
			console.log('then from rest');
			console.log(data);
			console.log('job run success');
			updateOption = {$inc: {success: 1}};
			self.recordJobResult(payload['uuid'], updateOption, delay, cb);
		})
		.catch(function(e) {
			console.log('job failed');
			updateOption = {$inc: {failed: 1}};
			delay = 3;
			self.recordJobResult(payload['uuid'], updateOption, delay, cb);
		});
	};
	
	/**
	* Get currency base on payload by using restler to make API call
	*
	* @param {object} payload - Job payload to give currency retrieval instruction
	* @param {string} payload['from'] - Which currency convert from.
	* @param {string} payload['to'] -  Which currency convert into.
	*/
	CurrencyHandler.prototype.getCurrency = function(payload) {
		var currencyAPI = restClient.getAsync('http://apilayer.net/api/live?access_key=370495bef2ed3eac3ac8da88d9eff7ec&currencies=' + payload['from'] + ',' + payload['to']).spread(function(data, res) {
			// Default api use USD as source
			var source = 'USD';
			var fromCurt = source + payload['from'];
			var toCurt = source + payload['to'];
			var fromRate = data.quotes[fromCurt];
			var toRate = data.quotes[toCurt];
			var rate = toRate/fromRate;
			return rate;
		}).then(function(rate) {
			var currencyRecord = new Currency({ from: payload['from'], to: payload['to'], rate: rate.toFixed(2).toString() })
			return currencyRecord.save();
		});
		return currencyAPI;
	};
	
	/**
	* Record job status to database. Keep track of job status to determine its lifecycle
	*
	* @param {string} jobUid - UUID of the job
	* @param {object} update - Update options will take place
	* @param {number} delay - Time to delay the job
	* @param {function} cb - Job process status callback to fivebeans
	*/
	CurrencyHandler.prototype.recordJobResult = function(jobUid, update, delay, cb) {
		// Mark failed count and release the job with delay
		var jobStatus = Job.findOneAndUpdate({uuid: jobUid}, update, {new: true, upsert: true}).exec()
		.then(function(result) {
			console.log('db result\n');
			console.log(result);
			var job = result.toJSON();
			if (job.success >= 10) {
				console.log('success 10 times. delete the job');
				cb('success');
			} else if (job.failed >= 3) {
				console.log('failed 3 times. delete the job');
				cb('bury');
			} else {
				console.log('delay the job');
				cb('release', delay);
			}
			return job;
		});
		
		return jobStatus;
	}
	
	var handler = new CurrencyHandler();
	return handler;
};