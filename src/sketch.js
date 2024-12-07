import React, { useState, useEffect } from 'react';

function SketchToReality() {
  const [inputImage, setInputImage] = useState(null);
  const [inputImageUrl, setInputImageUrl] = useState(null);
  const [outputImage, setOutputImage] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');

  // Get username from local storage on component mount
  useEffect(() => {
    const storedUsername = localStorage.getItem('username'); // Fetch the username from local storage
    if (storedUsername) {
      setUsername(storedUsername);
    } else {
      setStatusMessage('No username found in local storage!');
    }
  }, []);

  // Clean up object URLs on component unmount
  useEffect(() => {
    return () => {
      if (inputImageUrl) URL.revokeObjectURL(inputImageUrl);
      if (outputImage) URL.revokeObjectURL(outputImage);
    };
  }, [inputImageUrl, outputImage]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setInputImage(file);
      setInputImageUrl(URL.createObjectURL(file));
      setStatusMessage('Image uploaded successfully!');
      setOutputImage(null);
    } else {
      setStatusMessage('No file selected.');
    }
  };

  const uploadSketch = async () => {
    if (!inputImage) {
      alert('Please upload a sketch image!');
      return;
    }

    setStatusMessage('Uploading image...');
    setLoading(true);

    const formData = new FormData();
    formData.append('image', inputImage);
    formData.append('username', username); // Use the username from state

    try {
      const response = await fetch('http://localhost:8000/generate-image', {
        method: 'POST',
        body: formData,
        mode: 'cors',
      });

      if (!response.ok) {
        throw new Error('Failed to generate the image');
      }

      const blob = await response.blob();
      const outputImageUrl = URL.createObjectURL(blob);
      setOutputImage(outputImageUrl);
      setStatusMessage('Image colorized successfully!');
      await saveImages(inputImage, blob);

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
    formData.append('username', username); // Use the username from state

    try {
      const response = await fetch('http://localhost:4567/upload-sketches', { // Updated to port 7654
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
      <h1>Sketches to Reality</h1>
      <p>Turn your rough sketches into fully rendered, realistic images, making your designs look professional and refined.</p>

      <div className="input-container">
        <input type="file" accept="image/*" onChange={handleFileChange} />
      </div>

      <div className="button-container">
        <button type="button" onClick={uploadSketch}>Generate Image</button>
      </div>

      <div id="statusMessage">{statusMessage}</div>

      <div className="output-container">
        {inputImage && <img src={inputImageUrl} alt="Input Sketch" style={{ width: '1280px', height: '1280px', objectFit: 'cover', margin: '20px 0' }} />}

        {loading && <div className="spinner"></div>}

        {outputImage && !loading && <img src={outputImage} alt="Output Rendered Image" style={{ width: '1280px', height: '1280px', margin: '20px 0', objectFit: 'cover' }} />}
      </div>

      {/* Inline CSS styling for the spinner */}
      <style>{`
        .spinner {
          border: 8px solid #f3f3f3;
          border-top: 8px solid #3498db;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          animation: spin 1s linear infinite;
          margin: 20px auto;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default SketchToReality;
