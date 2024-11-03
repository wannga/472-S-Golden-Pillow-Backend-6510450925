// uploadController.js
const express = require('express');
const multer = require('multer');
const path = require('path');

// Set storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/images')); // Store in public/images
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname); // Keep original file extension
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

// Configure Multer with the defined storage
const upload = multer({ storage: storage });

const router = express.Router();

// Define the POST route for file upload
router.post('/upload', upload.single('image'), (req, res) => {
  try {
    res.status(200).json({
      message: 'Image uploaded successfully!',
      filePath: `/images/${req.file.filename}`,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to upload image.', error });
  }
});

module.exports = router;
