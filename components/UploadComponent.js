"use client";

// components/UploadComponent.js

import React, { useState, useEffect } from "react";

const UploadComponent = () => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("Pending");
  const [tagId, setTagId] = useState("");
  const [tags, setTags] = useState([]);
  const [uploading, setUploading] = useState(false);
  const user_id = 1;

  // Fungsi untuk mengambil data tag dari API
  const fetchTags = async () => {
    try {
      const response = await fetch("http://localhost:2000/tags");
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

    // if (!file || !title || !status || !tagId) {
    //   alert("Please fill in all fields.");
    //   return;
    // }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    // formData.append("title", title);
    // formData.append("status", status);
    // formData.append("tag_id", tagId);
    formData.append("user_id", user_id);

    try {
      const response = await fetch("http://localhost:2000/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        console.log("File uploaded successfully:", result);
        // Reset form or handle success
      } else {
        const error = await response.json();
        console.error("Upload failed:", error);
        // Handle error
      }
    } catch (error) {
      console.error("Upload error:", error);
      // Handle error
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        {/* <input
          type="text"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="form-input mt-1 block w-full"
          required
        />
        <input
          type="text"
          name="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          placeholder="Status"
          className="form-input mt-1 block w-full"
          required
        />
        <select
          name="tagId"
          value={tagId}
          onChange={(e) => {
            setTagId(e.target.value);
            console.log(e.target.value);
          }}
          className="form-select mt-1 block w-full"
          required
        >
          <option value="">Select Tag</option>
          {tags.map((tag) => (
            <option key={tag.id} value={tag.tag_id}>
              {tag.name}
            </option>
          ))}
        </select> */}
        <input
          type="file"
          name="file"
          onChange={handleFileChange}
          className="form-input mt-1 block w-full"
          required
        />
        <button
          type="submit"
          disabled={uploading}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          {uploading ? "Uploading..." : "Upload File"}
        </button>
      </form>
    </div>
  );
};

export default UploadComponent;
