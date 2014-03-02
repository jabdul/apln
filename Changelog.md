## Changelog ##

### 0.2.0 ###
* This release now fully integrated with the [appland](http://appland.io/) project.
* Added `create` command feature to enable scaffolding of a new module in Appland. For example:
	* `$ apln create my-app`
* Added `remove` command feature to enable the deletion of a module in Appland. For example:
	* `$ apln remove my-app`
* Added `build` command. Concatenates your js and css files, optimizes js files, and copies your module files in dist directory. For example:
	* `$ apln build my-app`

### 0.1.2 ###
* Created project structure including the scaffolding templates in `.skel` directory.

### 0.1.1 ###
* Publish empty project simply to claim the `'apln'` namespace.