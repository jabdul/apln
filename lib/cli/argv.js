/**
 * Module Dependencies
 * @type {*}
 */
var apln = require('../apln');
var create = new apln.create();

module.exports = function(argv, callback) {
  // --silent or --quiet or -q
  argv.silent = argv.silent || argv.quiet || argv.q;
  // --verbose or -v
  argv.verbose = argv.verbose || argv.v;

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

  if (argv._[0] === 'create' && typeof argv._[1] === 'string') {
    //apln.create();
    create.init(argv._[1]);
  }
};