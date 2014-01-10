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
/**
 * Handler for 'remove' command.
 * @param {{verbose: ?string, moduleName: string}} options
 */
module.exports = function(options) {

  if (options.verbose) {
    apln.Remove.on('log', function(message) {
      apln.log(message);
    });

    apln.Remove.on('warn', function(message) {
      apln.warn(message);
    });

    apln.Remove.on('error', function(message) {
      apln.terminate(message);
    });
  }

  if ( apln.Remove.init(options.moduleName) ) {
    prompt.start();
    prompt.get(nsSchema, function (err, result) {
      try {
        if (result.appland && apln.Remove.setPathToAppland(result.appland)) {
          if ( apln.Remove.isModuleExists() ) {
            apln.Remove.destroyModule();
          } else {
            apln.Remove.emit(
              'error',
              'Module "' + apln.Remove.getModuleName() + '" does not exist.');
          }
        } else {
          apln.terminate();
        }
      } catch (e) {
        apln.terminate(e);
      }
    });
  }
};