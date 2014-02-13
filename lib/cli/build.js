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
    apln.onMessage('Build');
  }

  if ( apln.Build.init(options.moduleName) ) {
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
      if (result.appland && apln.Build.setPathToAppland(result.appland)) {
        if ( apln.Build.isModuleExists() ) {
          apln.Build.buildModule();
        } else {
          apln.Build.emit(
            'error',
            'Module "' + apln.Build.getModuleName() + '" does not exist.');
        }
      } else {
        apln.terminate();
      }
    } catch (e) {
      apln.terminate(e);
    }
  });
}