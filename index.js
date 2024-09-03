const express = require('express');
const app = express();
const path = require('path');
const http = require('http');  // Required for Socket.io
const socketIo = require('socket.io');  // Socket.io for real-time updates
const UserRoutes = require('./routes/user');
const DocRoutes = require('./routes/doc');
const mongoose = require("mongoose");
const Document = require('./models/Document'); // Adjust the path if necessary

const cookieParser = require('cookie-parser');
const { checkForAuthenticationCookie } = require('./middlewares/authenticate');
const Feedback = require('./models/Feedback');
const port = 8000;
const multer = require('multer');
// Set up the server for Socket.io
const server = http.createServer(app);
const io = socketIo(server);  

// Set up EJS as the template engine
app.set("view engine", "ejs");
app.set("views", path.resolve('./views'));

app.use(express.json());
// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));

// Connect to MongoDB

mongoose.connect("mongodb://127.0.0.1:27017/trucktarcking").then(()=>{
    console.log('connected to db');
}).catch((e)=>{
    console.error("no connect"+e);
})
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        
        cb(null, path.resolve(`./public/upload/`));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Append extension
    }
});
const upload = multer({ storage: storage });
// Routes
app.get('/', (req, res) => {
    res.render('home', {
        user: req.user
    });
});

app.get('/home', (req, res) => {
    res.render('homeuser', {
        user: req.user
    });
});
app.get('/download/:id', async (req, res) => {
    try {
        const document = await Document.findById(req.params.id);

        if (!document) {
            return res.status(404).send('Document not found');
        }

        // Serve the file as a download
        res.download(document.filePath, document.title, (err) => {
            if (err) {
                console.error('Error downloading file:', err);
                res.status(500).send('Error downloading file');
            }
        });
    } catch (error) {
        console.error('Error fetching document:', error);
        res.status(500).send('Internal Server Error');
    }
});
// Location Schema and Model
const locationSchema = new mongoose.Schema({
    vno:{type:Number, default:1},
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now }
});

const Location = mongoose.model('Location', locationSchema);


app.post('/location', (req, res) => {
    console.log('Headers:', req.headers);
    console.log('Received data:', req.body); // Debug log

    const { latitude, longitude } = req.body;

    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
        return res.status(400).json({ error: 'Invalid data format' });
    }

    const newLocation = new Location({ latitude, longitude });
    newLocation.save()
        .then(() => {
            io.emit('locationUpdate', { latitude, longitude });
            res.json({ message: 'Location saved successfully' });
        })
        .catch(err => {
            console.error('Error saving location:', err); // Debug log
            res.status(500).json({ error: 'Failed to save location', details: err });
        });
});
app.get('/location/:vno', async (req, res) => {
    try {
        const { vno } = req.params;
        const latestLocation = await Location.findOne({ vno }).sort({ timestamp: -1 }).exec();

        if (latestLocation) {
            res.json({
                latitude: latestLocation.latitude,
                longitude: latestLocation.longitude
            });
        } else {
            res.status(404).json({ message: 'Location data not found for this Truck ID.' });
        }
    } catch (error) {
        console.error('Error fetching location data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/doc/docupload', upload.single('file'), async (req, res) => {
    try {
        const { email, heading } = req.body;
        const file = req.file;

        if (!email || !heading || !file) {
            return res.status(400).send('Email, document title, and file are required.');
        }

        // Create a new document entry in MongoDB
        const newDocument = new Document({
            title: heading,
            filePath: file.path,
            email: email, // Email from the form
            status: 'Processing', // Initial status
        });

        await newDocument.save();
        res.status(200).send('Document uploaded successfully!');
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while uploading the document.');
    }
});

// Handle WebSocket connections
io.on('connection', (socket) => {
    console.log('A user connected');
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Additional Routes
app.use('/user', UserRoutes);
app.use('/doc', DocRoutes);

// Feedback handling logic here (if needed)

// Start the server
server.listen(port, () => console.log(`Server listening at http://localhost:${port}`));
