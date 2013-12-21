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
    that.Create = new apln.create();
    spyOn(that.Create, 'init');
  });

  it('should create the module', function() {
    cli.argv({_: ['create','my-app']});
    //expect(that.Create.init).toHaveBeenCalledWith('my-app');
    expect(that.Create.tag).toBe('creator');
  });
});