/**
 * Module dependencies.
 */
var Emitter = require('./util/emitter');
var path = require('path');
var fs = require('fs');
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
  /**
   * Appland home directory.
   * @type {string}
   */
  this.PATH_APPLAND_HOME = '';
  /**
   * Appland destination directories.
   * @type {Object}
   */
  this.appland = {
    'src': './src',
    'srcTest': './src-test',
    'sass': './src/assets/sass',
    'build': './_build'
  };
  /**
   * Apln cli home directory.
   * @type {*}
   */
  this.PATH_APLN_HOME = path.resolve(__dirname, '../..');
  /**
   * Appland module's skeleton source files locations.
   * @type {Object}
   */
  this.scaffold = {
    'src': path.normalize(this.PATH_APLN_HOME + '/.skel/src/module-'),
    'srcTest': path.normalize(this.PATH_APLN_HOME + '/.skel/src-test/module-'),
    'sass': path.normalize(this.PATH_APLN_HOME + '/.skel/src/assets/sass/'),
    'build': path.normalize(this.PATH_APLN_HOME + '/.skel/_build/module-')
  };
}
// Inheriting Node's Event Emitter pseudo-class.
Emitter.inherit(Create);
/**
 * Initialise the process.
 * @param {string} moduleName of the module.
 * @returns {boolean}
 */
Create.prototype.init = function(moduleName) {
  if (this.validate('moduleName',moduleName)) {
    this.moduleName = moduleName;
    this.emit('log', 'preparing to create ' + moduleName + " module \n");
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
Create.prototype.setNameSpace = function(namespace) {
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
Create.prototype.setPathToAppland = function(rootPath) {
  this.emit('log', 'checking Appland project installation...');
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
Create.prototype.validate = function(prop, val) {
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
 * Copy module skeleton code.
 * @return {boolean}
 */
Create.prototype.makeModule = function() {
  if (! this.isPath(this.PATH_APPLAND_HOME)) {
    this.emit('error', 'Path to Appland root directory does not exist.');
    return false;
  }
  return true;
};
/**
 * Copy file and/or directory
 * @param {string} from
 * @param {string} to
 * @param {boolean} deepCopy
 */
Create.prototype.copy = function(from, to, deepCopy) {

};
/**
 * Checks if path exists in the filesystem.
 * @param {string} fullPath
 */
Create.prototype.isPath = function(fullPath) {
  return fs.existsSync(fullPath);
};

module.exports = Create;