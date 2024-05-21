"use client";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import useAuthentication from "../hooks/useAuthentication";

const FileUpload = () => {
  const { user } = useAuthentication();

  const [excelFile, setExcelFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const onDropExcel = (acceptedFiles) => {
    setExcelFile(acceptedFiles[0]);
  };

  const onDropImage = (acceptedFiles) => {
    setImageFile(acceptedFiles[0]);
  };

  const {
    getRootProps: getExcelRootProps,
    getInputProps: getExcelInputProps,
    isDragActive: isExcelDragActive,
  } = useDropzone({ onDrop: onDropExcel });
  const {
    getRootProps: getImageRootProps,
    getInputProps: getImageInputProps,
    isDragActive: isImageDragActive,
  } = useDropzone({ onDrop: onDropImage });

  const handleSubmit = async () => {
    if (!excelFile || !imageFile) {
      setMessage("Excel file and image are required");
      return;
    }

    setUploading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("file", excelFile);
      formData.append("image", imageFile);

      const response = await fetch("http://localhost:2000/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setMessage("Files uploaded successfully");
        console.log("Files uploaded successfully:", data);
      } else {
        const errorData = await response.json();
        setMessage("Error uploading files");
        console.error("Error uploading files:", errorData);
      }
    } catch (error) {
      setMessage("Error uploading files");
      console.error("Error uploading files:", error.message);
    } finally {
      setUploading(false);
    }
  };
  if (user?.role !== "admin") {
    return (
      <div>
        <p>Sorry you don't have access to this page</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Upload Excel File and Image
        </h2>

        <div
          {...getExcelRootProps()}
          className="border border-gray-300 rounded-md p-4 text-center cursor-pointer mb-4"
        >
          <input {...getExcelInputProps()} />
          {isExcelDragActive ? (
            <p>Drop the Excel file here ...</p>
          ) : (
            <p>Drag 'n' drop Excel file here, or click to select Excel file</p>
          )}
        </div>
        {excelFile && (
          <p className="mb-4">Excel file selected: {excelFile.name}</p>
        )}

        <div
          {...getImageRootProps()}
          className="border border-gray-300 rounded-md p-4 text-center cursor-pointer mb-4"
        >
          <input {...getImageInputProps()} />
          {isImageDragActive ? (
            <p>Drop the image file here ...</p>
          ) : (
            <p>Drag 'n' drop image file here, or click to select image file</p>
          )}
        </div>
        {imageFile && (
          <p className="mb-4">Image file selected: {imageFile.name}</p>
        )}

        <button
          onClick={handleSubmit}
          disabled={uploading}
          className={`bg-blue-500 text-white font-semibold py-2 px-4 rounded mb-4 w-full ${
            uploading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
          }`}
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>

        {message && <p className="text-center">{message}</p>}
      </div>
    </div>
  );
};

export default FileUpload;
