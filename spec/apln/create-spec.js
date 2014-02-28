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

  it("checks scaffold source files exists", function() {
    var scaffold = apln.Create.scaffold;
    expect(apln.Create.isPath(scaffold.src)).toBe(true);
    expect(apln.Create.isPath(scaffold.srcTest)).toBe(true);
    expect(apln.Create.isPath(scaffold.sass)).toBe(true);
    expect(apln.Create.isPath(scaffold.build)).toBe(true);
    expect(apln.Create.isPath(scaffold.bogus)).toBe(false);
  });

  it("sets the namespace", function() {
    spyOn(apln.Create, 'validate');
    apln.Create.setNameSpace(that.nameSpace);
    expect(apln.Create.validate).toHaveBeenCalled();
  });
});