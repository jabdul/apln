var Emitter = require('./util/emitter');
function Apln() {};
Emitter.inherit(Apln);
/**
 *   Command-line commands.
 */
Apln.prototype.create = new (require('./create'))();
module.exports = new Apln();