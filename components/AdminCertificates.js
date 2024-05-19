"use client";
import useAuthentication from "@/hooks/useAuthentication";
import React, { useState, useEffect } from "react";

const AdminCertificates = () => {
  const { user, logout } = useAuthentication();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    fetchCertificates();
    console.log("date", certificates.time_stamp);
  }, []);
  const fetchCertificates = async () => {
    try {
      const response = await fetch(
        "http://localhost:2000/certificates/all-with-users"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch certificates");
      }
      const data = await response.json();
      setCertificates(data.certificates || []);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const response = await fetch(`http://localhost:2000/certificate/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }), // Send the status in the request body
      });
      if (!response.ok) {
        throw new Error("Failed to update certificate status");
      }
      fetchCertificates();
      // Refresh the certificates list after successful update
    } catch (error) {
      console.error("Error updating certificate status:", error.message);
    }
  };

  const handlePreview = (filePath) => {
    setPreviewImage(filePath);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (user?.role !== "admin") {
    return (
      <div>
        <p>Sorry you don't have access to this page</p>
      </div>
    );
  }

  return (
    <div class="py-8">
      <button onClick={logout}>Logout</button>
      <h2 class="text-xl font-bold mb-4">Admin Certificates</h2>
      <ul>
        {certificates.map((certificate) => (
          <li
            key={certificate.cert_id}
            class="bg-white shadow-md rounded-lg p-6 mb-4"
          >
            <p class="mb-2">
              <span class="font-semibold">Title:</span> {certificate.title}
            </p>
            <p class="mb-2">
              <span class="font-semibold">Status:</span> {certificate.status}
            </p>
            <p class="mb-2">
              <span class="font-semibold">User ID:</span> {certificate.user_id}
            </p>
            <p class="mb-2">
              <span class="font-semibold">Time :</span>{" "}
              {new Date(certificate.time_stamp).toLocaleString({
                hour12: false,
              })}
            </p>
            <p class="mb-2">
              <span class="font-semibold">Full Name:</span>{" "}
              {certificate.user.full_name}
            </p>
            <p class="mb-2">
              <span class="font-semibold">User NIM:</span>{" "}
              {certificate.user.nim}
            </p>
            <div class="flex space-x-4">
              <button
                onClick={() =>
                  handleStatusChange(certificate.cert_id, "approve")
                }
                class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Approve
              </button>
              <button
                onClick={() =>
                  handleStatusChange(certificate.cert_id, "reject")
                }
                class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Reject
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => handlePreview(certificate.file_path)}
              >
                Preview
              </button>
            </div>
          </li>
        ))}
      </ul>
      {/* Modal for image preview */}
      {previewImage && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-4 max-w-lg">
            <img
              src={previewImage}
              alt="Certificate Preview"
              className="w-full"
            />
            <button
              className="absolute top-0 right-0 m-4 text-red-500 text-3xl hover:text-gray-800"
              onClick={() => setPreviewImage(null)}
            >
              X
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCertificates;
