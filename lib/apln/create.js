/**
 * Module dependencies.
 */
var Emitter = require('./util/emitter');
function Create() {
  this.tag = 'creator';
}

Emitter.inherit(Create);

Create.prototype.init = function(moduleName) {
  this.emit('log', 'creating the module ' + this.tag + moduleName);
  //this.emit('warn', 'module name appears to be too long');
  //this.emit('error', 'module cannot be created');
};

module.exports = Create;