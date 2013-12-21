/*util = require('util');
var Emitter = require('./util/emitter');
var Apln = function() {
};

util.inherits(Apln, Emitter);
*
 *   Command-line commands.

var create = require('./create');
Apln.prototype.create = new create();
module.exports = Apln;*/
module.exports = {
  create: require('./create')
}