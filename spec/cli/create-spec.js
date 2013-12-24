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
  that.prop = ['moduleName', 'nameSpace'];
  beforeEach(function() {
    spyOn(apln.create, 'init');
  });

  it('should initialise the process', function() {
    cli.argv({_: ['create',that.moduleName]});
    expect(apln.create.init).toHaveBeenCalledWith(that.moduleName);
    expect(apln.create.moduleName).not.toBe(that.moduleName);
  });

  it('should validate module name', function() {
    expect(apln.create.validate(that.prop[0],that.moduleName)).toBe(true);
    expect(apln.create.validate(that.prop[0], 'm')).toBe(true);
    expect(apln.create.validate(that.prop[0],'9my-app')).toBe(false);
    expect(apln.create.validate(that.prop[0],'*')).toBe(false);
    expect(apln.create.validate(that.prop[0],'-my-app')).toBe(false);
    expect(apln.create.validate(that.prop[0],'')).toBe(false);
  });
});