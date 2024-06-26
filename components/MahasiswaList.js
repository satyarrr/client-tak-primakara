"use client";
import React, { useState, useEffect } from "react";
import useAuthentication from "../hooks/useAuthentication";

const MahasiswaList = () => {
  const { user } = useAuthentication();
  const [mahasiswa, setMahasiswa] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchNIM, setSearchNIM] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModalCertificates, setShowModalCertificates] = useState(false);
  const [certificates, setCertificates] = useState([]);
  const [tags, setTags] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [previewPDF, setPreviewPDF] = useState(null);
  const [loadingImage, setLoadingImage] = useState(false);
  const [certificateReason, setCertificateReason] = useState(null);
  const [showReasonModal, setShowReasonModal] = useState(false);

  const fetchMahasiswa = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/mahasiswa`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      setMahasiswa(data);
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
      setError(error.message);
    }
  };
  const fetchCertificates = async (userId) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/certificates/${userId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch certificates data");
      }
      const data = await response.json();
      return data.certificates;
    } catch (error) {
      console.error("Error fetching certificates data:", error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMahasiswa();
    fetchTags();
  }, []);

  const handleSearchNIM = (e) => {
    setSearchNIM(e.target.value);
  };

  const handleDetailClick = async (user) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/${user.user_id}/mahasiswa`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch points data");
      }
      const data = await response.json();
      setSelectedUser({ ...user, totalPoints: data.user.totalPoints });
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching points data:", error.message);
      // Handle the error appropriately, such as showing a message to the user
    }
  };

  const handleCertificatesClick = async (user) => {
    try {
      const certificates = await fetchCertificates(user.user_id);
      setCertificates(certificates);
      setSelectedUser(user);
      setShowModalCertificates(true);
    } catch (error) {
      console.error("Error handling certificates click:", error.message);
    }
  };

  const handleDeleteCertificate = async (certificateId, userId) => {
    setLoading(true);
    try {
      console.log(`Deleting certificate with ID: ${certificateId}`);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/certificates/${certificateId}`,
        { method: "DELETE" }
      );
      if (!response.ok) {
        throw new Error("Failed to delete certificate");
      }
      console.log("Certificate deleted successfully");
      // Remove the deleted certificate from the local state
      setCertificates((prevCertificates) => {
        const updatedCertificates = prevCertificates.filter(
          (cert) => cert.cert_id !== certificateId
        );
        console.log(
          "Updated certificates after deletion:",
          updatedCertificates
        );
        return updatedCertificates;
      });
      alert("Certificate deleted");
    } catch (error) {
      console.error("Error deleting certificate:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  const closeModalCertificates = () => {
    setShowModalCertificates(false);
    setSelectedUser(null);
    setPreviewImage(null);
    setPreviewPDF(null);
    setShowReasonModal(false);
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
    {
      setLoading(false);
    }
  };

  const handleOpenReasonModal = (reasonPath) => {
    setCertificateReason(reasonPath);
    setShowReasonModal(true);
  };

  const filteredMahasiswa = mahasiswa.filter((user) =>
    user.nim.toString().includes(searchNIM)
  );
  if (user?.role !== "admin") {
    return (
      <div>
        <p>Sorry you don't have access to this page</p>
      </div>
    );
  }
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

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-2xl font-bold mb-4">Daftar Mahasiswa</h2>
      <input
        type="text"
        placeholder="Cari berdasarkan NIM..."
        value={searchNIM}
        onChange={handleSearchNIM}
        className="p-2 border border-gray-300 rounded-md mb-4"
      />
      <table className="w-full">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4">Nama</th>
            <th className="py-2 px-4 text-center">NIM</th>
            <th className="py-2 px-4 text-center">Total Poin TAK</th>
            <th className="py-2 px-4 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {filteredMahasiswa.map((user) => (
            <tr key={user.user_id} className="border-b border-gray-200">
              <td className="py-2 px-4">{user.full_name}</td>
              <td className="py-2 px-4 text-center">{user.nim}</td>
              <td className="py-2 px-4 text-center">{user.totalPoints}</td>
              <td className="py-2 px-4 text-center">
                <button onClick={() => handleDetailClick(user)} className="btn">
                  Detail
                </button>
                <button
                  onClick={() => handleCertificatesClick(user)}
                  className="btn ml-2"
                >
                  Certificates
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && selectedUser && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">
                      Detail Poin
                    </h3>
                    {/* Render points data here */}
                    <ul className="list-disc list-inside">
                      {Object.entries(selectedUser.totalPoints).map(
                        ([category, points]) => (
                          <li key={category} className="mb-2 text-gray-700">
                            <span className="font-semibold">{category}:</span>{" "}
                            {points}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button onClick={closeModal} className="btn">
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showModalCertificates && selectedUser && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">
                      Certificates
                    </h3>
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
                            <tr key={certificate.cert_id}>
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
                                {tags
                                  .filter(
                                    (tag) => tag.id === certificate.tag_id
                                  )
                                  .map((tag) => tag.name)
                                  .join(", ")}
                              </td>
                              <td className="py-2 px-4 border border-gray-200 text-center">
                                {tags
                                  .filter(
                                    (tag) => tag.id === certificate.tag_id
                                  )
                                  .map((tag) => tag.value)
                                  .join(", ")}
                              </td>
                              <td className="border border-gray-200 text-center flex gap-2 py-2">
                                <button
                                  className="btn ml-4"
                                  onClick={() =>
                                    handlePreview(certificate.file_path)
                                  }
                                >
                                  Preview
                                </button>
                                <button
                                  className="btn"
                                  onClick={() =>
                                    handleOpenReasonModal(certificate.reason)
                                  }
                                >
                                  Detail
                                </button>
                                <button
                                  className="btn ml-2"
                                  onClick={() =>
                                    handleDeleteCertificate(
                                      certificate.cert_id,
                                      user.user_id
                                    )
                                  }
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button onClick={closeModalCertificates} className="btn">
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {previewPDF && (
        <div className=" z-50 fixed top-0 left-0 w-full h-full bg-gray-200/75 flex items-center justify-center ">
          <div className="bg-white items-center p-5 w-[500] justify-center rounded-lg">
            <div className=" flex flex-col justify-center items-center">
              <h2 className="text-semi bold mb-2 text-center">
                PDF Certificate
              </h2>
              <iframe
                src={previewPDF}
                className="w-full h-[450px]"
                title="PDF Preview"
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
        <div className=" z-50 fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-75 flex items-center justify-center ">
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

export default MahasiswaList;
