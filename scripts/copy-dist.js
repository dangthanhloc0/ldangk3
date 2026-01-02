const fs = require('fs');
const path = require('path');

const sourceDir = 'dist/keycloak-demo/browser';
const destDir = 'dist/keycloak-demo';

function copyDirRecursive(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const files = fs.readdirSync(src);
  files.forEach(file => {
    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);

    if (fs.statSync(srcPath).isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  });
}

// Copy browser folder contents to root
if (fs.existsSync(sourceDir)) {
  copyDirRecursive(sourceDir, destDir);
  console.log('Files copied successfully');
} else {
  console.log('Browser folder not found');
}
