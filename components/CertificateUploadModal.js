"use client";
import { useState } from "react";
import Modal from "react-modal";
import axios from "axios";

const CertificateUploadModal = ({ onUpload }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);

  const handleDrop = (event) => {
    event.preventDefault();

    // Mengambil daftar file yang di-drop oleh pengguna
    const droppedFiles = Array.from(event.dataTransfer.files);

    // Menyimpan daftar file ke dalam state files
    setFiles(droppedFiles);
  };

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setTitle("");
    setFile(null);
  };

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    try {
      if (!file || !title) {
        console.error("Title and file are required");
        return;
      }

      const formData = new FormData();
      formData.append("certificate", file);
      formData.append("title", title);

      const response = await axios.post(
        "http://localhost:2000/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        console.log("Upload successful!");
        onUpload(); // Panggil fungsi callback jika diperlukan
        setModalOpen(false);
      } else {
        console.error("Upload failed:", response.data.error);
      }
    } catch (error) {
      console.error(
        "Error during upload:",
        error.response ? error.response.data : error.message
      );
    }
  };

  return (
    <div>
      <button onClick={handleModalOpen}>Open Modal</button>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleModalClose}
        contentLabel="Upload Certificate Modal"
      >
        <h2>Upload Certificate</h2>
        <form>
          <label>
            Title:
            <input type="text" value={title} onChange={handleTitleChange} />
          </label>
          <label>
            Choose File:
            <input type="file" onChange={handleFileChange} />
          </label>
          {/* Add drag and drop area here */}
          <p>Drag and drop your certificate here</p>
          <button type="button" onClick={handleUpload}>
            Upload
          </button>
          <button type="button" onClick={handleModalClose}>
            Close
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default CertificateUploadModal;
