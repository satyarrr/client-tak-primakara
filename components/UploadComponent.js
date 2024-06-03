"use client";

import useAuthentication from "../hooks/useAuthentication";
import React, { useState, useEffect, useRef } from "react";
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
  const fileInputRef = useRef(null);

  // Fungsi untuk mengambil data tag dari API
  const fetchTags = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/tagsall`
      );
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
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}http://localhost:2000/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

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

        // Reset form state
        setFile(null);
        setTitle("");
        setTagId("");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
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
            className="input input-bordered w-full "
            required
          />
          <select
            name="tagId"
            value={tagId}
            onChange={(e) => {
              setTagId(e.target.value);
              console.log(e.target.value);
            }}
            className=" select select-bordered w-full "
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
            ref={fileInputRef}
            onChange={handleFileChange}
            className="file-input file-input-bordered w-full "
            required
          />
          <button
            type="submit"
            disabled={uploading}
            className={`btn ${
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
