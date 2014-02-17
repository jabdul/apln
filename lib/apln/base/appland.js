/**
 * Module dependencies.
 */
var Emitter = require('../util/emitter'),
    path = require('path'),
    fs = require('fs.extra'),
    _ = require('lodash'),
    open = require("open");
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
   * Module's name UpperCamelCase version
   * @type {string}
   */
  this.moduleNameCamel = '';
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
  /**
   * The browser in which to launch the application
   * once the module is created.
   * @type {string}
   */
  this.browser = 'chrome';
  /**
   * Should the script continue to run in the event of
   * handled errors and warnings?
   * @type {boolean}
   */
  this.continueOnError = false;
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
    this.setModuleNameCamel();
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
 * Spawns compass as a child process in order to compile
 * sass/scss files.
 * @param {Function} callBack to execute after css is compiled.
 * @see http://goo.gl/3bwDCq
 */
Appland.prototype.compileCss = function(callBack) {
  var sassConfigDir = path.join(this.PATH_APPLAND_HOME, './src/assets'),
    sassConfig = path.join(sassConfigDir, './config.rb'),
    sassModule = 'sass/module-' + this.moduleName + '.scss';

  this.emit('log', 'Compiling CSS...');

  if (! sassConfig) {
    this.emit('warn', 'Compass config.rb not found in ' + sassConfigDir);
    return;
  }

  var exec = require('child_process').exec,
    that = this,
    options = {
      timeout: 0,
      killSignal: 'SIGKILL',
      cwd: sassConfigDir
    };

  exec('compass compile ' + sassModule, options, function(err, stdout, stderr) {
    var buffer = stdout || stderr;

    if (err === null) { /* SUCCESS */
      that.emit('log', 'CSS compiled.');
      callBack();
      return;
    } else if (err !== null) {  /* ERROR */
      that.emit('warn', 'Code: ' + err.code);
      that.emit('warn', err);

      if (that.continueOnError) {
        that.emit('warn', 'Unknown error encountered. Continuing...');
        callBack();
      }

      return;
    }

    that.emit('log', buffer);
  });
};
/**
 * Manipulates module name to UpperCamelCase form.
 */
Appland.prototype.setModuleNameCamel = function() {
  var parts = this.moduleName.split('-');

  this.moduleNameCamel = _(parts).map(function(part) {
    part = part.charAt(0).toUpperCase() + part.slice(1);
    return part;
  }).join('');
};
/**
 * Should the script continue to run on error?
 * @param {boolean} val to set
 */
Appland.prototype.setContinueOnError = function(val) {
  this.continueOnError = val;
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
/**
 * Opens module in the browser.
 * @param {int} port number
 */
Appland.prototype.launch = function(port) {
  var that = this;

  this.emit('log', 'Launching App in "' + this.browser + '" browser...');

  open(
    'http://localhost:' + (+port) + '/module-' + this.moduleName + '/view/',
    this.browser,
    function (error) {
      if (error !== null) {
        that.emit('warn', error);
      }
    });
};

module.exports = Appland;