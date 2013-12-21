/**
 * Emitter event publisher.
 */
util = require('util');
var EventEmitter = require('events').EventEmitter;
var Emitter = function(){
  EventEmitter.call(this, arguments);
};
util.inherits(Emitter, EventEmitter);
module.exports = Emitter;
