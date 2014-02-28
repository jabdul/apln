/**
 * Module Dependencies
 * @type {*}
 */
var apln = new (require('../../../lib/apln/base/appland'))(),
    path = require('path');

/**
 * Specification: apln base class model for commands
 */
describe('apln base class model for commands', function(){
  var that = this;

  that.moduleName = 'my-app';
  that.nameSpace = 'my-app-ns';
  that.prop = ['moduleName', 'nameSpace', 'PATH_APPLAND_HOME'];

  beforeEach(function() {
    spyOn(apln, 'emit');
  });

  it('should validate module name', function() {
    expect(apln.validate(that.prop[0],that.moduleName)).toBe(true);
    expect(apln.validate(that.prop[0], 'm')).toBe(true);
    expect(apln.validate(that.prop[0],'9my-app')).toBe(false);
    expect(apln.validate(that.prop[0],'*')).toBe(false);
    expect(apln.validate(that.prop[0],'-my-app')).toBe(false);
    expect(apln.validate(that.prop[0],'')).toBe(false);
  });

  it("should validate module's namespace", function() {
    expect(apln.validate(that.prop[1],that.nameSpace)).toBe(true);
    expect(apln.validate(that.prop[1],'999')).toBe(true);
    expect(apln.validate(that.prop[1],999)).toBe(true);
    expect(apln.validate(that.prop[1],'x')).toBe(true);
    expect(apln.validate(that.prop[1],'D6')).toBe(true);
    expect(apln.validate(that.prop[1],'')).toBe(false);
    expect(apln.validate(that.prop[1],'$')).toBe(false);
    expect(apln.validate(that.prop[1],'2£')).toBe(false);
  });

  it("checks if Appland is installed", function() {
    var truePath = path.resolve(__dirname, '../../fixture/appland'),
        fakePath = "some/random/path";
    expect(apln.validate(that.prop[2],truePath)).toBe(true);
    expect(apln.validate(that.prop[2],fakePath)).toBe(false);
  });

  it("checks Appland's directory structure", function() {
    var appland = path.resolve(__dirname, '../../fixture/appland'),
        dirs = apln.appland;
    expect(apln.isPath(path.resolve(appland, dirs.src))).toBe(true);
    expect(apln.isPath(path.resolve(appland, dirs.srcTest))).toBe(true);
    expect(apln.isPath(path.resolve(appland, dirs.sass))).toBe(true);
    expect(apln.isPath(path.resolve(appland, dirs.build))).toBe(true);
  });

  it("sets the namespace UpperCamelCase", function() {
    apln.init(that.moduleName);
    expect(apln.moduleNameCamel).toBe('MyApp');
  });/**/
});