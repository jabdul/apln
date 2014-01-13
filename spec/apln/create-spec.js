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
describe('apln create command class', function(){
  var that = this;

  that.moduleName = 'my-app';
  that.nameSpace = 'my-app-ns';
  that.prop = ['moduleName', 'nameSpace', 'PATH_APPLAND_HOME'];
  beforeEach(function() {
    spyOn(apln.Create, 'emit');
  });

  it('should validate module name', function() {
    expect(apln.Create.validate(that.prop[0],that.moduleName)).toBe(true);
    expect(apln.Create.validate(that.prop[0], 'm')).toBe(true);
    expect(apln.Create.validate(that.prop[0],'9my-app')).toBe(false);
    expect(apln.Create.validate(that.prop[0],'*')).toBe(false);
    expect(apln.Create.validate(that.prop[0],'-my-app')).toBe(false);
    expect(apln.Create.validate(that.prop[0],'')).toBe(false);
  });

  it("should validate module's namespace", function() {
    expect(apln.Create.validate(that.prop[1],that.nameSpace)).toBe(true);
    expect(apln.Create.validate(that.prop[1],'999')).toBe(true);
    expect(apln.Create.validate(that.prop[1],999)).toBe(true);
    expect(apln.Create.validate(that.prop[1],'x')).toBe(true);
    expect(apln.Create.validate(that.prop[1],'D6')).toBe(true);
    expect(apln.Create.validate(that.prop[1],'')).toBe(false);
    expect(apln.Create.validate(that.prop[1],'$')).toBe(false);
    expect(apln.Create.validate(that.prop[1],'2£')).toBe(false);
  });

  it("checks if Appland is installed", function() {
    var truePath = path.resolve(__dirname, '../fixture/appland'),
        fakePath = "some/random/path";
    expect(apln.Create.validate(that.prop[2],truePath)).toBe(true);
    expect(apln.Create.validate(that.prop[2],fakePath)).toBe(false);
  });

  it("checks scaffold source files exists", function() {
    var scaffold = apln.Create.scaffold;
    expect(apln.Create.isPath(scaffold.src)).toBe(true);
    expect(apln.Create.isPath(scaffold.srcTest)).toBe(true);
    expect(apln.Create.isPath(scaffold.sass)).toBe(true);
    expect(apln.Create.isPath(scaffold.build)).toBe(true);
    expect(apln.Create.isPath(scaffold.bogus)).toBe(false);
  });

  it("checks Appland's directory structure", function() {
    var appland = path.resolve(__dirname, '../fixture/appland'),
        dirs = apln.Create.appland;
    expect(apln.Create.isPath(path.resolve(appland, dirs.src))).toBe(true);
    expect(apln.Create.isPath(path.resolve(appland, dirs.srcTest))).toBe(true);
    expect(apln.Create.isPath(path.resolve(appland, dirs.sass))).toBe(true);
    expect(apln.Create.isPath(path.resolve(appland, dirs.build))).toBe(true);
  });

  it("sets the namespace", function() {
    spyOn(apln.Create, 'validate');
    apln.Create.setNameSpace(that.nameSpace);
    expect(apln.Create.validate).toHaveBeenCalled();
  });

  it("sets the namespace UpperCamelCase", function() {
    apln.Create.init(that.moduleName);
    expect(apln.Create.moduleNameCamel).toBe('MyApp');
  });
});