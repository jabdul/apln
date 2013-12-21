var Emitter = require('./util/emitter');
var Apln = function() {};
Emitter.inherit(Apln);
/**
 *   Command-line commands.
 */
Apln.prototype.create = new (require('./create'))();
module.exports = new Apln();