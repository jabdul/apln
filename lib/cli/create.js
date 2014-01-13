/**
 * Module Dependencies
 */
var chalk = require('chalk'),
    log = chalk.bold.green,
    warn = chalk.bold.magenta,
    error = chalk.bold.red;
var apln = require('../apln'); /* Models */
var prompt = require('prompt'),
    nsSchema = {
      properties: {
        namespace: {
          type: 'string',
          message: 'Namespace characters for the module [a-zA-Z0-9-].',
          required: true,
          pattern: /^[a-zA-Z0-9]{1}[a-zA-Z0-9-]*$/
        },
        appland: {
          type: 'string',
          message: "Provide full path to Appland's home directory.",
          pattern: /[/\\]+/,
          required: true
        }
      }
    };
/**
 * Handler for 'create' command.
 * @param {{verbose: ?string, moduleName: string}} options
 */
module.exports = function(options) {

  if (options.verbose) {
    apln.onMessage('Create');
  }

  if ( apln.Create.init(options.moduleName) ) {
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
      if (result.namespace && apln.Create.setNameSpace(result.namespace)
        && result.appland) {
        apln.Create.setPathToAppland(result.appland);
        if (! apln.Create.isModuleExists() ) {
          apln.Create.createModule();
        } else {
          apln.Create.emit(
            'error',
            'Module "' + apln.Create.getModuleName() + '" exists already. ' +
              'Remove existing module or create with a new name.');
        }
      } else {
        apln.terminate();
      }
    } catch (e) {
      apln.terminate(e);
    }
  });
}