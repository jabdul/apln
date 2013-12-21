/**
 * Module dependency.
 * @see http://www.mikebroughton.net/2013/10/node-js-using-events-to-communicate.html
 */
var events = require('events');
var EventEmitter = new events.EventEmitter();
module.exports = EventEmitter;
