const fs = require('fs');
const path = require('path');

const srcDir = './src';

function renameFiles(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      renameFiles(filePath);
    } else if (file.endsWith('.js') && !file.endsWith('.config.js')) {
      const newPath = filePath.replace('.js', '.jsx');
      fs.renameSync(filePath, newPath);
      console.log(`Renamed: ${filePath} -> ${newPath}`);
    }
  });
}

renameFiles(srcDir);
console.log('All .js files renamed to .jsx');
