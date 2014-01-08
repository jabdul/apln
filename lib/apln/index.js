var Emitter = require('./util/emitter');
function Apln(){
}
Emitter.inherit(Apln);
/**
 *   Command-line commands.
 */
Apln.prototype.Create = new (require('./create'))();
Apln.prototype.Remove = new (require('./remove'))();
module.exports = new Apln();