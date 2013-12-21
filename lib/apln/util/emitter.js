/**
 * Emitter event publisher.
 */
util = require('util');
var EventEmitter = require('events').EventEmitter;

function Emitter() {
  EventEmitter.call(this, arguments);
  util.inherits(Emitter, EventEmitter);
  /**
   * Inherits EventEmitter.
   * @param {Object} Obj
   */
  function inherit(Obj) {
    util.inherits(Obj, EventEmitter);
  }

  return {
    inherit: inherit
  };
}
module.exports = new Emitter();
