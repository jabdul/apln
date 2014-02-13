/**
 * Module dependencies.
 */
var Appland = require('./base/appland');
util = require('util');
var path = require('path');
var fs = require('fs.extra');
var _ = require('lodash');
var open = require("open");
var jasmine = require('jasmine-node');
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
  this.paths = {
    'src': '/src/module-',
    'srcTest': '/src-test/module-',
    'sass': '/src/assets/sass/',
    'build': '/_build/module-',
    'dist': '/dist/module-'
  };
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
    self.emit('log', 'Unit tests ran and completed.');
    self.compileCss(function() {
      self.emit('log', 'CSS compiled.');
    });
  });
  //this.compileCss();
  //this.optimiseJs();
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

  exec('node ' + this.paths.testRunner + ' ci --launch=Chrome,IE ' +
    this.testHarness, options,
    function(err, stdout, stderr) {
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
 * Concatenate, Minify and Optimise JavaScript Files.
 */
Build.prototype.optimiseJs = function() {
};
/**
 * Prepares resources for removal.
 */
Build.prototype.prepareResources = function() {
  this.paths = {
    'srcDir': './src/module-' + this.moduleName,
    'srcTestDir': './src-test/module-' + this.moduleName,
    'testRunner': '"./node_modules/testem/testem.js"',
    'testHarness': './src-test/module-' + this.moduleName + '/TestRunner.html',
    'testConfig': './testem.json',
    'buildDir': './_build/module-' + this.moduleName,
    'distDir': './dist/module-' + this.moduleName
  };
};

module.exports = Build;