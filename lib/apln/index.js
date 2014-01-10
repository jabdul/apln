/**
 * Module Dependencies
 */
var Emitter = require('./util/emitter');
var chalk = require('chalk'),
    log = chalk.bold.green,
    warn = chalk.bold.magenta,
    error = chalk.bold.red;

/**
 * Apln command line.
 * @constructor
 */
function Apln(){
}
Emitter.inherit(Apln);
/**
 * Command-line commands.
 */
Apln.prototype.Create = new (require('./create'))();
Apln.prototype.Remove = new (require('./remove'))();
/**
 * Terminate process on error event.
 * @param {?string=} message to buffer.
 */
Apln.prototype.terminate = function (message) {
  var msg = message || 'Unknown error, terminating process.';
  console.log(error('ERROR: ') + msg);
  process.exit(1);
};
/**
 * Warning message.
 * @param {?string=} message to buffer.
 */
Apln.prototype.warn = function (message) {
  console.warn(warn('WARN:  ') + message);
};
/**
 * Log message.
 * @param {?string=} message to buffer.
 */
Apln.prototype.log = function (message) {
  console.log(log('LOG:   ') + message);
};

module.exports = new Apln();