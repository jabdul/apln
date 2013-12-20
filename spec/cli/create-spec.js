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
  beforeEach(function() {
    spyOn(apln, 'create');
  });

  it('should create the module', function() {
    cli.argv({_: ['create','my-app']});
    expect(apln.create).toHaveBeenCalledWith('my-app');
  });
});