/**
 * Module dependencies.
 */
var Emitter = require('./util/emitter');
/**
 * Module Creator
 * Creates the module skeleton.
 * @constructor
 */
function Create() {
  /**
   * Module's name
   * @type {string}
   */
  this.moduleName = '';
  /**
   * Module's namespace
   * @type {string}
   */
  this.nameSpace = '';
}
// Inheriting Node's Event Emitter pseudo-class.
Emitter.inherit(Create);
/**
 * Initialise the process.
 * @param {string} moduleName of the module.
 */
Create.prototype.init = function(moduleName) {
  if (this.validate('moduleName',moduleName)) {
    this.moduleName = moduleName;
    this.emit('log', 'preparing to create ' + moduleName + " module \n");
  } else {
    this.emit('error',
      "Module cannot be created. Module name is invalid.\n" +
      "Lower case, hyphen(-), and numbers are allowed.\n" +
      "The first character must be a lower case letter.\n"
    );
  }
};
/**
 * Validate input.
 * @param {string} prop to test.
 * @param {string} val to be tested.
 * @returns {boolean}
 */
Create.prototype.validate = function(prop, val) {
  var pattern = '';
  switch (prop) {
    case 'moduleName':
      // Lower case, hyphen(-), and numbers are allowed
      // the first character must be a lower case letter
      pattern = /^[a-z]{1}[a-z0-9-]*/;
      if (pattern.test(val)) {
        return true;
      }
      break;
    case 'nameSpace':
      break;
    default:
      break;
  }

  return false;
};

module.exports = Create;