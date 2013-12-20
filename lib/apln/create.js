/**
 * Module dependencies.
 */
var emitter = require('./util/emitter');

/**
 * Create a module.
 *
 * @param {string} path to create module.
 * @param {Function} callback fired afterwards.
 */
module.exports = function(path, callback) {
  emitter.emit('log', 'creating the module');
  emitter.emit('warn', 'module name appears to be too long');
  emitter.emit('error', 'module cannot be created');
};