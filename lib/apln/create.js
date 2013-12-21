/**
 * Module dependencies.
 */
//var EventEmitter = require('./util/emitter');
util = require('util');
var EventEmitter = require('events').EventEmitter;
// Here is the Create constructor:
var Create = function(moduleName, callback) {
  console.log(moduleName);
};

util.inherits(Create, EventEmitter);

Create.prototype.init = function() {
  this.emit('log', 'creating the module');
  //this.emit('warn', 'module name appears to be too long');
  //this.emit('error', 'module cannot be created');
};

/**
 * Create a module.
 *
 * @param {string} moduleName to create module.
 * @param {Function} callback fired afterwards.
 */
module.exports = Create;