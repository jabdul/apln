/**
 * Module Dependencies
 * @type {*}
 */
var cli = require('../../lib/cli'),
    apln = require('../../lib/apln');

/**
 * Specification: $ apln remove <module-name>
 */
describe('$ apln remove <module-name>', function(){
  var that = this;

  that.moduleName = 'my-app';
  beforeEach(function() {
    spyOn(apln.Remove, 'init');
  });

  it('should initialise the process', function() {
    cli.argv({_: ['remove',that.moduleName]});
    expect(apln.Remove.init).toHaveBeenCalledWith(that.moduleName);
    expect(apln.Remove.moduleName).not.toBe(that.moduleName);
  });
});