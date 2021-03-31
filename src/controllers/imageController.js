const { getFile } = require('../utils/imageUtils.js');
const fs = require('fs');

module.exports = {
  async uploadImage(request, response) {
    const file = request.file;

    const filename = file.filename + '.bmp';

    // renomear arquivo
    fs.rename('uploads/' + file.filename, 'uploads/' + filename, function (err) {
      if (err) console.log('ERROR: ' + err);
    });

    return response.json({ filename });
  },

  async getImage(request, response) {
    const { filename } = request.query;

    const file = getFile(filename);

    return response.sendFile(file);
  },
};
