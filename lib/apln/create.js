/**
 * Module dependencies.
 */
//util = require('util');
var Emitter = require('./util/emitter');
var Create = function() {
  this.tag = 'creator';
};

//util.inherits(Create, Emitter);
Emitter.inherit(Create);

Create.prototype.init = function(moduleName) {
  this.emit('log', 'creating the module ' + this.tag + moduleName);
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