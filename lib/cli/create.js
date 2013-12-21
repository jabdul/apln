/**
 * Module Dependencies
 * @type {*}
 */
var apln = require('../apln');

module.exports = function(options) {

  if (options.verbose) {
    apln.create.on('log', function(message) {
      console.log(message);
    });

    apln.create.on('warn', function(message) {
      console.warn(message);
    });

    apln.create.on('error', function(message) {
      console.error(message);
      process.exit(1);
    });
  }

  apln.create.init(options.moduleName);
};