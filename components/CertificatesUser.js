"use client";
import useAuthentication from "@/hooks/useAuthentication";
import React, { useState, useEffect } from "react";
import { Spinner } from "@chakra-ui/react";

const CertificatesUser = ({ user_id }) => {
  const { user } = useAuthentication();
  const [certificates, setCertificates] = useState([]);
  const [loadingCertificates, setLoadingCertificates] = useState(true);
  const [errorCertificates, setErrorCertificates] = useState(null);
  const [tags, setTags] = useState([]);
  const [loadingTags, setLoadingTags] = useState(true);
  const [errorTags, setErrorTags] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [loadingImage, setLoadingImage] = useState(false);

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

  useEffect(() => {
    if (user?.user_id) {
      fetchCertificates();
      fetchTags();
    }
  }, [user?.user_id]);

  const handlePreview = (filePath) => {
    setLoadingImage(true);
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
        <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-75 flex items-center justify-center ">
          <div className="bg-white">
            {loadingImage && ( // Tampilkan animasi loading jika loadingImage bernilai true
              <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                {/* <Spinner size="xl" /> */}
                <div class="border-t-4 border-blue-500 rounded-full w-12 h-12 animate-spin"></div>
              </div>
            )}
            <img
              src={previewImage}
              alt="Certificate Preview"
              className="w-full"
              onLoad={() => setLoadingImage(false)}
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
