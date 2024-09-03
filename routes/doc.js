const express = require('express');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
const Document = require('../models/Document'); // Adjust the path to your Document schema

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/uploads/`));
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

// Secret key for JWT verification
const JWT_SECRET = '$uperMan@123';

// Handling the file upload
router.post('/docupload', upload.single('file'), async (req, res) => {
  console.log("/post/doc");

  try {
    const { heading } = req.body; // Get the heading from the form
    const file = req.file; // Get the uploaded file from Multer

    // Check if file exists
    if (!file) {
      return res.status(400).send('No file uploaded.');
    }
console.log("File got");

    // Extract the token from cookies
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).send('Unauthorized: No token provided.');
    }

    // Verify the token and decode it
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(401).send('Unauthorized: Invalid token.');
    }

    const email = decoded.email; // Extract the email from the decoded token

    // Create a new document entry
    const newDocument = new Document({
      title: heading,
      filePath: file.path,
      email: email,
      status: 'Processing'
    });

    await newDocument.save();

    return res.send('File uploaded successfully and document saved.');
  } catch (error) {
    console.error(error);
    return res.status(500).send('An error occurred during the upload process.');
  }
});

module.exports = router;
