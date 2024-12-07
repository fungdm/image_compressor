import React, { useState } from "react";
import imageCompression from "browser-image-compression";
import "./App.css";

const App = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [compressedImage, setCompressedImage] = useState(null);
  const [compressionDetails, setCompressionDetails] = useState({});

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      setCompressedImage(null);
      setCompressionDetails({});
    }
  };

  const handleImageCompression = async () => {
    if (!selectedImage) return alert("Please select an image first.");

    const options = {
      maxSizeMB: 1, // Maximum size in MB
      maxWidthOrHeight: 1024, // Maximum width/height in pixels
      useWebWorker: true, // Use web workers for faster compression
    };

    try {
      const compressedFile = await imageCompression(selectedImage, options);
      setCompressedImage(compressedFile);

      // Compression details
      setCompressionDetails({
        originalSize: (selectedImage.size / 1024 / 1024).toFixed(2),
        compressedSize: (compressedFile.size / 1024 / 1024).toFixed(2),
        percentageReduction: (
          ((selectedImage.size - compressedFile.size) / selectedImage.size) *
          100
        ).toFixed(2),
      });
    } catch (error) {
      console.error("Compression error:", error);
      alert("Failed to compress the image.");
    }
  };

  const downloadImage = () => {
    if (!compressedImage) return;
    const url = URL.createObjectURL(compressedImage);
    const link = document.createElement("a");
    link.href = url;
    link.download = `compressed-${compressedImage.name}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="app">
      <h1>Offline Image Compressor</h1>
      <div className="upload-section">
        <input type="file" accept="image/*" onChange={handleImageUpload} />
        {selectedImage && (
          <p>
            Selected File: <strong>{selectedImage.name}</strong>
          </p>
        )}
      </div>
      <button onClick={handleImageCompression} disabled={!selectedImage}>
        Compress Image
      </button>

      {compressedImage && (
        <div className="result-section">
          <h3>Compression Details</h3>
          <p>
            Original Size: <strong>{compressionDetails.originalSize} MB</strong>
          </p>
          <p>
            Compressed Size:{" "}
            <strong>{compressionDetails.compressedSize} MB</strong>
          </p>
          <p>
            Reduction:{" "}
            <strong>{compressionDetails.percentageReduction}%</strong>
          </p>
          <button onClick={downloadImage}>Download Compressed Image</button>
        </div>
      )}
    </div>
  );
};

export default App;
