var fs = require('fs');
var path = require('path');
module.exports = function() {
  var basePath,
      filePath = [],
      data;

  // Filename format: command.command.txt
  filePath.push('help.txt');
  filePath = filePath.join('.');
  // Full doc file path
  basePath = path.join(__dirname, '..', '..', 'doc', 'cli');
  filePath = path.join(basePath, filePath);

  // Get help info
  data = fs.readFileSync(filePath, 'utf8');
  // Output
  console.log('\n' + data + '\n');
};