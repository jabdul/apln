/**
 * Module dependencies.
 */
var Emitter = require('./util/emitter');
var HOMEPATH = require('./util/path').homePath();
var path = require('path');
var fs = require('fs.extra');
var _ = require('lodash');
var open = require("open");
/**
 * Module Creator
 * Creates the module skeleton.
 * @constructor
 */
function Remove() {
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
   * The browser in which to launch the application
   * once the module is created.
   * @type {string}
   */
  this.browser = 'chrome';
  /**
   * Appland home directory.
   * @type {string}
   */
  this.PATH_APPLAND_HOME = '';
  /**
   * Temporary directory for managing the creation of
   * files.
   * @type {string}
   */
  this.tmpDir = './.apln/tmp';
  /**
   * Appland destination directories.
   * @type {Object}
   */
  this.appland = {};
  /**
   * Apln cli home directory.
   * @type {*}
   */
  this.PATH_APLN_HOME = path.resolve(__dirname, '../..');
}
// Inheriting Node's Event Emitter pseudo-class.
Emitter.inherit(Remove);
/**
 * Initialise the process.
 * @param {string} moduleName of the module.
 * @returns {boolean}
 */
Remove.prototype.init = function(moduleName) {
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
 * Sets path to Appland home directory.
 * @param {string} rootPath to Appland
 * @returns {boolean}
 */
Remove.prototype.setPathToAppland = function(rootPath) {
  this.emit('log', 'Checking Appland project installation...');
  if (this.validate('PATH_APPLAND_HOME', rootPath)) {
    this.PATH_APPLAND_HOME = rootPath;
    this.emit('log', 'Appland is installed.');
    return true;
  }
  this.emit('error', "Appland is not installed.\n" +
            "      Path provided does not appear to contain Appland project.");
  return false;
};
/**
 * Validate input.
 * @param {string} prop to test.
 * @param {string} val to be tested.
 * @returns {boolean}
 */
Remove.prototype.validate = function(prop, val) {
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
 * Destroy module.
 * @return {boolean}
 */
Remove.prototype.destroyModule = function() {
  if (! this.isPath(this.PATH_APPLAND_HOME)) {
    this.emit('error', 'Path to Appland root directory does not exist.');
    return false;
  }

  this.prepareResources();

  var resources = _.keys(this.appland),
      len = resources.length,
      i = 0,
      resource;

  for (; i < len; i++) {
    resource = path.resolve(this.PATH_APPLAND_HOME, this.appland[resources[i]]);
    // Check resource exists...
    if (! this.isPath(resource) ) {
      this.emit('warn', 'Resource does not exist: ' + resource);
      continue;
    }

    this.destroyResource(resource);
  }

  return true;
};
/**
 * Delete a resource.
 * @param {string} resource to destroy
 */
Remove.prototype.destroyResource = function(resource) {
  var that = this;

  fs.rmrf(resource, function (err) {
    if (err) {
      that.emit('warn', 'Resource could not be removed: ' + resource);
      return;
    }
    that.emit('log', 'Removed: ' + resource);
  });
};
/**
 * Prepares resources for removal.
 */
Remove.prototype.prepareResources = function() {
  this.appland = {
    'src': './src/module-' + this.moduleName,
    'srcTest': './src-test/module-' + this.moduleName,
    'sassController': './src/assets/sass/module-' + this.moduleName + '.scss',
    'sassModule': './src/assets/sass/module-' + this.moduleName,
    'compiledCss': './src/assets/css/module-' + this.moduleName + '.css',
    'build': './_build/module-' + this.moduleName
  };
  /*this.appland.sassController =
    './src/assets/sass/module-' + this.moduleName + '.scss';
  this.appland.sassModule =  this.appland.sassModule + this.moduleName;
  this.appland.src        =  this.appland.src + this.moduleName;
  this.appland.srcTest    =  this.appland.srcTest + this.moduleName;
  this.appland.build      =  this.appland.build + this.moduleName;*/
};
/**
 * Checks if module exists in Appland.
 * @return {boolean}
 */
Remove.prototype.isModuleExists = function() {
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
Remove.prototype.getModuleName = function() {
  return this.moduleName;
};
/**
 * Checks if file is a directory.
 * @param {string} resource
 * @return {boolean}
 */
Remove.prototype.isDir = function(resource) {
  var file = path.extname(resource);
  return !!((file.match(/^\..+$/) === null));
};
/**
 * Checks if path exists in the filesystem.
 * @param {string} fullPath
 * @return {boolean}
 */
Remove.prototype.isPath = function(fullPath) {
  return fs.existsSync(fullPath);
};

module.exports = Remove;