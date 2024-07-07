"use client";
import useAuthentication from "../hooks/useAuthentication";
import React, { useState, useEffect, useMemo } from "react";
import { Button } from "./ui/button";
import Spiner from "@/components/ui/Loading";
import { BiSortAlt2, BiSortUp, BiSortDown } from "react-icons/bi";

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
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [searchNIM, setSearchNIM] = useState("");
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    fetchCertificates();
    fetchTags();
    fetchActivities();
    fetchCategories();
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

  const fetchCategories = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/categories`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }
      const data = await response.json();
      setCategories(data || []);
    } catch (error) {
      console.error("Error fetching categories:", error.message);
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
          body: JSON.stringify({ status: "approve" }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update certificate status");
      }
      alert("Approve");
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

  const getCategoryName = (tagId) => {
    const tag = tags.find((tag) => tag.id === tagId);

    if (!tag) return "Unknown";

    const activity = activities.find(
      (activity) => activity.id === tag.activity_id
    );
    if (!activity) return "Unknown";
    const category = categories.find(
      (category) => category.id === activity.category_id
    );
    if (!category) return "Unknown";
    return category.name;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "ascending" ? (
        <BiSortUp />
      ) : (
        <BiSortDown />
      );
    }
    return <BiSortAlt2 />;
  };

  const sortedCertificates = useMemo(() => {
    let sortableCertificates = [...certificates];
    if (sortConfig.key) {
      sortableCertificates.sort((a, b) => {
        if (sortConfig.key === "activity_date") {
          return sortConfig.direction === "ascending"
            ? new Date(a.activity_date) - new Date(b.activity_date)
            : new Date(b.activity_date) - new Date(a.activity_date);
        } else if (sortConfig.key === "activity_id") {
          const aActivityName = getActivityName(a.tag_id);
          const bActivityName = getActivityName(b.tag_id);
          return sortConfig.direction === "ascending"
            ? aActivityName.localeCompare(bActivityName)
            : bActivityName.localeCompare(aActivityName);
        } else if (sortConfig.key === "timeUpload") {
          return sortConfig.direction === "ascending"
            ? new Date(a.time_stamp).getTime() -
                new Date(b.time_stamp).getTime()
            : new Date(b.time_stamp).getTime() -
                new Date(a.time_stamp).getTime();
        } else if (sortConfig.key === "tag_id") {
          const aTagName = getTagName(a.tag_id);
          const bTagName = getTagName(b.tag_id);
          return sortConfig.direction === "ascending"
            ? aTagName.localeCompare(bTagName)
            : bTagName.localeCompare(aTagName);
        } else if (sortConfig.key === "tag_value") {
          const aValue = parseFloat(getTagValue(a.tag_id));
          const bValue = parseFloat(getTagValue(b.tag_id));
          return sortConfig.direction === "ascending"
            ? aValue - bValue
            : bValue - aValue;
        } else if (sortConfig.key === "time_stamp") {
          return sortConfig.direction === "ascending"
            ? new Date(a.time_stamp) - new Date(b.time_stamp)
            : new Date(b.time_stamp) - new Date(a.time_stamp);
        } else if (sortConfig.key === "user_name") {
          return sortConfig.direction === "ascending"
            ? a.user.full_name.localeCompare(b.user.full_name)
            : b.user.full_name.localeCompare(a.user.full_name);
        } else if (sortConfig.key === "user_nim") {
          return sortConfig.direction === "ascending"
            ? parseInt(a.user.nim, 10) - parseInt(b.user.nim, 10)
            : parseInt(b.user.nim, 10) - parseInt(a.user.nim, 10);
        } else if (sortConfig.key === "category") {
          const aCategoryName = getCategoryName(a.tag_id);
          const bCategoryName = getCategoryName(b.tag_id);
          return sortConfig.direction === "ascending"
            ? aCategoryName.localeCompare(bCategoryName)
            : bCategoryName.localeCompare(aCategoryName);
        } else {
          return 0;
        }
      });
    }
    return sortableCertificates;
  }, [certificates, sortConfig, tags, activities]);

  const handleSearchChange = (event) => {
    setSearchNIM(event.target.value);
  };

  const filteredCertificates = useMemo(() => {
    let filtered = [...sortedCertificates];

    if (searchNIM.trim() !== "") {
      const searchNumber = parseInt(searchNIM.trim(), 10); // Convert searchNIM to number
      filtered = filtered.filter(
        (certificate) => certificate.user.nim === searchNumber
      );
    }

    return filtered;
  }, [sortedCertificates, searchNIM]);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentCertificates = filteredCertificates.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const totalPages = Math.ceil(filteredCertificates.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

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

  return (
    <div>
      <div className="py-8">
        <input
          type="number"
          placeholder="Search by NIM..."
          value={searchNIM}
          onChange={handleSearchChange}
          className="border border-gray-300 rounded-md py-2 px-4"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              <th className="th mx-2 sticky left-0 bg-white z-10 py-2">
                Actions
              </th>
              <th
                className="bg-white cursor-pointer th"
                onClick={() => requestSort("category")}
              >
                Category {getSortIcon("category")}
              </th>
              <th
                className="bg-white cursor-pointer th"
                onClick={() => requestSort("timeUpload")}
              >
                Time Upload {getSortIcon("timeUpload")}
              </th>
              <th
                className="bg-white cursor-pointer th"
                onClick={() => requestSort("activity_date")}
              >
                Activity Date {getSortIcon("activity_date")}
              </th>
              <th
                className="bg-white px-20 cursor-pointer th"
                onClick={() => requestSort("activity_id")}
              >
                Activity {getSortIcon("activity_id")}
              </th>
              <th
                className="bg-white px-10 cursor-pointer th"
                onClick={() => requestSort("tag_id")}
              >
                Sub Activity {getSortIcon("tag_id")}
              </th>
              <th
                className="bg-white cursor-pointer mx-2 th"
                onClick={() => requestSort("tag_value")}
              >
                Point {getSortIcon("tag_value")}
              </th>
              <th
                className="bg-white cursor-pointer th"
                onClick={() => requestSort("time_stamp")}
              >
                Date Sent {getSortIcon("time_stamp")}
              </th>
              <th
                className="bg-white px-20 cursor-pointer th"
                onClick={() => requestSort("user_name")}
              >
                Name {getSortIcon("user_name")}
              </th>
              <th
                className="bg-white cursor-pointer th"
                onClick={() => requestSort("user_nim")}
              >
                NIM {getSortIcon("user_nim")}
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredCertificates.map((certificate) => (
              <tr key={certificate.id}>
                <td className="td flex gap-2 sticky left-0 bg-white z-10">
                  <Button
                    className="btn-primary"
                    onClick={() => handlePreview(certificate.file_path)}
                  >
                    Preview
                  </Button>
                  <Button
                    className="btn-warning"
                    onClick={() => handleReject(certificate.cert_id)}
                  >
                    Reject
                  </Button>
                  {certificate.status === "pending" && (
                    <Button
                      className="btn-secondary"
                      onClick={() =>
                        handleStatusChange(certificate.cert_id, "approved")
                      }
                    >
                      Approve
                    </Button>
                  )}
                </td>
                <td className="td ">{getCategoryName(certificate.tag_id)}</td>
                <td className="td">
                  {new Date(certificate.time_stamp).toLocaleTimeString(
                    "en-US",
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    }
                  )}
                </td>
                <td className="td">{formatDate(certificate.activity_date)}</td>
                <td className="td">{getActivityName(certificate.tag_id)}</td>
                <td className="td">{getTagName(certificate.tag_id)}</td>
                <td className="td">{getTagValue(certificate.tag_id)}</td>
                <td className="td">{formatDate(certificate.time_stamp)}</td>
                <td className="td">{certificate.user.full_name}</td>
                <td className="td">{certificate.user.nim}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center mt-4">
        <nav aria-label="Page navigation">
          <ul className="inline-flex space-x-2">
            {Array.from({ length: totalPages }, (_, index) => (
              <li key={index}>
                <Button
                  className={`btn-primary ${
                    index + 1 === currentPage
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </Button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {showRejectModal && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>
            &#8203;
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Reject Certificate
                    </h3>
                    <div className="mt-2">
                      <textarea
                        onChange={(e) => setRejectReason(e.target.value)}
                        value={rejectReason}
                        className="w-full border border-gray-300 rounded-md p-2"
                        rows="3"
                        placeholder="Enter reject reason..."
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <Button
                  onClick={() => handleRejectSubmit(rejectCertId)}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Reject
                </Button>
                <Button
                  onClick={handleCloseRejectModal}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {previewPDF && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>
            &#8203;
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <iframe
                      title="Preview"
                      src={previewPDF}
                      className="w-full h-96"
                      frameBorder="0"
                    ></iframe>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <Button
                  onClick={() => setPreviewPDF(null)}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Close Preview
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCertificates;
