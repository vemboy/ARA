const sharp = require('sharp');
const path = require('path');

const inputFile = 'ara_logo_test_2.png';
const outputFile = 'ara_logo_test_2_upscaled.png';

sharp(inputFile)
  .resize(800, 800, { fit: 'inside', withoutEnlargement: false })
  .toFile(outputFile)
  .then(() => {
    console.log('Logo image upscaled successfully.');
  })
  .catch((error) => {
    console.error('Error upscaling logo image:', error);
  });