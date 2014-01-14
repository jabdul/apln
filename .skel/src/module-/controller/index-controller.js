define([
  'module-{MODULE-NAME}/app',
  'lib/requirejs/domReady!',
  'lib/requirejs/hbs!module-{MODULE-NAME}/view/tmpl/welcome'
],
function (App, Doc, welcomeTmpl) {
  function IndexController() {
    /**
     * App's DOM Container Element. 
     * @type {Object}
     */
    var appContainerEl = Doc.getElementById('{MODULE-NAMESPACE-PREFIX}-content');
    /**
     * Module's configuration.
     * @type {Object}
     */
    var moduleConfig = App.getModuleConfig('module-{MODULE-NAME}');
    /**
     * Script initialiser.
     * Executes a set of actions at start.
     */
    function init() {
      renderView();
      delegateEvents();
    }
    /**
     * Renders the view templates.
     */
    function renderView() {
      var templates = [welcomeTmpl(null)];
      appContainerEl.innerHTML = templates.join('\n');
    }
    /**
     * Event delegation.
     */
    function delegateEvents() {
    }

    var publicMethods = {
      init: init
    };

    return publicMethods;
  }
  return IndexController();
});