/**
 * Module Dependencies
 * @type {*}
 */
var chalk = require('chalk'),
    error = chalk.bold.red;
var prompt = require('prompt');
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
      console.error(error('ERROR: ') + message);
      process.exit(1);
    });
  }

  if ( apln.create.init(options.moduleName) ) {
    prompt.start();
    prompt.get(['username', 'email'], function (err, result) {
      //
      // Log the results.
      //
      console.log('Command-line input received:');
      console.log('  username: ' + result.username);
      console.log('  email: ' + result.email);
    });
  }
};