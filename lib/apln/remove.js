/**
 * Module dependencies.
 */
var Appland = require('./base/appland');
util = require('util');
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
}
// Inheriting Appland base class.
util.inherits(Remove, Appland);
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
};

module.exports = Remove;