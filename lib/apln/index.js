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
Apln.prototype.Build = new (require('./build'))();
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
/**
 * Listen on  messages from commands.
 * @param {string} command to listen to for messages.
 */
Apln.prototype.onMessage = function (command) {
  var self = this;
  // LOG
  this[command].on('log', function(message) {
    self.log(message);
  });
  // WARN
  this[command].on('warn', function(message) {
    self.warn(message);
  });
  // ERROR
  this[command].on('error', function(message) {
    self.terminate(message);
  });
  // Completed
  this[command].on('completed', function(message) {
    var msg = message || '';
    if (msg == '') {
      msg = 'Success! Requests completed.';
    }
    self.log(msg);
  });
};

module.exports = new Apln();