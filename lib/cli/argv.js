/**
 * Module Dependencies
 * @type {*}
 */
var apln = require('../apln');

module.exports = function(argv, callback) {
  // --silent or --quiet or -q
  argv.silent = argv.silent || argv.quiet || argv.q;
  // --verbose or -v
  argv.verbose = argv.verbose || argv.v;

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
};