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
    spyOn(apln.create, 'init');
  });

  it('should initialise the process', function() {
    cli.argv({_: ['create',that.moduleName]});
    expect(apln.create.init).toHaveBeenCalledWith(that.moduleName);
    expect(apln.create.moduleName).not.toBe(that.moduleName);
  });
});