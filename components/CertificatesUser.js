"use client";
import useAuthentication from "@/hooks/useAuthentication";
import React, { useState, useEffect } from "react";
import ReactTooltip from "react-tooltip";

const CertificatesUser = ({ user_id }) => {
  const { user } = useAuthentication();
  const [certificates, setCertificates] = useState([]);
  const [loadingCertificates, setLoadingCertificates] = useState(true);
  const [errorCertificates, setErrorCertificates] = useState(null);
  const [tags, setTags] = useState([]);
  const [loadingTags, setLoadingTags] = useState(true);
  const [errorTags, setErrorTags] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [errorCategories, setErrorCategories] = useState(null);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [totalPoints, setTotalPoints] = useState({});
  const [totalPointsSum, setTotalPointsSum] = useState(0);

  const fetchCertificates = async () => {
    console.log("user", user);
    try {
      const response = await fetch(
        `http://localhost:2000/certificates/${user?.user_id}`
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

  const fetchTags = async () => {
    try {
      const response = await fetch(`http://localhost:2000/tags`);
      if (!response.ok) {
        throw new Error("Failed to fetch tags");
      }
      const data = await response.json();
      setTags(data || []); // Ensure tags data is set properly
      setLoadingTags(false);
    } catch (error) {
      setErrorTags(error.message);
      setLoadingTags(false);
    }
  };
  const fetchCategories = async () => {
    try {
      const response = await fetch(`http://localhost:2000/categories`);
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }
      const data = await response.json();
      setCategories(data.categories || []);
      setLoadingCategories(false);
    } catch (error) {
      setErrorCategories(error.message);
      setLoadingCategories(false);
    }
  };

  useEffect(() => {
    if (user?.user_id) {
      fetchCertificates();
      fetchTags();
      fetchCategories();
    }
  }, [user?.user_id]);

  useEffect(() => {
    if (certificates.length > 0 && tags.length > 0) {
      const certificatesByCategory = certificates.reduce((acc, certificate) => {
        const tag = tags.find((tag) => tag.id === certificate.tag_id);
        if (tag) {
          const category_id = tag.category_id;
          acc[category_id] = acc[category_id] || [];
          acc[category_id].push(certificate);
        }
        return acc;
      }, {});
      const categoryPoints = {};
      for (const category_id in certificatesByCategory) {
        const categoryCertificates = certificatesByCategory[category_id];
        const totalPointsForCategory = categoryCertificates.reduce(
          (total, certificate) => {
            const tag = tags.find((tag) => tag.id === certificate.tag_id);
            return total + (tag ? tag.value : 0);
          },
          0
        );
        categoryPoints[category_id] = totalPointsForCategory;
      }
      setTotalPoints(categoryPoints);

      // Calculate total points sum
      const sum = Object.values(categoryPoints).reduce(
        (acc, curr) => acc + curr,
        0
      );
      setTotalPointsSum(sum);
    }
  }, [certificates, tags]);

  const handlePreview = (filePath) => {
    setPreviewImage(filePath);
  };

  if (loadingCertificates || loadingTags) {
    return <p>Loading...</p>;
  }

  if (errorCertificates || errorTags) {
    return <p>Error: {errorCertificates || errorTags}</p>;
  }

  if (user.role !== "mahasiswa") {
    return (
      <div>
        <p>Sorry you don't have access to this page</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="mb-4 text-lg font-semibold">
        Certificates for User {user?.full_name}
      </h2>
      <div className="mb-4">
        <p className="font-semibold">Total Points: {totalPointsSum}</p>
      </div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Categories</h3>
        <div className="list-disc pl-6">
          {categories.map((category) => (
            <div key={category.category_id}>
              {category.name}: {totalPoints[category.category_id] || 0} points
            </div>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full bg-white border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 text-left">Title</th>
              <th className="py-2 px-4 text-left">Status</th>
              <th className="py-2 px-4 text-left">Tag Name</th>
              <th className="py-2 px-4 text-left">Poin TAK</th>
              <th className="py-2 px-4 text-left">Preview</th>
            </tr>
          </thead>
          <tbody>
            {certificates.map((certificate) => (
              <tr key={certificate.id}>
                <td className="py-2 px-4 border border-gray-200">
                  {certificate.title}
                </td>
                <td className="py-2 px-4 border border-gray-200 text-center">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center mx-1 justify-center ${
                      certificate.status === "reject"
                        ? "bg-red-500 "
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
                  {/* Finding tag for the certificate */}
                  {tags
                    .filter((tag) => tag.id === certificate.tag_id)
                    .map((tag) => tag.name)
                    .join(", ")}
                </td>
                <td className="py-2 px-4 border border-gray-200">
                  {/* Finding tag value for the certificate */}
                  {tags
                    .filter((tag) => tag.id === certificate.tag_id)
                    .map((tag) => tag.value)
                    .join(", ")}
                </td>
                <td className="py-2 px-4 border border-gray-200">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => handlePreview(certificate.file_path)}
                  >
                    Preview
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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

export default CertificatesUser;
