const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

walkDir('src', function(filePath) {
  if (filePath.endsWith('.js') || filePath.endsWith('.jsx') || filePath.endsWith('.css')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;
    content = content.replace(/#050c14/gi, '#0F172A');
    content = content.replace(/#050f1c/gi, '#0F172A');
    content = content.replace(/#0a2038/gi, '#1E293B');
    content = content.replace(/#0a1628/gi, '#1E293B');
    content = content.replace(/#091825/gi, '#1E293B');
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Updated', filePath);
    }
  }
});
