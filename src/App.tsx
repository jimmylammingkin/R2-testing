// src/App.tsx

import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { useState } from "react";
import "./App.css";
import { R2 } from "./s3Client"; // Our configured S3 client

const BUCKET_NAME = import.meta.env.VITE_R2_BUCKET_NAME;

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadMessage, setUploadMessage] = useState<string>("");
  const [downloadMessage, setDownloadMessage] = useState<string>("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      setUploadMessage("");
      setDownloadMessage("");
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadMessage("Please select a file first.");
      return;
    }

    setUploadMessage("Generating signed URL for upload...");

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: selectedFile.name,
    });

    try {
      // Create a pre-signed URL for putting an object
      const signedUrl = await getSignedUrl(R2, command, { expiresIn: 3600 }); // URL expires in 1 hour

      setUploadMessage("Uploading file...");

      // Use the signed URL to upload the file
      const response = await fetch(signedUrl, {
        method: "PUT",
        body: selectedFile,
        headers: {
          "Content-Type": selectedFile.type,
        },
      });

      if (response.ok) {
        setUploadMessage(
          `✅ File '${selectedFile.name}' uploaded successfully!`
        );
      } else {
        setUploadMessage(`❌ Upload failed: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadMessage("❌ Error creating signed URL.");
    }
  };

  const handleDownload = async () => {
    if (!selectedFile) {
      setDownloadMessage("Please upload a file first to download it.");
      return;
    }

    setDownloadMessage("Generating signed URL for download...");

    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: selectedFile.name,
    });

    try {
      // Create a pre-signed URL for getting an object
      const signedUrl = await getSignedUrl(R2, command, { expiresIn: 3600 });

      setDownloadMessage("URL generated. Starting download...");

      // Trigger download in the browser
      const link = document.createElement("a");
      link.href = signedUrl;
      link.download = selectedFile.name; // This suggests a filename to the browser
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setDownloadMessage(
        `✅ Download link for '${selectedFile.name}' was activated.`
      );
    } catch (error) {
      console.error("Error downloading file:", error);
      setDownloadMessage("❌ Error creating signed URL for download.");
    }
  };

  return (
    <div className="card">
      <h1>R2 S3 API Test (Client-Side)</h1>
      <div className="input-group">
        <input type="file" onChange={handleFileChange} />
      </div>
      <div className="button-group">
        <button onClick={handleUpload} disabled={!selectedFile}>
          Upload
        </button>
        <button onClick={handleDownload} disabled={!selectedFile}>
          Download
        </button>
      </div>
      {uploadMessage && <p className="message">{uploadMessage}</p>}
      {downloadMessage && <p className="message">{downloadMessage}</p>}
      <p className="warning">
        ⚠️ This method exposes API keys and is for testing only. Do not use in
        production.
      </p>
    </div>
  );
}

export default App;
