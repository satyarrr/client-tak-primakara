"use client";

import useAuthentication from "../hooks/useAuthentication";
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const UploadComponent = () => {
  const { user } = useAuthentication();
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [tagId, setTagId] = useState("");
  const [tags, setTags] = useState([]);
  const [uploading, setUploading] = useState(false);

  // Fungsi untuk mengambil data tag dari API
  const fetchTags = async () => {
    try {
      const response = await fetch("http://localhost:2000/tagsall");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setTags(data);
    } catch (error) {
      console.error("Could not fetch tags:", error);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      console.error("No file selected");
      return;
    }

    if (!file || !title || !tagId) {
      alert("Please fill in all fields.");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("tag_id", tagId);
    formData.append("user_id", user?.user_id);

    try {
      const response = await fetch("http://localhost:2000/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        console.log("File uploaded successfully:", result);

        // Display success popup
        MySwal.fire({
          title: "Success!",
          text: "File uploaded successfully!",
          icon: "success",
          confirmButtonText: "OK",
          customClass: {
            confirmButton: "bg-blue-500 text-white rounded px-4 py-2",
          },
          buttonsStyling: false,
        });

        // Reset form or handle success
        setFile(null);
        setTitle("");
        setTagId("");
      } else {
        const error = await response.json();
        console.error("Upload failed:", error);
        MySwal.fire({
          title: "Error!",
          text: "File upload failed. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
          customClass: {
            confirmButton: "bg-red-500 text-white rounded px-4 py-2",
          },
          buttonsStyling: false,
        });
      }
    } catch (error) {
      console.error("Upload error:", error);
      MySwal.fire({
        title: "Error!",
        text: "An error occurred. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
        customClass: {
          confirmButton: "bg-red-500 text-white rounded px-4 py-2",
        },
        buttonsStyling: false,
      });
    } finally {
      setUploading(false);
    }
  };

  if (user?.role !== "mahasiswa") {
    return (
      <div>
        <p>Sorry you don't have access to this page</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md mb-40"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">
          Upload Certificate
        </h2>
        <div className="flex flex-col space-y-4">
          <input
            type="text"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Input your title for certificate"
            className="form-input mt-1 block w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
            required
          />
          <select
            name="tagId"
            value={tagId}
            onChange={(e) => {
              setTagId(e.target.value);
              console.log(e.target.value);
            }}
            className="form-select mt-1 block w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
            required
          >
            <option value="">Select Tag</option>
            {tags.map((tag) => (
              <option key={tag.id} value={tag.tag_id}>
                {tag.name}
              </option>
            ))}
          </select>
          <input
            type="file"
            name="file"
            onChange={handleFileChange}
            className="form-input mt-1 block w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
            required
          />
          <button
            type="submit"
            disabled={uploading}
            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${
              uploading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {uploading ? "Uploading..." : "Upload File"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadComponent;
