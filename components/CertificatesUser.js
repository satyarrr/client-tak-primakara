"use client";

import useAuthentication from "../hooks/useAuthentication";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  BiSortAlt2,
  BiSortUp,
  BiSortDown,
  BiSolidTrashAlt,
  BiZoomIn,
} from "react-icons/bi";
import { BsEye } from "react-icons/bs";

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
  }, [certificates, sortConfig, tags, activities]);

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
        <span className="loading loading-ring loading-lg"></span>
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
              <th className="py-2 px-4 text-center">Kategori</th>
              <th
                className="py-2 px-4 text-center"
                onClick={() => requestSort("activity")}
              >
                Kegiatan{getSortIcon("activity")}
              </th>
              <th className="py-2 px-4 text-center">Sub Activitas</th>
              <th
                className="py-2 px-4 text-center cursor-pointer"
                onClick={() => requestSort("value")}
              >
                Poin{getSortIcon("value")}
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
                <td className="border border-gray-200 text-center flex gap-2 py-2">
                  <Button
                    className="btn ml-4"
                    onClick={() => handlePreview(certificate.file_path)}
                  >
                    <BsEye />
                  </Button>
                  <Button
                    className="btn"
                    onClick={() => handleOpenReasonModal(certificate.reason)}
                  >
                    <BiZoomIn />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
