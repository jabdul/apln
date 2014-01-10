/**
 * Module Dependencies
 */
var apln = require('../apln');
var chalk = require('chalk'),
    log = chalk.bold.green,
    warn = chalk.bold.magenta,
    error = chalk.bold.red;
/**
 * Root handler for all commands.
 * @param {{silent: string, verbose:string, help: string, quiet:string,
 *        s: string, v:string, h: string, q:string, _: array,
 *        silent:string}} argv
 */
module.exports = function(argv) {
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
    help();
    process.exit(1);
  }

  // Verbose?
  if (argv.verbose) {
    apln.on('log', function(message) {
      console.log(log('LOG:   ') + message);
    });

    apln.on('warn', function(message) {
      console.warn(warn('WARN:  ') + message);
    });

    apln.on('error', function(message) {
      console.log(error('ERROR: ') + message);
      process.exit(1);
    });
  }

  // Handle create command
  if (/^(create|c)$/i.test(command[0])) {
    var CreateHandler = require('./create');
    options = {
      verbose: argv.verbose,
      moduleName: command[1]
    };
    CreateHandler(options);
  }
  // Handle remove command
  if (/^(remove|r)$/i.test(command[0])) {
    var RemoveHandler = require('./remove');
    options = {
      verbose: argv.verbose,
      moduleName: command[1]
    };
    RemoveHandler(options);
  }
};