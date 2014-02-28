/**
 * Module Dependencies
 * @type {*}
 */
var cli = require('../../lib/cli'),
    apln = require('../../lib/apln'),
    path = require('path');

/**
 * Specification: apln build class model
 */
describe('apln build command class', function(){
  var that = this;

  that.moduleName = 'my-app';
  that.prop = ['moduleName', 'PATH_APPLAND_HOME'];

  beforeEach(function() {
    spyOn(apln.Build, 'emit');
  });

  it("checks paths configuration source paths are defined", function() {
    apln.Build.prepareResources();
    var pathsConfig = apln.Build.pathsConfig;

    expect(pathsConfig.srcDir).toBeDefined();
    expect(pathsConfig.srcTestDir).toBeDefined();
    expect(pathsConfig.testRunner).toBeDefined();
    expect(pathsConfig.testHarness).toBeDefined();
    expect(pathsConfig.testConfig).toBeDefined();
    expect(pathsConfig.buildDir).toBeDefined();
    expect(pathsConfig.distDir).toBeDefined();
    expect(pathsConfig.assetsDir).toBeDefined();
    expect(pathsConfig.assetsDistDir).toBeDefined();
    expect(pathsConfig.bogus).toBeUndefined();
  });
});