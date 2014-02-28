/**
 * Module Dependencies
 * @type {*}
 */
var apln = require('../../lib/apln');

/**
 * Specification: apln command mediator
 */
describe('apln mediator object', function(){

  beforeEach(function() {
    spyOn(apln, 'emit');
  });

  it("checks create command object is defined", function() {
    expect(apln.Create).toBeDefined();
  });

  it("checks remove command object is defined", function() {
    expect(apln.Remove).toBeDefined();
  });

  it("checks build command object is defined", function() {
    expect(apln.Build).toBeDefined();
  });

  it("checks fake command object is undefined", function() {
    expect(apln.fake).toBeUndefined();
  });

  it("checks process termination handler is defined", function() {
    expect(apln.terminate).toBeDefined();
  });

  it("checks warning message handler is defined", function() {
    expect(apln.warn).toBeDefined();
  });

  it("checks message logger is defined", function() {
    expect(apln.log).toBeDefined();
  });

  it("checks message listener is defined", function() {
    expect(apln.onMessage).toBeDefined();
  });
});