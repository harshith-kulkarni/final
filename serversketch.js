const express = require('express');
const mongoose = require('mongoose');
const { MongoClient, GridFSBucket } = require('mongodb');
const multer = require('multer');
const stream = require('stream');
const cors = require('cors');
const app = express();
const port = 4567;

app.use(cors({
  origin: 'http://localhost:3000' // Allow only your frontend origin
}));

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

// Define a User schema and model (only storing username and images)
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true }, // Ensure username is unique
  sketches: [
    {
      inputImageId: mongoose.Schema.Types.ObjectId,
      outputImageId: mongoose.Schema.Types.ObjectId,
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

// Endpoint to upload images and associate them with a username
app.post('/upload-sketches', upload.fields([{ name: 'inputImage' }, { name: 'outputImage' }]), async (req, res) => {
  const { username } = req.body; // Extract the username from the request body
  const inputImage = req.files['inputImage'][0]; // Extract the input image from request
  const outputImage = req.files['outputImage'][0]; // Extract the output image from request

  try {
    // Ensure username is provided
    if (!username) {
      return res.status(400).json({ error: 'Username is required.' });
    }

    // Upload input and output images to GridFS
    const inputImageId = await uploadFileToGridFS(inputImage.buffer, inputImage.originalname);
    const outputImageId = await uploadFileToGridFS(outputImage.buffer, outputImage.originalname);

    // Find or create the user document
    let user = await User.findOne({ username });
    if (!user) {
      user = new User({ username, sketches: [] });
    }

    // Add the image IDs to the user's images array
    user.sketches.push({ inputImageId, outputImageId });
    await user.save();

    res.status(200).json({ message: 'Images and username stored successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to save images and username.' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
