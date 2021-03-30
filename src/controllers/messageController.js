const {
  esteganografia,
  decryptMsgFromImage,
} = require('../utils/messageUtils.js');
const { writeFile, readFileBytes } = require('../utils/imageUtils.js');

module.exports = {
  // POST
  async writeMessageOnImage(request, response) {
    const { filename, message } = request.body;

    const nonEncryptedImage = readFileBytes(filename);

    const encryptedImage = esteganografia(message, nonEncryptedImage);

    const encryptedFile = writeFile('encrypted_' + filename, encryptedImage);

    return response.json({ filename: 'encrypted_' + filename });
  },

  // GET
  async decodeMessageFromImage(request, response) {
    const { filename } = request.query;

    const imageBytes = readFileBytes(filename);

    const message = decryptMsgFromImage(imageBytes);

    return response.json({ message });
  },
};
