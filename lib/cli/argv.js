/**
 * Module Dependencies
 * @type {*}
 */
var apln = require('../apln');

module.exports = function(argv, callback) {
  // --silent or --quiet or -q
  argv.silent = argv.silent || argv.quiet || argv.q;
  // --verbose or -v
  argv.verbose = argv.verbose || argv.v || !argv.silent;
  // --verbose or -v
  argv.help = argv.help || argv.h;
  // Commands
  var command = argv._ || [],
      options;

  // Need some help?
  if (argv.help || command.length == 0) {
    var help = require('./help');
    help(argv);
    process.exit(1);
  }

  // Verbose?
  if (argv.verbose) {
    apln.on('log', function(message) {
      console.log(message);
    });

    apln.on('warn', function(message) {
      console.warn(message);
    });

    apln.on('error', function(message) {
      console.error(message);
      process.exit(1);
    });
  }

  // Handle create command
  if (/^(create|c)$/i.test(command[0])) {
    var create = require('./create');
    options = {
      verbose: argv.verbose,
      moduleName: command[1]
    };
    create(options);
  }
};