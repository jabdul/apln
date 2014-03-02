/**
 * Module Dependencies
 * @type {*}
 */
var cli = require('../../lib/cli'),
    _ = require('lodash');

/**
 * Routing command
 */
describe('Routing command', function(){

  it('ensures the root controller argv exists', function() {
    expect(cli.argv).toBeDefined();
    expect(cli.somefunction).not.toBeDefined();
  });

  it('has the number of expected functions', function() {
    var funcs = _.keys(cli).length;
    expect(funcs).toBe(1);
    expect(funcs).not.toBeGreaterThan(1);
    expect(funcs).not.toBeLessThan(1);
  });
});