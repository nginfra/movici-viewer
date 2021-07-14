const fs = require('fs');

function getPosition(string, subString, index) {
  return string.split(subString, index).join(subString).length;
}

function removeLastChars(text, n) {
  n *= -1;
  return text.slice(0, n);
}

function resetDirectory(path) {
  if(fs.existsSync(path)) {
    fs.rmdirSync(path, { recursive: true });
  }
  fs.mkdirSync(path);
}


module.exports = {
  getPosition,
  removeLastChars,
  resetDirectory
}