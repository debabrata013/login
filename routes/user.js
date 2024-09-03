const { Router } = require('express');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const User = require('../models/user');
const Document = require('../models/Document');
const Otpm = require('../services/otp');
const Email = require('../services/email');
const Text = require('../services/text');

const router = Router();
const JWT_SECRET = '$uperMan@123';

// Multer configuration for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, '/upload/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// File upload and document save handler
router.post('/docupload', upload.single('file'), async (req, res) => {
  const { heading } = req.body;
  const file = req.file;
  
  if (!file) return res.status(400).send('No file uploaded.');

  const token = req.cookies.token;
  if (!token) return res.status(401).send('Unauthorized: No token provided.');

  try {
    const { email } = jwt.verify(token, JWT_SECRET);

    const newDocument = new Document({
      title: heading,
      filePath: file.path,
      email,
      status: 'Processing'
    });

    await newDocument.save();
    res.send('File uploaded successfully and document saved.');
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).send('An error occurred during the upload process.');
  }
});

// GET request handler for document page view
router.get('/documents', async (req, res) => {
  try {
      const documents = await Document.find().sort({ uploadedAt: -1 }).exec(); // Fetch documents sorted by upload date
      res.render('documents', { documents }); // Render the documents.ejs view and pass the documents data
  } catch (error) {
      console.error('Error fetching documents:', error);
      res.status(500).send('Error fetching documents');
  }
});

// Render views
['/signin', '/signup', '/forgetpass', '/verify', '/home'].forEach(route => {
  router.get(route, (req, res) => res.render(route.substring(1)));
});

// User registration
router.post('/signup', async (req, res) => {
  const { fullName, email, password, vno } = req.body;

  await User.create({ fullName, email, password, vno });
  Email(email, 'Welcome mail', Text.welcometext(fullName));
  res.redirect("/user/signup");
});

// User login
router.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  try {
    const token = await User.matchpassword(email, password);
    const user = await User.findOne({ email });
    
    if (!user) return res.render('signin', { error: 'User not found' });

    res.cookie('token', token).redirect(user.role === 'USER' ? '/home' : '/');
  } catch (error) {
    console.error(error);
    res.render('signin', { error: error.toString() });
  }
});

// Email verification with OTP
router.post('/verify', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.json({ message: 'User not found' });

    const otpCode = Otpm(6);
    await user.updateOne({ otp: otpCode });
    Email(email, 'Verify mail', Text.otptext(otpCode));
    res.redirect("/user/forgetpass");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred" });
  }
});

// Password reset
router.post('/forgetpass', async (req, res) => {
  const { email, otp, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.json({ message: 'User not found with the provided email.' });

    if (user.otp === otp) {
      user.password = password;
      await user.save();
      res.redirect('/');
    } else {
      const newOtp = Otpm(6);
      await user.updateOne({ otp: newOtp });
      Email(email, 'Verify mail', Text.otptext(newOtp));
      res.json({ message: 'OTP does not match, a new OTP is sent. Check your email.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Logout handler
router.get('/logout', (req, res) => {
  res.clearCookie("token").redirect("/");
});

module.exports = router;
