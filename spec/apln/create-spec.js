/**
 * Module Dependencies
 * @type {*}
 */
var cli = require('../../lib/cli'),
    apln = require('../../lib/apln'),
    path = require('path');

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
    expect(apln.create.validate(that.prop[1],that.nameSpace)).toBe(true);
    expect(apln.create.validate(that.prop[1],'999')).toBe(true);
    expect(apln.create.validate(that.prop[1],999)).toBe(true);
    expect(apln.create.validate(that.prop[1],'x')).toBe(true);
    expect(apln.create.validate(that.prop[1],'D6')).toBe(true);
    expect(apln.create.validate(that.prop[1],'')).toBe(false);
    expect(apln.create.validate(that.prop[1],'$')).toBe(false);
    expect(apln.create.validate(that.prop[1],'2£')).toBe(false);
  });

  it("checks if Appland is installed", function() {
    var truePath = path.resolve(__dirname, '../fixtures/appland'),
        fakePath = "some/random/path";
    expect(apln.create.validate(that.prop[2],truePath)).toBe(true);
    expect(apln.create.validate(that.prop[2],fakePath)).toBe(false);
  });

  it("checks scaffold source files exists", function() {
    var scaffold = apln.create.scaffold;
    expect(apln.create.isPath(scaffold.src)).toBe(true);
    expect(apln.create.isPath(scaffold.srcTest)).toBe(true);
    expect(apln.create.isPath(scaffold.sass)).toBe(true);
    expect(apln.create.isPath(scaffold.build)).toBe(true);
    expect(apln.create.isPath(scaffold.bogus)).toBe(false);
  });

  it("checks Appland's directory structure", function() {
    var appland = path.resolve(__dirname, '../fixtures/appland'),
        dirs = apln.create.appland;
    expect(apln.create.isPath(path.resolve(appland, dirs.src))).toBe(true);
    expect(apln.create.isPath(path.resolve(appland, dirs.srcTest))).toBe(true);
    expect(apln.create.isPath(path.resolve(appland, dirs.sass))).toBe(true);
    expect(apln.create.isPath(path.resolve(appland, dirs.build))).toBe(true);
  });
});