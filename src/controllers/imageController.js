const { getFile } = require('../utils/imageUtils.js');

module.exports = {
  async uploadImage(request, response) {
    const file = request.file;

    const filename = file.filename;

    return response.json({ filename });
  },

  async getImage(request, response) {
    const { filename } = request.query;

    const file = getFile(filename);

    return response.sendFile(file);
  },
};
