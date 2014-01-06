/**
 * Module dependencies.
 */
var Emitter = require('./util/emitter');
var replaceStream = require('replacestream');
var path = require('path');
var fs = require('fs.extra');
var _ = require('lodash');
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
  var dirs = _.keys(this.appland),
      len = dirs.length,
      i = 0,
      dir,
      source;
  for (; i < len; i++) {
    dir = path.resolve(this.PATH_APPLAND_HOME, this.appland[dirs[i]]);
    source = this.scaffold[dirs[i]];
    // Check destination directory exists...
    if (! this.isPath(dir) ) {
      // ...create directory if it does not exist
      this.emit('warn', 'Directory does not exist: ' +
        path.join(this.PATH_APPLAND_HOME, this.appland[dirs[i]])
      );
      this.mkdir(dir, true);
    }
    this.copy(source, dir, true);
  }
  return true;
};
/**
 * Search and replace content of file.
 * @param {string} file
 * @param {string} search for text
 * @param {string} replace with text
 */
Create.prototype.searchReplace = function(file, search, replace) {
  var ws = fs.createWriteStream(file, {flags: 'r+', encoding: 'UTF-8'});

  fs.createReadStream(file)
    .pipe(replaceStream(search, replace, null))
    .pipe(ws);

  //rs.pipe(ws/*, { end: false }*/);

  /*rs.on('end', function() {
    //ws.write(process.stdout);
    ws.end();
  }); */
};
/**
 * Retrieve file(s) to search and replace content.
 * @param {string} dir is the directory containing files.
 */
Create.prototype.parseFiles = function(dir) {
  var files = fs.readdirSync(dir),
      len = files.length,
      i = 0,
      file;

  for (; i < len; i++) {
    file = path.join(dir, files[i]);
    if (this.isDir(files[i])) {
      this.parseFiles(file);
      //console.log(files[i], dir);
    } else {
      //console.log(this.moduleName, this.nameSpace, file);
      this.searchReplace(file, '{MODULE-NAME}', this.moduleName);
      this.searchReplace(file, '{MODULE-NAMESPACE-PREFIX}', this.nameSpace);
    }
  }
};
/**
 * Copy file and/or directory
 * @param {string} from
 * @param {string} to
 * @param {boolean} deepCopy
 */
Create.prototype.copy = function(from, to, deepCopy) {
  var self = this;
  if (deepCopy) {
    fs.copyRecursive(from, to, function (err) {
      if (err) {
        self.emit('warn', 'Cannot copy to Appland: ' + path.dirname(to));
        //throw err;
      }
      self.emit('log', 'Successfully copied to Appland: ' + path.dirname(to));
      self.parseFiles(to);
    });
  } else {
    fs.copy(from, to, function (err) {
      if (err) {
        self.emit('warn', 'Cannot copy to Appland: ' + path.dirname(to));
        //throw err;
      }
      self.emit('log', 'Successfully copied to Appland: ' + path.dirname(to));
      self.parseFiles(to);
    });
  }
};
/**
 * Create directory(ies)
 * @param {string} dir
 * @param {boolean} recursiveSync
 */
Create.prototype.mkdir = function(dir, recursiveSync) {
  var self = this;
  if (recursiveSync) {
    try {
      fs.mkdirpSync(dir);
      this.emit('log', 'directory created.');
    } catch(e) {
      this.emit('error', 'Cannot create directory: ' + dir);
      //throw e;
    }
  } else {
    fs.mkdirp(dir, function (err) {
      self.emit('log', 'directory created.');
      if (err) {
        self.emit('error', 'Cannot create directory: ' + dir);
        //throw err;
      }
    });
  }
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
 */
Create.prototype.isPath = function(fullPath) {
  return fs.existsSync(fullPath);
};

module.exports = Create;