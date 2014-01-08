/**
 * Module Dependencies
 */
var chalk = require('chalk'),
    log = chalk.bold.green,
    warn = chalk.bold.magenta,
    error = chalk.bold.red;
var apln = require('../apln');
var prompt = require('prompt'),
    nsSchema = {
      properties: {
        appland: {
          type: 'string',
          message: "Provide full path to Appland's home directory.",
          pattern: /[/\\]+/,
          required: true
        }
      }
    };

module.exports = function(options) {

  if (options.verbose) {
    apln.remove.on('log', function(message) {
      console.log(log('LOG: ') + message);
    });

    apln.remove.on('warn', function(message) {
      console.warn(warn('WARN: ') + message);
    });

    apln.remove.on('error', function(message) {
      terminate(message);
    });
  }

  if ( apln.remove.init(options.moduleName) ) {
    prompt.start();
    prompt.get(nsSchema, function (err, result) {
      try {
        if (result.appland && apln.remove.setPathToAppland(result.appland)) {
          if (! apln.remove.isModuleExists() ) {
            apln.remove.destroyModule();
          } else {
            apln.remove.emit(
              'error',
              'Module "' + apln.remove.getModuleName() + '" does not exist.');
          }
        } else {
          terminate();
        }
      } catch (e) {
        terminate();
      }
    });
  }

  function terminate (message) {
    var msg = message || 'Unknown error, terminating process.';
    console.log(error('ERROR: ') + msg);
    process.exit(1);
  }
};