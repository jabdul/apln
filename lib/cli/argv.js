/**
 * Module Dependencies
 * @type {*}
 */
var apln = require('../apln');
var help = require('./help');

module.exports = function(argv, callback) {
  // --silent or --quiet or -q
  argv.silent = argv.silent || argv.quiet || argv.q;
  // --verbose or -v
  argv.verbose = argv.verbose || argv.v;
  // --verbose or -v
  argv.help = argv.help || argv.h;
  // Commands
  var command = argv._ || [];
  var create = new apln.create();

  if (argv.help) {
    help(argv);
    process.exit(1);
  }

  if (argv.verbose) {
    create.on('log', function(message) {
      console.log(message);
    });

    /*apln.on('warn', function(message) {
      console.warn(message);
    });

    apln.on('error', function(message) {
      console.error(message);
      process.exit(1);
    }); */
  }

  if (command[0] === 'create' && typeof command[1] === 'string') {
    create.init(command[1]);
  }
};