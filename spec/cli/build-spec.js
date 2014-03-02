/**
 * Module Dependencies
 * @type {*}
 */
var cli = require('../../lib/cli'),
    apln = require('../../lib/apln');

/**
 * Specification: $ apln build <module-name>
 */
describe('$ apln build <module-name>', function(){
  var that = this;

  that.moduleName = 'my-app';
  beforeEach(function() {
    spyOn(apln.Build, 'init');
  });

  it('should initialise the build process', function() {
    cli.argv({_: ['build',that.moduleName]});
    expect(apln.Build.init).toHaveBeenCalledWith(that.moduleName);
    expect(apln.Build.moduleName).not.toBe(that.moduleName);
  });
});