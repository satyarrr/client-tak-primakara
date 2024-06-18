"use client";
import useAuthentication from "../hooks/useAuthentication";
import React, { useState, useEffect } from "react";

const CertificatesUser = () => {
  const { user } = useAuthentication();
  const [certificates, setCertificates] = useState([]);
  const [loadingCertificates, setLoadingCertificates] = useState(true);
  const [errorCertificates, setErrorCertificates] = useState(null);
  const [tags, setTags] = useState([]);
  const [loadingTags, setLoadingTags] = useState(true);
  const [errorTags, setErrorTags] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [previewPDF, setPreviewPDF] = useState(null);
  const [loadingImage, setLoadingImage] = useState(false);
  const [certificateReason, setCertificateReason] = useState(null);
  const [showReasonModal, setShowReasonModal] = useState(false);

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
      fetchTags();
    }
  }, [user?.user_id]);

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

  const handleOpenReasonModal = (reasonPath) => {
    setCertificateReason(reasonPath);
    setShowReasonModal(true);
  };

  if (user?.role !== "mahasiswa") {
    return (
      <div>
        <p>Sorry you don't have access to this page</p>
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
              <th className="py-2 px-4 text-center">Title</th>
              <th className="py-2 px-4 text-center">Status</th>
              <th className="py-2 px-4 text-center">Tag Name</th>
              <th className="py-2 px-4 text-center">Poin TAK</th>
              <th className="py-2 px-4 text-center">Action</th>
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
                  {/* Finding tag for the certificate */}
                  {tags
                    .filter((tag) => tag.id === certificate.tag_id)
                    .map((tag) => tag.name)
                    .join(", ")}
                </td>
                <td className="py-2 px-4 border border-gray-200 text-center">
                  {/* Finding tag value for the certificate */}
                  {tags
                    .filter((tag) => tag.id === certificate.tag_id)
                    .map((tag) => tag.value)
                    .join(", ")}
                </td>
                <td className="border border-gray-200 text-center flex gap-2 py-2">
                  <button
                    className="btn ml-4"
                    onClick={() => handlePreview(certificate.file_path)}
                  >
                    Preview
                  </button>
                  <button
                    className="btn"
                    onClick={() => handleOpenReasonModal(certificate.reason)}
                  >
                    Detail
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {previewImage && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-200/75 flex items-center justify-center">
          <div className="bg-slate-50 items-center p-5 w-[500px] justify-center  rounded-lg ">
            {loadingImage && (
              <div className="flex items-center justify-center h-screen bg-slate-50">
                <span className="loading loading-ring loading-lg"></span>
              </div>
            )}

            <div className=" flex flex-col justify-center items-center">
              {loadingImage && (
                <div className="flex items-center justify-center h-screen bg-slate-50">
                  <span className="loading loading-ring loading-lg"></span>
                </div>
              )}
              <h2 className="font-semibold mb-2 text-center">
                Image Certificate
              </h2>
              <img
                src={previewImage}
                alt="Certificate Preview"
                className="object-cover w-60"
                onLoad={() => setLoadingImage(false)}
              />
            </div>
            <div className=" w-full flex justify-end">
              <button className="btn" onClick={() => setPreviewImage(null)}>
                close
              </button>
            </div>
          </div>
        </div>
      )}

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
      {showReasonModal && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-75 flex items-center justify-center ">
          <div className="bg-white p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Certificate Reason</h2>
            <p className="overflow-auto max-h-80 m-5 ">{certificateReason}</p>
            <button className="btn" onClick={() => setShowReasonModal(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CertificatesUser;
