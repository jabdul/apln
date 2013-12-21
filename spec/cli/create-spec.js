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
  beforeEach(function() {
    spyOn(apln.create, 'init');
  });

  it('should create the module', function() {
    cli.argv({_: ['create','my-app']});
    expect(apln.create.init).toHaveBeenCalledWith('my-app');
    expect(apln.create.tag).toBe('creator');
  });
});