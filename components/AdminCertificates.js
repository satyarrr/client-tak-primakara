"use client";
import useAuthentication from "../hooks/useAuthentication";
import React, { useState, useEffect } from "react";

const AdminCertificates = () => {
  const { user } = useAuthentication();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [tags, setTags] = useState([]);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectCertId, setRejectCertId] = useState(null);

  useEffect(() => {
    fetchCertificates();
    fetchTags();
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

  const fetchTags = async () => {
    try {
      const response = await fetch("http://localhost:2000/tags");
      if (!response.ok) {
        throw new Error("Failed to fetch tags");
      }
      const data = await response.json();
      setTags(data || []);
    } catch (error) {
      console.error("Error fetching tags:", error.message);
    }
  };

  const getTagName = (tagId) => {
    const tag = tags.find((tag) => tag.id === tagId);
    return tag ? tag.name : "Unknown";
  };

  const getTagValue = (tagId) => {
    const tag = tags.find((tag) => tag.id === tagId); // Change tag_id to id
    return tag ? tag.value || "N/A" : "Unknown";
  };
  const handleReject = (certId) => {
    setRejectCertId(certId);
    setRejectReason("");
    setShowRejectModal(true);
  };
  const handleCloseRejectModal = () => {
    setShowRejectModal(false);
  };

  const handleRejectSubmit = async (certId) => {
    try {
      const response = await fetch(
        `http://localhost:2000/certificate/${certId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "reject", reason: rejectReason }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to reject certificate");
      }
      setShowRejectModal(false);
      fetchCertificates();
    } catch (error) {
      console.error("Error rejecting certificate:", error.message);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const response = await fetch(`http://localhost:2000/certificate/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) {
        throw new Error("Failed to update certificate status");
      }
      fetchCertificates();
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
    <div className="py-8">
      <ul>
        {certificates.map((certificate) => (
          <li
            key={certificate.cert_id}
            className="bg-white shadow-md rounded-lg p-6 mb-4"
          >
            <p class="mb-2">
              <span className="font-semibold">Tag: </span>
              {getTagName(certificate.tag_id)}
            </p>
            <p className="mb-2">
              <span classNameName="font-semibold">Poin:</span>{" "}
              {getTagValue(certificate.tag_id)}
            </p>
            <p className="mb-2">
              <span className="font-semibold">Time :</span>{" "}
              {new Date(certificate.time_stamp).toLocaleString({
                hour12: false,
              })}
            </p>
            <p className="mb-2">
              <span className="font-semibold">Full Name:</span>{" "}
              {certificate.user.full_name}
            </p>
            <p className="mb-2">
              <span className="font-semibold">User NIM:</span>{" "}
              {certificate.user.nim}
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() =>
                  handleStatusChange(certificate.cert_id, "approve")
                }
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Approve
              </button>
              <button
                onClick={() => handleReject(certificate.cert_id)}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
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
      {showRejectModal && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-4 max-w-lg">
            <h2 className="text-lg font-semibold mb-2">Reject Certificate</h2>
            <form onSubmit={() => handleRejectSubmit(rejectCertId)}>
              {" "}
              {/* Menggunakan rejectCertId */}
              <label className="block mb-2">
                Reason for rejection:
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  rows="4"
                  className="w-full border border-gray-300 rounded-md p-2"
                  required
                />
              </label>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="bg-gray-400 text-white font-bold py-2 px-4 rounded mr-2"
                  onClick={handleCloseRejectModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                >
                  Reject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCertificates;
