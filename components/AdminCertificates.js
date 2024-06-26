"use client";
import useAuthentication from "../hooks/useAuthentication";
import React, { useState, useEffect } from "react";

const AdminCertificates = () => {
  const { user } = useAuthentication();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingImage, setLoadingImage] = useState(false);
  const [error, setError] = useState(null);
  const [previewPDF, setPreviewPDF] = useState(null);
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
        `${process.env.NEXT_PUBLIC_API_URL}/certificates/all-with-users`
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tags`);
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
    const tag = tags.find((tag) => tag.id === tagId);
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
        `${process.env.NEXT_PUBLIC_API_URL}/certificate/${certId}`,
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
      alert("Rejected");
      setShowRejectModal(false);
      fetchCertificates();
    } catch (error) {
      console.error("Error rejecting certificate:", error.message);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/certificate/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update certificate status");
      }
      alert("Approved");
      fetchCertificates();
    } catch (error) {
      console.error("Error updating certificate status:", error.message);
    }
  };
  const handlePreview = (filePath) => {
    setLoadingImage(true);
    if (filePath.toLowerCase().endsWith(".pdf")) {
      setPreviewPDF(filePath);
      setPreviewImage(null);
    } else if (filePath.match(/\.(jpeg|jpg|gif|png)$/i)) {
      setPreviewImage(filePath);
      setPreviewPDF(null);
    } else {
      setPreviewPDF(null);
      setPreviewImage(null);
      console.error("File format not supported");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <span className="loading loading-ring loading-lg"></span>
      </div>
    );
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
    <div className="">
      <div className="py-8">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2">Tag</th>
              <th className="py-2">Poin</th>
              <th className="py-2">Tanggal</th>
              <th className="py-2">Waktu</th>
              <th className="py-2">Tanggal Kegiatan</th>
              <th className="py-2">Nama Lengkap</th>
              <th className="py-2">NIM</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {certificates.map((certificate) => (
              <tr
                key={certificate.cert_id}
                className="bg-white shadow-md rounded-lg p-6 mb-4"
              >
                <td className="border px-4 py-2">
                  {getTagName(certificate.tag_id)}
                </td>
                <td className="border px-4 py-2">
                  {getTagValue(certificate.tag_id)}
                </td>
                <td className="border px-4 py-2">
                  {new Date(certificate.time_stamp).toLocaleDateString(
                    "en-GB",
                    {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    }
                  )}
                </td>

                <td className="border px-4 py-2">
                  {new Date(certificate.time_stamp).toLocaleTimeString(
                    "en-US",
                    { hour: "2-digit", minute: "2-digit", hour12: false }
                  )}
                </td>
                <td className="border px-4 py-2">N/A</td>
                <td className="border px-4 py-2">
                  {certificate.user.full_name}
                </td>
                <td className="border px-4 py-2">{certificate.user.nim}</td>
                <td className="border px-4 py-2">
                  <div className="flex space-x-4">
                    <button
                      onClick={() =>
                        handleStatusChange(certificate.cert_id, "approve")
                      }
                      className="btn btn-success"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(certificate.cert_id)}
                      className="btn btn-error"
                    >
                      Reject
                    </button>
                    <button
                      className="btn"
                      onClick={() => handlePreview(certificate.file_path)}
                    >
                      Preview
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for image preview */}

      {previewPDF && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-200/75 flex items-center justify-center ">
          <div className="bg-white items-center p-5 w-[500] justify-center rounded-lg">
            {loadingImage && (
              <div className="flex items-center justify-center h-screen bg-slate-50">
                <span className="loading loading-ring loading-lg"></span>
              </div>
            )}
            <div className=" flex flex-col justify-center items-center">
              <h2 className="text-semi bold mb-2 text-center">
                {" "}
                PDF Certificate
              </h2>
              <iframe
                src={previewPDF}
                className="w-full h-[450px]"
                title="PDF Preview"
                onLoad={() => setLoadingImage(false)}
              ></iframe>
            </div>
            <div className="w-full flex justify-end">
              <button className="btn" onClick={() => setPreviewPDF(null)}>
                Close
              </button>
            </div>
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
