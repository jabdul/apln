/**
 * Module Dependencies
 */
var apln = require('../apln');
var chalk = require('chalk'),
    log = chalk.bold.green,
    warn = chalk.bold.magenta,
    error = chalk.bold.red;
/**
 * Root controller for all commands.
 * @param {{silent:string, verbose:string, help:string, quiet:string,
 *        s:string, v:string, h:string, q:string, _:array,
 *        silent:string, force:string, f:string}} argv
 */
module.exports = function(argv) {
  // --silent or --quiet or -q
  argv.silent = argv.silent || argv.quiet || argv.q;
  // --verbose or -v
  argv.verbose = argv.verbose || argv.v || !argv.silent;
  // --help or -h
  argv.help = argv.help || argv.h;
  // --force or -f
  argv.force = argv.force || argv.f;
  // Command
  argv._ = argv._ || [];

  // Need some help?
  if (argv.help || argv._.length == 0) {
    help();
  }

  // Verbose?
  if (argv.verbose) {
    setMessages();
  }

  // Handle command
  if ( ! command(argv._[0], argv._[1], argv) ) {
    apln.terminate('Command not recognised.');
  }
};
/**
 * Handlers for apln.
 * @param {string} command
 * @param {string} value
 * @param {object} options
 * @returns {boolean}
 */
function command(command, value, options) {
  var opt = {};

  switch(true) {
   case !!(/^(create|c)$/i.test(command)):
     var CreateHandler = require('./create');
     opt = {
       verbose: options.verbose,
       force: options.force,
       moduleName: value
     };
     CreateHandler(opt);
     break;
   case !!(/^(remove|r)$/i.test(command)):
     var RemoveHandler = require('./remove');
     opt = {
       verbose: options.verbose,
       force: options.force,
       moduleName: value
     };
     RemoveHandler(opt);
     break;
    case !!(/^(build|b)$/i.test(command)):
      var BuildHandler = require('./build');
      opt = {
        verbose: options.verbose,
        force: options.force,
        moduleName: value
      };
      BuildHandler(opt);
      break;
   default:
     return false;
     break;
  }

  return true;
}
/**
 * Sets feedback messages preference
 */
function setMessages () {
  // LOG
  apln.on('log', function(message) {
    console.log(log('LOG:   ') + message);
  });
  // WARN
  apln.on('warn', function(message) {
    console.warn(warn('WARN:  ') + message);
  });
  // ERROR
  apln.on('error', function(message) {
    console.log(error('ERROR: ') + message);
    process.exit(1);
  });
  // Completed
  apln.on('completed', function(message) {
    console.log(log('LOG:   ') + message);
  });
}
/**
 * Help
 * apln command-line user documentation.
 */
function help(){
  var help = require('./help');
  help();
  process.exit(1);
}