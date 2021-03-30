const fs = require('fs');
const path = require('path');

module.exports = {
  writeFile(filename, data) {
    fs.appendFileSync(
      path.resolve(__dirname, '..', '..', 'uploads', filename),
      Buffer.from(data),
    );
  },

  getFile(filePath) {
    return path.resolve(__dirname, '..', '..', 'uploads', filePath);
  },

  readFileBytes(filePath) {
    const data = fs.readFileSync(
      path.resolve(__dirname, '..', '..', 'uploads', filePath),
    );
    const imageBytes = Uint8Array.from(data);
    return imageBytes;
  },
};
