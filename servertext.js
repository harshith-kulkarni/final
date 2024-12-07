const express = require('express');
const mongoose = require('mongoose');
const { MongoClient, GridFSBucket } = require('mongodb');
const multer = require('multer');
const stream = require('stream');
const cors = require('cors');
const app = express();
const port = 1234;

app.use(cors({
  origin: 'http://localhost:3000' // Allow only your frontend origin
}));

// Increase the JSON body limit for large payloads
app.use(express.json({ limit: '50mb' })); // Adjust the size as per your need

// MongoDB Connection URI
const mongoURI = 'mongodb+srv://harisonu151:zZYoHOEqz8eiI3qP@salaar.st5tm.mongodb.net/halsvar';

// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
const conn = mongoose.connection;
conn.on('error', console.error.bind(console, 'connection error:'));
conn.once('open', () => {
  console.log('Connected to MongoDB');
});

// GridFSBucket for file storage
let gfsBucket;
conn.once('open', () => {
  gfsBucket = new GridFSBucket(conn.db, { bucketName: 'uploads' });
});

// Define a User schema and model (only storing username and data)
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true }, // Ensure username is unique
  data: [
    {
      inputText: { type: String, required: true }, // Store input text instead of image ID
      outputImageId: mongoose.Schema.Types.ObjectId, // Store output image ID
    },
  ],
});
const User = mongoose.model('User', userSchema);

// Set up Multer with memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Helper function to upload files to GridFSBucket
const uploadFileToGridFS = (buffer, filename) => {
  return new Promise((resolve, reject) => {
    const readableStream = new stream.Readable();
    readableStream.push(buffer);
    readableStream.push(null);

    const uploadStream = gfsBucket.openUploadStream(filename);
    readableStream.pipe(uploadStream)
      .on('finish', () => resolve(uploadStream.id))
      .on('error', reject);
  });
};

app.post('/upload-text-and-image', upload.single('outputImage'), async (req, res) => {
  try {
    const { username, inputText } = req.body;
    const outputImage = req.file;

    if (!username || !inputText || !outputImage) {
      return res.status(400).json({ error: 'All fields (username, inputText, outputImage) are required.' });
    }

    console.log('Username:', username);
    console.log('Input Text:', inputText);
    console.log('File Info:', outputImage);

    const outputImageId = await uploadFileToGridFS(outputImage.buffer, outputImage.originalname);

    let user = await User.findOne({ username });
    if (!user) {
      user = new User({ username, data: [] });
    }

    user.data.push({ inputText, outputImageId });
    await user.save();

    res.status(200).json({ message: 'Text and output image stored successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to save text and output image.' });
  }
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
