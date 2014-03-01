/**
 * Module dependencies.
 */
var Appland = require('./base/appland');
util = require('util');
var path = require('path');
var fs = require('fs.extra');
var _ = require('lodash');
/**
 * Module Creator
 * Creates the module skeleton.
 * @constructor
 */
function Build() {
  /**
   * Paths to source and assets.
   * @type {Object}
   */
  this.pathsConfig = null;
  /**
   * Port to launch module
   * @type {number}
   */
  this.launchPort = 9013;
}
// Inheriting Appland base class.
util.inherits(Build, Appland);
/**
 * Build module.
 * @return {*}
 */
Build.prototype.buildModule = function() {
  if (! this.isPath(this.PATH_APPLAND_HOME)) {
    this.emit('error', 'Path to Appland root directory does not exist.');
    return false;
  }

  var self = this;

  this.prepareResources();
  this.runTests(function() {
    self.compileCss(function() {
      self.optimiseJs(function() {
        self.copyAssets(function () {
          self.launch(self.launchPort);
          self.emit('completed');
        });
      });
    });
  });
};
/**
 * Runs the unit tests for the module.
 * @param {Function} callBack to execute after css is compiled.
 * @see http://goo.gl/vzB9SP for cli options.
 */
Build.prototype.runTests = function(callBack) {
  var exec = require('child_process').exec,
    that = this,
    options = {
      timeout: 0,
      killSignal: 'SIGKILL',
      cwd: this.PATH_APPLAND_HOME
    };

  this.emit('log', 'Running unit tests...');

  exec('node ' + this.pathsConfig.testRunner + ' ci --launch=Chrome,IE ' +
    this.testHarness, options,
    function(err, stdout, stderr) {
      var buffer = stdout || stderr;

      if (err === null) { /* SUCCESS */
        that.emit('log', 'Unit tests ran and completed.');
        callBack();
        return;
      } else if (err !== null) {  /* ERROR */
        that.emit('warn', 'Code: ' + err.code);
        that.emit('warn', err);

        if (that.continueOnError) {
          that.emit('warn', 'Unknown error encountered. Continuing...');
          callBack();
        } else {
          that.emit('error', 'Could not complete request. ABORTING.');
        }

        return;
      }

      that.emit('log', buffer);
  });
};
/**
 * Concatenate, Minify and Optimise JavaScript Files.
 * @param {Function} callBack to execute after css is compiled.
 */
Build.prototype.optimiseJs = function(callBack) {
  var exec = require('child_process').exec,
    that = this,
    options = {
      timeout: 0,
      killSignal: 'SIGKILL',
      cwd: path.resolve(this.PATH_APPLAND_HOME, this.pathsConfig.buildDir)
    };

  this.emit('log', 'Minifying and optimising JavaScripts...');

  exec('node ../../node_modules/requirejs/bin/r.js' + ' -o app.build.js', options,
    function(err, stdout, stderr) {
      var buffer = stdout || stderr;

      if (err === null) { /* SUCCESS */
        that.emit('log', 'JavaScripts minified and optimised.');
        callBack();
        return;
      } else if (err !== null) {  /* ERROR */
        that.emit('warn', 'Code: ' + err.code);
        that.emit('warn', err);

        if (that.continueOnError) {
          that.emit('warn', 'Unknown error encountered. Continuing...');
          callBack();
        } else {
          that.emit('error', 'Could not complete request. ABORTING.');
        }

        return;
      }

      that.emit('log', buffer);
  });
};
/**
 * Prepares resources for removal.
 */
Build.prototype.prepareResources = function() {
  this.pathsConfig = {
    'srcDir': './src/module-' + this.moduleName,
    'srcTestDir': './src-test/module-' + this.moduleName,
    'testRunner': '"./node_modules/testem/testem.js"',
    'testHarness': './src-test/module-' + this.moduleName + '/TestRunner.html',
    'testConfig': './testem.json',
    'buildDir': './_build/module-' + this.moduleName,
    'distDir': './dist/module-' + this.moduleName,
    'assetsDir': './src/assets/',
    'assetsDistDir': './dist/assets/'
  };
};
/**
 * Copy assets from development to distribution.
 * These are compiled CSS and images.
 * @param {Function} callBack
 */
Build.prototype.copyAssets = function(callBack) {
  // Compiled CSS...
  this.copy(
    path.resolve(this.PATH_APPLAND_HOME,
      this.pathsConfig.assetsDir,
      './css/' + 'module-' + this.moduleName + '.css'),
    path.resolve(this.PATH_APPLAND_HOME,
      this.pathsConfig.assetsDistDir,
      './css/' + 'module-' + this.moduleName + '.css')
  );

  // Images...
  this.copy(
    path.resolve(this.PATH_APPLAND_HOME,
      this.pathsConfig.assetsDir, './css/img'),
    path.resolve(this.PATH_APPLAND_HOME,
      this.pathsConfig.assetsDistDir, './css/img'),
    true
  );

  // Fonts...
  this.copy(
    path.resolve(this.PATH_APPLAND_HOME,
      this.pathsConfig.assetsDir, './fonts'),
    path.resolve(this.PATH_APPLAND_HOME,
      this.pathsConfig.assetsDistDir, './fonts'),
    true,
    callBack
  );
};
/**
 * Copy file and/or directory
 * @param {string} from
 * @param {string} to
 * @param {boolean=} deepCopy
 * @param {function=} callBack to execute
 */
Build.prototype.copy = function(from, to, deepCopy, callBack) {
  var self = this;

  this.emit('log', 'Copying assets... ' + path.dirname(to));

  if (deepCopy) {
    fs.copyRecursive(from, to, function (err) {
      if (err) {
        self.emit('warn', 'Cannot copy to assets to distribution folder ' + to);
      }
      self.emit('log', 'Copied to distribution folder: ' + to);
      if (_.isFunction(callBack)) {
        callBack();
      }
    });
  } else {
    fs.copy(from, to, function (err) {
      if (err) {
        self.emit('warn', 'Cannot copy to assets to distribution folder ' + to);
      }
      self.emit('log', 'Copied to distribution folder: ' + to);
    });
  }
};

module.exports = Build;