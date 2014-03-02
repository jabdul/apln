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
 * @param {{verbose:?string, moduleName:string, force:string}} options
 */
module.exports = function(options) {

  if (options.verbose) {
    apln.onMessage('Remove');
  }

  if ( apln.Remove.init(options.moduleName) ) {
    if (options.force) {
      apln.Remove.setContinueOnError(true);
    }

    startPrompt();
  }
};
/**
 * Start user prompt.
 */
function startPrompt(){
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