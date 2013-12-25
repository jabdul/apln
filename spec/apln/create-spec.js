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
  that.nameSpace = 'comp-modA';
  that.prop = ['moduleName', 'nameSpace', 'PATH_APPLAND_HOME'];
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

  it("should validate module's namespace", function() {
    expect(apln.create.validate(that.prop[1],that.nameSpace)).toBeTruthy();
    expect(apln.create.validate(that.prop[1],'999')).toBeTruthy();
    expect(apln.create.validate(that.prop[1],999)).toBeTruthy();
    expect(apln.create.validate(that.prop[1],'x')).toBeTruthy();
    expect(apln.create.validate(that.prop[1],'D6')).toBeTruthy();
    expect(apln.create.validate(that.prop[1],'')).toBeFalsy();
    expect(apln.create.validate(that.prop[1],'$')).toBeFalsy();
    expect(apln.create.validate(that.prop[1],'2£')).toBeFalsy();
  });

  it("checks if Appland in installed", function() {
    var truePath = "C:\\Users\\ABC\\Documents\\Tests\\Appland",
        fakePath = "some/random/path";
    expect(apln.create.validate(that.prop[2],truePath)).toBeTruthy();
    expect(apln.create.validate(that.prop[2],fakePath)).toBeFalsy();
  });
});