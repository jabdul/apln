module.exports = function(argv) {
  var basePath,
      filePath,
      data;

  // Filename format: command.command.txt
  filePath = argv._.slice(0);
  filePath.push('txt');
  filePath = filePath.join('.');

  // Full doc file path
  basePath = path.join(__dirname, '..', '..', 'doc', 'cli');
  filePath = path.join(basePath, filePath);

  // Get help info
  data = fs.readFileSync(filePath, 'utf8');
  // Output
  console.log('\n' + data + '\n');
};