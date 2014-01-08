/**
 * Module dependencies.
 */
var Emitter = require('./util/emitter');
var randomise = require('./util/randomise');
var HOMEPATH = require('./util/path').homePath();
var replaceStream = require('replacestream');
var path = require('path');
var fs = require('fs.extra');
var _ = require('lodash');
var open = require("open");
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
  this.appland = {
    'src': './src/module-',
    'srcTest': './src-test/module-',
    'sass': './src/assets/sass',
    'build': './_build/module-'
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
  var dirs = _.keys(this.appland),
      len = dirs.length,
      i = 0,
      dir,
      source;

  // Create temporary directory in order to mange file parsing
  this.tmpDir = path.resolve(HOMEPATH, this.tmpDir);
  this.emit('log', 'Creating temporary directory: ' + this.tmpDir);
  this.mkdir(this.tmpDir, true);

  for (; i < len; i++) {
    dir = path.resolve(this.PATH_APPLAND_HOME, this.appland[dirs[i]]);
    source = this.scaffold[dirs[i]];
    // Check destination directory exists...
    if (! this.isPath(path.dirname(dir)) ) {
      // ...create directory if it does not exist
      this.emit('warn', 'Directory does not exist: ' + path.dirname(dir));
      this.mkdir(dir, true);
    }
    this.copy(source, dir, true, true);
  }
  // TODO: Need to execute the following statements after the files have
  // been parsed.
  this.emit('log', 'Module "' + this.moduleName + '" successfully created.');
  this.launch();

  return true;
};
/**
 * Search and replace content of file.
 * @param {string} dest
 * @param {string} source
 */
Create.prototype.searchReplace = function( dest, source) {
  var that = this;
  // Copy file from template skeleton code in Appland...
  //...and save to temp directory
  fs.createReadStream(dest)
    .pipe(fs.createWriteStream(source, null));

  this.emit('log', 'Parsing: ' + dest);

  // Search and replace
  setTimeout(function() {
    fs.createReadStream(source)
      .pipe(replaceStream('{MODULE-NAME}', that.moduleName, null))
      .pipe(replaceStream('{MODULE-NAMESPACE-PREFIX}', that.nameSpace, null))
      .pipe(fs.createWriteStream(dest, null))
      /*.pipe(fs.unlinkSync(source))*/
      /*.pipe(fs.unlink(source, function (err) {
        if (err) throw err;
        console.log('successfully deleted ' + source);
      }))*/;
  }, 300);
};
/**
 * Retrieve file(s) to search and replace content.
 * @param {string} dir is the directory containing files.
 */
Create.prototype.parseFiles = function(dir) {
  var files = fs.readdirSync(dir),
      len = files.length,
      i = 0,
      file,
      source;

  for (; i < len; i++) {
    file = path.join(dir, files[i]);
    //console.log('Last seg: ', file.replace(/^.*[\\\/]/, ''));
    file = this.renameFile(file, file.replace(/^.*[\\\/]/, ''));
    if (this.isDir(files[i])) {
      //console.log('Dirname: ', path.basename(files[i]));
      this.parseFiles(file);
    } else {
      source  = this.generateTempPath(file);
      this.searchReplace(file, source);
    }
  }
};
/**
 * Generates temporary file path.
 * @param {string} file to generate.
 */
Create.prototype.generateTempPath = function(file) {
  return path.resolve(this.tmpDir, './' + randomise() + path.extname(file));
};
/**
 * Copy file and/or directory
 * @param {string} from
 * @param {string} to
 * @param {boolean} rename file.
 * @param {boolean} deepCopy
 */
Create.prototype.copy = function(from, to, deepCopy, rename) {
  var self = this;
  if (deepCopy) {
    fs.copyRecursive(from, to, function (err) {
      if (err) {
        self.emit('warn', 'Cannot copy to Appland: ' + path.dirname(to));
        //throw err;
      }
      self.emit('log', 'Copied to Appland: ' + path.dirname(to));
      if (rename) {
        to = self.renameFile(to, to.replace(/^.*[\\\/]/, ''));
      }
      self.parseFiles(to);
    });
  } else {
    fs.copy(from, to, function (err) {
      if (err) {
        self.emit('warn', 'Cannot copy to Appland: ' + path.dirname(to));
        //throw err;
      }
      self.emit('log', 'Copied to Appland: ' + path.dirname(to));
      self.parseFiles(to);
    });
  }
};
/**
 * Create directory(ies)
 * @param {string} dir
 * @param {boolean} recursiveSync
 * @return {boolean}
 */
Create.prototype.mkdir = function(dir, recursiveSync) {
  var self = this;
  if (recursiveSync) {
    try {
      fs.mkdirpSync(dir);
      this.emit('log', 'Directory created.');
      return true;
    } catch(e) {
      this.emit('error', 'Cannot create directory: ' + dir);
      //throw e;
    }
  } else {
    if (this.isPath(dir)) {
      self.emit('log', 'Directory already exists.');
      return true;
    }
    fs.mkdirp(dir, function (err) {
      self.emit('log', 'Directory created.');
      if (err) {
        self.emit('error', 'Cannot create directory: ' + dir);
        //throw err;
      }
      return true;
    });
  }

  return false;
};
/**
 * Renames the copied files and folders to match the module's
 * name.
 * @param {string} file to rename.
 * @param {string} type of file.
 * @return {string}
 */
Create.prototype.renameFile = function(file, type) {
  var newFileName = file;

  switch (type) {
    case 'module-':
      newFileName = file + this.moduleName;
      rename(file, newFileName);
      break;
    case 'module-.scss':
      newFileName = file.replace(
        /^(.*)module-\.scss$/,
        "$1module-" + this.moduleName + '.scss'
      );
      rename(file, newFileName);
      break;
    case '_.scss':
      newFileName = file.replace(
        /^(.*)_\.scss$/,
        "$1_" + this.moduleName + '.scss'
      );
      rename(file, newFileName);
      break;
    default:
      break;
  }

  function rename(from, to) {
    fs.renameSync(from, to);
  }

  return newFileName;
};
/**
 * Checks if module exists in Appland.
 * @return {boolean}
 */
Create.prototype.isModuleExists = function() {
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
Create.prototype.getModuleName = function() {
  return this.moduleName;
};
/**
 * Opens module in the browser.
 */
Create.prototype.launch = function() {
  var that = this;
  this.emit('log', 'Launching App in "' + this.browser + '" browser...');
  open(
    "http://localhost:9010/module-" + this.moduleName + "/view/",
    this.browser,
    function (error) {
      if (error !== null) {
        that.emit('warn', error);
        //console.log('ERROR: ' + error);
      }
  });
};
/**
 * Checks if file is a directory.
 * @param {string} resource
 * @return {boolean}
 */
Create.prototype.isDir = function(resource) {
  var file = path.extname(resource);
  //console.log('Ext: ' + file);
  return !!((file.match(/^\..+$/) === null));
};
/**
 * Checks if path exists in the filesystem.
 * @param {string} fullPath
 * @return {boolean}
 */
Create.prototype.isPath = function(fullPath) {
  return fs.existsSync(fullPath);
};

module.exports = Create;