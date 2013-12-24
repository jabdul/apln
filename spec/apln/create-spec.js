/**
 * Module Dependencies
 * @type {*}
 */
var cli = require('../../lib/cli'),
    apln = require('../../lib/apln');

/**
 * Specification: apln create class model
 */
describe('apln create class', function(){
  var that = this;

  that.moduleName = 'my-app';
  that.prop = ['moduleName', 'nameSpace'];
  beforeEach(function() {
  });

  xit('checks module name after initialisation', function() {
    spyOn(apln.create, 'init').andCallFake( function(prop, moduleName) {
      this.moduleName = that.moduleName;
      //return true;
    });
    apln.create.init(that.moduleName);
    expect(apln.create.init).toHaveBeenCalledWith(that.moduleName);
    expect(apln.create.moduleName).toBe(that.moduleName);
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