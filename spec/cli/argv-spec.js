/**
 * Module Dependencies
 * @type {*}
 */
var cli = require('../../lib/cli'),
    apln = require('../../lib/apln'),
    path = require('path');

/**
 * Specification: $ apln <command> <value> <options>
 */
describe('$ apln <command> <value> <options>', function(){
  var that = this;

  that.moduleName = 'my-app';
  that.nameSpace = 'my-app-ns';
  that.commands = ['create', 'c', 'remove', 'r', 'build', 'b'];
  that.options = ['verbose', 'quiet', 'help'];
  that.appland = path.resolve(__dirname, '../fixture/appland');
  that.argv = {
    _: [ that.commands[0], that.moduleName ],
    '$0': that.appland,
    silent: undefined,
    verbose: true,
    help: undefined,
    force: true
  };

  beforeEach(function() {
    spyOn(cli, 'argv');
    cli.argv(that.argv);
  });

  it('tracks the calling of argv spy', function() {
    expect(cli.argv).toHaveBeenCalled();
  });

  it("tracks argv spy number of calls", function() {
    expect(cli.argv.calls.length).toEqual(1);
  });

  it("tracks all the arguments argv spy calls", function() {
    expect(cli.argv).toHaveBeenCalledWith(that.argv);
  });
});