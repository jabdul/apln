/**
 * Module dependencies.
 */
var Emitter = require('./util/emitter');
var path = require('path');
var fs = require('fs.extra');
/**
 * Module Creator
 * Applands the module skeleton.
 * @constructor
 */
function Appland() {
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
  /**
   * Appland home directory.
   * @type {string}
   */
  this.PATH_APPLAND_HOME = '';
  /**
   * Appland destination directories.
   * @type {Object}
   */
  this.appland = {};
}
// Inheriting Node's Event Emitter pseudo-class.
Emitter.inherit(Appland);
/**
 * Initialise the process.
 * @param {string} moduleName of the module.
 * @returns {boolean}
 */
Appland.prototype.init = function(moduleName) {
  if (this.validate('moduleName',moduleName)) {
    this.moduleName = moduleName;
    this.emit('log', 'Preparing "' + moduleName + "\" module \n");
    return true;
  } else {
    this.emit('error',
      "Module cannot be created. Module name is invalid.\n" +
      "Lower case, hyphen(-), and numbers are allowed.\n" +
      "The first character must be a lower case letter.\n"
    );
    return false;
  }
};
/**
 * Namespace to used in HTML/CSS/JS of module.
 * @param {string} namespace for module
 * @returns {boolean}
 */
Appland.prototype.setNameSpace = function(namespace) {
  if (this.validate('nameSpace', namespace)) {
    this.nameSpace = namespace;
    return true;
  }
  return false;
};
/**
 * Sets path to Appland home directory.
 * @param {string} rootPath to Appland
 * @returns {boolean}
 */
Appland.prototype.setPathToAppland = function(rootPath) {
  this.emit('log', 'Checking Appland project installation...');
  if (this.validate('PATH_APPLAND_HOME', rootPath)) {
    this.PATH_APPLAND_HOME = rootPath;
    this.emit('log', 'Appland is installed.');
    return true;
  }
  this.emit('warn', "Appland is not installed.\n" +
            "      Path provided does not appear to contain Appland project.");
  return false;
};
/**
 * Validate input.
 * @param {string} prop to test.
 * @param {string} val to be tested.
 * @returns {boolean}
 */
Appland.prototype.validate = function(prop, val) {
  var pattern = '';
  switch (prop) {
    case 'moduleName':
      // Lower case, hyphen(-), and numbers are allowed
      // the first character must be a lower case letter
      pattern = /^[a-z]{1}[a-z0-9-]*$/;
      if (pattern.test(val)) {
        return true;
      }
      break;
    case 'nameSpace':
      // To be used as prefix for id and class attributes in html/js/css.
      // Lower case alphanumeric characters [a-zA-Z0-9-]
      // Ideally it should begin with company name abbreviated to no more than
      // 4 characters [a-zA-Z0-9]
      pattern = /^[a-zA-Z0-9]{1}[a-zA-Z0-9-]*$/;
      if (pattern.test(val)) {
        return true;
      }
      break;
    case 'PATH_APPLAND_HOME':
      return this.isPath(path.resolve(val, './src/main.js'));
      break;
    default:
      break;
  }

  return false;
};
/**
 * Checks if module exists in Appland.
 * @return {boolean}
 */
Appland.prototype.isModuleExists = function() {
  return this.isPath( path.join(
    this.PATH_APPLAND_HOME,
    'src',
    'module-' + this.moduleName
  ));
};
/**
 * Returns module name.
 * @return {string}
 */
Appland.prototype.getModuleName = function() {
  return this.moduleName;
};
/**
 * Checks if file is a directory.
 * @param {string} resource
 * @return {boolean}
 */
Appland.prototype.isDir = function(resource) {
  var file = path.extname(resource);
  return !!((file.match(/^\..+$/) === null));
};
/**
 * Checks if path exists in the filesystem.
 * @param {string} fullPath
 * @return {boolean}
 */
Appland.prototype.isPath = function(fullPath) {
  return fs.existsSync(fullPath);
};

module.exports = Appland;