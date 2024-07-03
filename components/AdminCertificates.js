"use client";
import useAuthentication from "../hooks/useAuthentication";
import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { BiSortAlt2, BiSortUp, BiSortDown, BiZoomIn } from "react-icons/bi";

import Spiner from "@/utils/Loading";

const AdminCertificates = () => {
  const { user } = useAuthentication();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState([]);
  const [loadingImage, setLoadingImage] = useState(false);
  const [error, setError] = useState(null);
  const [previewPDF, setPreviewPDF] = useState(null);
  const [tags, setTags] = useState([]);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectCertId, setRejectCertId] = useState(null);
  const [sortColumn, setSortColumn] = useState("activity_date"); // Default sort column
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    fetchCertificates();
    fetchTags();
    fetchActivities();
    console.log("Tags:", tags);
    console.log("Activities:", activities);
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/activities`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch activities");
      }
      const data = await response.json();
      setActivities(data || []);
    } catch (error) {
      console.error("Error fetching activities:", error.message);
    }
  };

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
    } else {
      setPreviewPDF(null);
      console.error("File format not supported");
    }
    setLoadingImage(false);
  };

  const getActivityName = (tagId) => {
    const tag = tags.find((tag) => tag.id === tagId);
    if (!tag) return "Unknown";
    const activity = activities.find(
      (activity) => activity.id === tag.activity_id
    );
    return activity ? activity.name : "Unknown";
  };
  const handleSort = (column) => {
    if (column === sortColumn) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("desc");
    }
  };

  const sortedCertificates = certificates.sort((a, b) => {
    const aValue = a[sortColumn];
    const bValue = b[sortColumn];

    if (sortOrder === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  if (loading || loadingImage) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <Spiner size="large" />
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="">
      <div className="py-8">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2">Activity</th>
              <th className="py-2">Sub Activity</th>
              <th className="py-2">Point</th>
              <th className="py-2" onClick={() => handleSort("time_stamp")}>
                Date Sent{" "}
                {sortColumn === "time_stamp" && (
                  <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
                )}
              </th>
              <th className="py-2" onClick={() => handleSort("time_stamp")}>
                Time Sent{" "}
                {sortColumn === "time_stamp" && (
                  <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
                )}
              </th>
              <th
                className="py-2 text-center flex flex-col justify-center items-center"
                onClick={() => handleSort("activity_date")}
              >
                {" "}
                Activity Date{" "}
                {sortColumn === "activity_date" && (
                  <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
                )}
              </th>
              <th className="py-2">Name</th>
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
                  {getActivityName(certificate.tag_id)}
                </td>
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
                <td className="border px-4 py-2">
                  {formatDate(certificate.activity_date)}
                </td>
                <td className="border px-4 py-2">
                  {certificate.user.full_name}
                </td>
                <td className="border px-4 py-2">{certificate.user.nim}</td>
                <td className="border px-4 py-2">
                  <div className="flex space-x-4">
                    <Button
                      onClick={() =>
                        handleStatusChange(certificate.cert_id, "approve")
                      }
                      className="btn-secondary"
                    >
                      Approve
                    </Button>
                    <Button
                      onClick={() => handleReject(certificate.cert_id)}
                      className="btn-warning"
                    >
                      Reject
                    </Button>
                    <Button
                      className="btn-primary"
                      onClick={() => handlePreview(certificate.file_path)}
                    >
                      Preview
                    </Button>
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
