/**
 * Module dependencies.
 */
var Appland = require('./base/appland');
util = require('util');
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
// Inheriting Appland base class.
util.inherits(Create, Appland);
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
 * Copy module skeleton code.
 * @return {boolean}
 */
Create.prototype.createModule = function() {
  if (! this.isPath(this.PATH_APPLAND_HOME)) {
    this.emit('error', 'Path to Appland root directory does not exist.');
    return false;
  }
  var dirs = _.keys(this.appland),
      len = dirs.length,
      i = 0,
      dir,
      source,
      self = this;

  try {
    // Create temporary directory in order to manage file parsing
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
    // been parsed without using CPS. Find a way to detect the operation on
    // the last file; then execute the following lines.
    setTimeout(function() {
      self.emit('log', 'Module "' + self.moduleName + '" successfully created.');
      self.compileCss(function() {
        self.launch();
      });
    }, 5000);
  } catch (e){
    this.emit('error', e);
  }

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

  // Search and replace content in source file...
  // ...and replace file in Appland
  setTimeout(function() {
    var s = fs.createReadStream(source)
      .pipe(replaceStream('{MODULE-NAME}', that.moduleName, null))
      .pipe(replaceStream('{MODULE-NAMESPACE-PREFIX}', that.nameSpace, null))
      .pipe(replaceStream('{MODULE-NAME-CAMEL}', that.moduleNameCamel, null))
      .pipe(fs.createWriteStream(dest, null));

    // remove file (source) from tmp directory.
    s.on('close', function() {
      fs.rmrf(source, function (err) {
        if (err) {
          that.emit('warn', 'Could not remove file from tmp.');
        }
      })
    });
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
    file = this.renameFile(file, file.replace(/^.*[\\\/]/, ''));
    if (this.isDir(files[i])) {
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
 * @param {boolean} deepCopy
 * @param {boolean} rename file.
 */
Create.prototype.copy = function(from, to, deepCopy, rename) {
  var self = this;
  if (deepCopy) {
    fs.copyRecursive(from, to, function (err) {
      if (err) {
        self.emit('warn', 'Cannot copy to Appland: ' + path.dirname(to));
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
 * Spawns compass as a child process in order to compile
 * sass/scss files.
 * @param {Function} callBack to execute after css is compiled.
 * @see http://goo.gl/3bwDCq
 */
Create.prototype.compileCss = function(callBack) {
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
      callBack();
      return;
    } else if (err !== null) {  /* ERROR */
      that.emit('warn', 'Code: ' + err.code);
      that.emit('warn', err);
      return;
    }

    that.emit('log', buffer);
  });
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
      }
  });
};

module.exports = Create;