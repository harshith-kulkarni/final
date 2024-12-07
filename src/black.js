import React, { useState, useEffect } from 'react';
import './black.css';

function Black() {
  const [inputImageSrc, setInputImageSrc] = useState(null);
  const [outputImageSrc, setOutputImageSrc] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const uploadSketch = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      alert('Please upload a sketch image!');
      return;
    }

    setInputImageSrc(URL.createObjectURL(file));
    setOutputImageSrc(null);
    setStatusMessage('Uploading image...');
    setLoading(true);

    const formData = new FormData();
    formData.append('image', file);
    formData.append('username', username);

    try {
      const response = await fetch('http://localhost:8001/generate-image', {  // Updated to port 7654
        method: 'POST',
        body: formData,
        mode: 'cors',
      });

      if (!response.ok) {
        throw new Error('Failed to generate the image');
      }

      const blob = await response.blob();
      const outputImageUrl = URL.createObjectURL(blob);
      setOutputImageSrc(outputImageUrl);
      setStatusMessage('Image colorized successfully!');
      await saveImages(file, blob);

    } catch (error) {
      setStatusMessage('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const saveImages = async (inputFile, outputImageBlob) => {
    const formData = new FormData();
    formData.append('inputImage', inputFile);
    formData.append('outputImage', outputImageBlob, 'output_image.png');
    formData.append('username', username);

    try {
      const response = await fetch('http://localhost:7654/upload-images', {  // Updated to port 7654
        method: 'POST',
        body: formData,
        mode: 'cors',
      });

      if (response.ok) {
        setStatusMessage('Images saved successfully in MongoDB!');
      } else {
        throw new Error('Failed to save images');
      }
    } catch (error) {
      setStatusMessage('Error saving images: ' + error.message);
    }
  };

  return (
    <div className="container">
      <h1>From Monochrome to Multicolor</h1>
      <p>Reimagine grayscale images with vibrant colors, breathing new life into them with our advanced colorization service.</p>

      <div className="input-container">
        <input type="file" id="sketchInput" accept="image/*" onChange={uploadSketch} />
      </div>

      <div className="button-container">
        <button type="button" onClick={() => document.getElementById('sketchInput').click()}>Generate Image</button>
      </div>
      <div id="statusMessage">{statusMessage}</div>

      <div className="output-container">
        {inputImageSrc && (
          <img src={inputImageSrc} alt="Uploaded sketch" style={{ width: '300px', height: '300px', objectFit: 'cover', margin: '20px 0' }} />
        )}

        {loading && <div className="loading-spinner" style={{ margin: '20px' }} />}

        {outputImageSrc && !loading && (
          <img src={outputImageSrc} alt="Generated output" style={{ width: '300px', height: '300px', objectFit: 'cover', margin: '20px 0' }} />
        )}
      </div>
      <style>
        {`
          .loading-spinner {
            border: 8px solid #f3f3f3;
            border-top: 8px solid #3498db;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            animation: spin 1s linear infinite;
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}

export default Black;
