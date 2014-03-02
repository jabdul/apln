/**
 * Module Dependencies
 * @type {*}
 */
var cli = require('../../lib/cli'),
    apln = require('../../lib/apln');

/**
 * Specification: $ apln create <module-name>
 */
describe('$ apln create <module-name>', function(){
  var that = this;

  that.moduleName = 'my-app';
  beforeEach(function() {
    spyOn(apln.Create, 'init');
  });

  it('should initialise the create process', function() {
    cli.argv({_: ['create',that.moduleName]});
    expect(apln.Create.init).toHaveBeenCalledWith(that.moduleName);
    expect(apln.Create.moduleName).not.toBe(that.moduleName);
  });
});