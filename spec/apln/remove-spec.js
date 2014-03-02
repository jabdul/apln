/**
 * Module Dependencies
 * @type {*}
 */
var cli = require('../../lib/cli'),
    apln = require('../../lib/apln'),
    path = require('path');

/**
 * Specification: apln remove class model
 */
describe('apln remove command class', function(){
  var that = this;

  that.moduleName = 'my-app';
  that.prop = ['moduleName', 'PATH_APPLAND_HOME'];

  beforeEach(function() {
    spyOn(apln.Remove, 'emit');
  });

  it("checks appland source paths are defined", function() {
    apln.Remove.prepareResources();
    var appland = apln.Remove.appland;

    expect(appland.src).toBeDefined();
    expect(appland.srcTest).toBeDefined();
    expect(appland.sassController).toBeDefined();
    expect(appland.sassModule).toBeDefined();
    expect(appland.compiledCss).toBeDefined();
    expect(appland.build).toBeDefined();
    expect(appland.bogus).toBeUndefined();
  });
});