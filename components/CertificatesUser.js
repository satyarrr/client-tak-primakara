"use client";

import useAuthentication from "../hooks/useAuthentication";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { BiSortAlt2, BiSortUp, BiSortDown } from "react-icons/bi";
import Spiner from "@/components/ui/Loading"; // Ensure this import is correct

const CertificatesUser = () => {
  const { user } = useAuthentication();
  const [certificates, setCertificates] = useState([]);
  const [activities, setActivities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingCertificates, setLoadingCertificates] = useState(true);
  const [errorCertificates, setErrorCertificates] = useState(null);
  const [tags, setTags] = useState([]);
  const [loadingTags, setLoadingTags] = useState(true);
  const [errorTags, setErrorTags] = useState(null);
  const [previewPDF, setPreviewPDF] = useState(null);
  const [loadingImage, setLoadingImage] = useState(false);
  const [certificateReason, setCertificateReason] = useState(null);
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchCertificates = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/certificates/${user?.user_id}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch certificates");
      }
      const data = await response.json();
      setCertificates(data.certificates);
      setLoadingCertificates(false);
    } catch (error) {
      setErrorCertificates(error.message);
      setLoadingCertificates(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/categories`
      );
      if (!response.ok) {
        throw new Error("failed to fetch categories");
      }
      const data = await response.json();
      setCategories(data);
    } catch (error) {}
  };

  const fetchActivities = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/activities`
      );
      if (!response.ok) {
        throw new Error("failed to fetch activities");
      }
      const data = await response.json();
      setActivities(data);
    } catch (error) {
      console.log("error fetching activities", error);
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
      setLoadingTags(false);
    } catch (error) {
      setErrorTags(error.message);
      setLoadingTags(false);
    }
  };

  useEffect(() => {
    if (user?.user_id) {
      fetchCertificates();
      fetchCategories();
      fetchActivities();
      fetchTags();
    }
  }, [user?.user_id]);

  const handlePreview = (filePath) => {
    setLoadingImage(true);
    if (filePath.toLowerCase().endsWith(".pdf")) {
      setPreviewPDF(filePath);
    } else {
      setPreviewPDF(null);
      console.error("File format not supported");
    }
  };

  const handleOpenReasonModal = (reasonPath) => {
    setCertificateReason(reasonPath);
    setShowReasonModal(true);
  };

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedCertificates = React.useMemo(() => {
    let sortableCertificates = [...certificates];
    if (sortConfig.key) {
      sortableCertificates.sort((a, b) => {
        if (sortConfig.key === "value") {
          const aValue = parseFloat(
            tags.find((tag) => tag.id === a.tag_id)?.value || 0
          );
          const bValue = parseFloat(
            tags.find((tag) => tag.id === b.tag_id)?.value || 0
          );
          return sortConfig.direction === "ascending"
            ? aValue - bValue
            : bValue - aValue;
        } else if (sortConfig.key === "activity") {
          const aActivity =
            activities.find(
              (activity) =>
                activity.id ===
                tags.find((tag) => tag.id === a.tag_id)?.activity_id
            )?.name || "";
          const bActivity =
            activities.find(
              (activity) =>
                activity.id ===
                tags.find((tag) => tag.id === b.tag_id)?.activity_id
            )?.name || "";
          return sortConfig.direction === "ascending"
            ? aActivity.localeCompare(bActivity)
            : bActivity.localeCompare(aActivity);
        } else if (sortConfig.key === "category") {
          const aCategory =
            categories.find(
              (category) =>
                category.id ===
                activities.find(
                  (activity) =>
                    activity.id ===
                    tags.find((tag) => tag.id === a.tag_id)?.activity_id
                )?.category_id
            )?.name || "";
          const bCategory =
            categories.find(
              (category) =>
                category.id ===
                activities.find(
                  (activity) =>
                    activity.id ===
                    tags.find((tag) => tag.id === b.tag_id)?.activity_id
                )?.category_id
            )?.name || "";
          return sortConfig.direction === "ascending"
            ? aCategory.localeCompare(bCategory)
            : bCategory.localeCompare(aCategory);
        } else if (sortConfig.key === "subActivity") {
          const aSubActivity =
            tags.find((tag) => tag.id === a.tag_id)?.name || "";
          const bSubActivity =
            tags.find((tag) => tag.id === b.tag_id)?.name || "";
          return sortConfig.direction === "ascending"
            ? aSubActivity.localeCompare(bSubActivity)
            : bSubActivity.localeCompare(aSubActivity);
        } else if (sortConfig.key === "dateUpload") {
          return sortConfig.direction === "ascending"
            ? new Date(a.time_stamp) - new Date(b.time_stamp)
            : new Date(b.time_stamp) - new Date(a.time_stamp);
        } else if (sortConfig.key === "timeUpload") {
          return sortConfig.direction === "ascending"
            ? new Date(a.time_stamp).getTime() -
                new Date(b.time_stamp).getTime()
            : new Date(b.time_stamp).getTime() -
                new Date(a.time_stamp).getTime();
        } else if (sortConfig.key === "dateActivity") {
          return sortConfig.direction === "ascending"
            ? new Date(a.activity_date) - new Date(b.activity_date)
            : new Date(b.activity_date) - new Date(a.activity_date);
        } else {
          if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === "ascending" ? -1 : 1;
          }
          if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === "ascending" ? 1 : -1;
          }
          return 0;
        }
      });
    }
    return sortableCertificates;
  }, [certificates, sortConfig, tags, activities, categories]);

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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentCertificates = sortedCertificates.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const totalPages = Math.ceil(sortedCertificates.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (user?.role !== "mahasiswa") {
    return (
      <div>
        <p>Sorry, you don't have access to this page</p>
      </div>
    );
  }

  if (errorCertificates || errorTags) {
    return <p>Error: {errorCertificates || errorTags}</p>;
  }

  if (loadingCertificates || loadingTags) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <Spiner size="large" />
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="overflow-x-auto">
        <table className="w-full bg-white border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th
                className="py-2 px-4 text-center cursor-pointer"
                onClick={() => requestSort("title")}
              >
                Title {getSortIcon("title")}
              </th>
              <th
                className="py-2 px-4 text-center cursor-pointer"
                onClick={() => requestSort("status")}
              >
                Status {getSortIcon("status")}
              </th>
              <th
                className="py-2 px-4 text-center cursor-pointer"
                onClick={() => requestSort("category")}
              >
                Category {getSortIcon("category")}
              </th>
              <th
                className="py-2 px-4 text-center cursor-pointer"
                onClick={() => requestSort("activity")}
              >
                Activity {getSortIcon("activity")}
              </th>
              <th
                className="py-2 px-4 text-center cursor-pointer"
                onClick={() => requestSort("subActivity")}
              >
                Sub Activity {getSortIcon("subActivity")}
              </th>
              <th
                className="py-2 px-4 text-center cursor-pointer"
                onClick={() => requestSort("value")}
              >
                Poin {getSortIcon("value")}
              </th>
              <th
                className="py-2 px-4 text-center cursor-pointer"
                onClick={() => requestSort("dateUpload")}
              >
                Date Upload {getSortIcon("dateUpload")}
              </th>
              <th
                className="py-2 px-4 text-center cursor-pointer"
                onClick={() => requestSort("timeUpload")}
              >
                Time Upload {getSortIcon("timeUpload")}
              </th>
              <th
                className="py-2 px-4 text-center cursor-pointer"
                onClick={() => requestSort("dateActivity")}
              >
                Date Activity {getSortIcon("dateActivity")}
              </th>
              <th className="py-2 px-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {sortedCertificates.map((certificate) => (
              <tr key={certificate.id}>
                <td className="py-2 px-4 border border-gray-200">
                  {certificate.title}
                </td>
                <td className="py-2 px-4 border border-gray-200 text-center">
                  <div
                    className={`w-5 h-5 rounded-full mx-auto flex items-center justify-center tooltip ${
                      certificate.status === "reject"
                        ? "bg-red-500"
                        : certificate.status === "pending"
                        ? "bg-yellow-500"
                        : "bg-green-500"
                    }`}
                    data-tip={
                      certificate.status === "reject"
                        ? "Rejected"
                        : certificate.status === "pending"
                        ? "Pending"
                        : "Approved"
                    }
                  ></div>
                </td>
                <td className="py-2 px-4 border border-gray-200">
                  {activities
                    .filter((activity) => {
                      const tag = tags.find(
                        (tag) => tag.id === certificate.tag_id
                      );
                      return tag && activity.id === tag.activity_id;
                    })
                    .map((activity) => {
                      const category = categories.find(
                        (category) => category.id === activity.category_id
                      );
                      return category ? category.name : "Unknown Category";
                    })
                    .join(", ")}
                </td>
                <td className="py-2 px-4 border border-gray-200">
                  {activities
                    .filter((activity) => {
                      const tag = tags.find(
                        (tag) => tag.id === certificate.tag_id
                      );
                      return tag && activity.id === tag.activity_id;
                    })
                    .map((activity) => activity.name)
                    .join(", ")}
                </td>
                <td className="py-2 px-4 border border-gray-200">
                  {tags
                    .filter((tag) => tag.id === certificate.tag_id)
                    .map((tag) => tag.name)
                    .join(", ")}
                </td>
                <td className="py-2 px-4 border border-gray-200 text-center">
                  {tags
                    .filter((tag) => tag.id === certificate.tag_id)
                    .map((tag) => tag.value)
                    .join(", ")}
                </td>
                <td className="py-2 px-4 border border-gray-200 text-center">
                  {new Date(certificate.time_stamp).toLocaleDateString(
                    "en-GB",
                    {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    }
                  )}
                </td>
                <td className="py-2 px-4 border border-gray-200 text-center">
                  {new Date(certificate.time_stamp).toLocaleTimeString(
                    "en-US",
                    { hour: "2-digit", minute: "2-digit", hour12: false }
                  )}
                </td>
                <td className="py-2 px-4 border border-gray-200 text-center">
                  {formatDate(certificate.activity_date)}
                </td>
                <td className="border border-gray-200 text-center flex gap-2 py-2">
                  <Button
                    className="btn-primary"
                    onClick={() => handlePreview(certificate.file_path)}
                  >
                    Preview
                  </Button>
                  <Button
                    className="btn-primary"
                    onClick={() => handleOpenReasonModal(certificate.reason)}
                  >
                    Detail
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center items-center mt-4">
        <Button
          className={`btn-primary  ${
            currentPage === 1 ? "disabled:opacity-50" : ""
          }`}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <span className="mx-2">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          className={`btn-primary ${
            currentPage === totalPages ? "disabled:opacity-50" : ""
          }`}
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>

      {previewPDF && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-200/75 flex items-center justify-center ">
          <div className="bg-white items-center p-5 w-[500] justify-center rounded-lg">
            {loadingImage && (
              <div className="flex items-center justify-center h-screen bg-slate-50">
                <span className="loading loading-ring loading-lg"></span>
              </div>
            )}
            <div className="flex flex-col justify-center items-center">
              <h2 className="text-semi bold mb-2 text-center">
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
              <Button className="btn" onClick={() => setPreviewPDF(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
      {showReasonModal && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-75 flex items-center justify-center ">
          <div className="bg-white p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Certificate Reason</h2>
            <p className="overflow-auto max-h-80 m-5">{certificateReason}</p>
            <Button className="btn" onClick={() => setShowReasonModal(false)}>
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CertificatesUser;
