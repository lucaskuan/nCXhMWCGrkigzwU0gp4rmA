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
   */
  CurrencyHandler.prototype.work = function(payload, cb) {
    // console.log('working');
    console.log(payload);
    // var keys = Object.keys(payload);
    
    cb('release', 10);
  }
  
  var handler = new CurrencyHandler();
  return handler;
};