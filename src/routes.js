const express = require('express');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const { getImage, uploadImage } = require('./controllers/imageController.js');
const {
  writeMessageOnImage,
  decodeMessageFromImage,
} = require('./controllers/messageController.js');

const routes = express.Router();

//Image Routes
routes.post('/upload', upload.single('image'), uploadImage);
routes.get('/get-image', getImage);

//Message Routes
routes.post('/write-message-on-image', writeMessageOnImage);
routes.get('/decode-message-from-image', decodeMessageFromImage);

module.exports = routes;
