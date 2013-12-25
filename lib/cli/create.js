/**
 * Module Dependencies
 * @type {*}
 */
var chalk = require('chalk'),
    log = chalk.bold.green,
    warn = chalk.bold.magenta,
    error = chalk.bold.red;
var apln = require('../apln');
var prompt = require('prompt'),
    nsSchema = {
      properties: {
        namespace: {
          type: 'string',
          message: 'Namespace characters for the module [a-zA-Z0-9-].',
          required: true,
          pattern: /^[a-zA-Z0-9]{1}[a-zA-Z0-9-]*$/
        },
        pathToAppland: {
          type: 'string',
          message: "Provide full path to Appland's home directory.",
          pattern: /[/\\]+/,
          required: true
        }
      }
    };

module.exports = function(options) {

  if (options.verbose) {
    apln.create.on('log', function(message) {
      console.log(log('LOG: ') + message);
    });

    apln.create.on('warn', function(message) {
      console.warn(warn('WARN: ') + message);
    });

    apln.create.on('error', function(message) {
      terminate(message);
    });
  }

  if ( apln.create.init(options.moduleName) ) {
    prompt.start();
    prompt.get(nsSchema, function (err, result) {
      try {
        if (result.namespace && apln.create.setNameSpace(result.namespace)
          && result.pathToAppland) {
            apln.create.setPathToAppland(result.pathToAppland);
            apln.create.makeModule();
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