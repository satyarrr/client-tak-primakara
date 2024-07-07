"use client";
import React, { useState, useEffect } from "react";
import useAuthentication from "../hooks/useAuthentication";
import { Button } from "@/components/ui/button";
import ModalCertificates from "@/components/ui/ModalCertificates";
import Spiner from "./ui/Loading";

const MahasiswaList = () => {
  const { user } = useAuthentication();
  const [mahasiswa, setMahasiswa] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchNIM, setSearchNIM] = useState("");
  const [showModalCertificates, setShowModalCertificates] = useState(false);
  const [certificates, setCertificates] = useState([]);
  const [tags, setTags] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [previewPDF, setPreviewPDF] = useState(null);
  const [loadingImage, setLoadingImage] = useState(false);
  const [certificateReason, setCertificateReason] = useState(null);
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [showModalDetail, setShowModalDetail] = useState(false);
  const [modalDetailPoints, setModalDetailPoints] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const fetchMahasiswa = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/mahasiswa`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      const updatedMahasiswa = data.map((mhs) => ({
        ...mhs,
        totalPoints: mhs.totalPoints || 0,
        changeInPointxrsLastMonth: calculateChangeInPointsLastMonth(
          mhs.certificates
        ),
      }));
      setMahasiswa(updatedMahasiswa);
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
      console.log("Fetched data:", data);
      if (data.totalPoints) {
        setSelectedUser({ ...user, totalPoints: data.totalPoints });
        setShowModalDetail(true);
      } else {
        console.error("No totalPoints found in the response");
      }
    } catch (error) {
      console.error("Error fetching points data:", error.message);
    }
  };

  const handleCertificatesClick = async (user) => {
    try {
      const certificates = await fetchCertificates(user.user_id);
      setCertificates(certificates);
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
      setCertificates((prevCertificates) => {
        return prevCertificates.filter(
          (cert) => cert.cert_id !== certificateId
        );
      });
      alert("Certificate deleted");
    } catch (error) {
      console.error("Error deleting certificate:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const closeModalCertificates = () => {
    setShowModalCertificates(false);
    setPreviewImage(null);
    setPreviewPDF(null);
    setShowReasonModal(false);
  };

  const closeModalPreviewPDF = () => {
    setPreviewPDF(null);
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
    setLoadingImage(false);
  };

  const handleOpenReasonModal = (reasonPath) => {
    setCertificateReason(reasonPath);
    setShowReasonModal(true);
  };
  const calculateChangeInPointsLastMonth = (certificates = []) => {
    const today = new Date();
    const lastMonth = new Date(today);
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    const pointsLastMonth = certificates
      ? certificates
          .filter((cert) => new Date(cert.time_stamp) > lastMonth)
          .reduce((acc, cert) => {
            const tag = tags.find((tag) => tag.tag_id === cert.tag_id);
            return acc + (tag ? tag.value : 0);
          }, 0)
      : 0;

    return pointsLastMonth;
  };

  const filteredMahasiswa = mahasiswa.filter((user) =>
    user.nim.toString().includes(searchNIM)
  );

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentMahasiswa = filteredMahasiswa.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const totalPages = Math.ceil(filteredMahasiswa.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

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
        <Spiner />
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
            <th className="py-2 px-4">Name</th>
            <th className="py-2 px-4 text-center">NIM</th>
            <th className="py-2 px-4 text-center">Total Points</th>
            <th className="py-2 px-4 text-center">Points This Month</th>
            <th className="py-2 px-4 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredMahasiswa.map((user) => (
            <tr key={user.user_id} className="border-b border-gray-200">
              <td className="py-2 px-4">{user.full_name}</td>
              <td className="py-2 px-4 text-center">{user.nim}</td>
              <td className="py-2 px-4 text-center">{user.totalPoints}</td>
              <td className="py-2 px-4 text-center text-green-400">
                + {user.currentMonthPoints}
              </td>
              <td className="py-2 px-4 text-center">
                <Button
                  onClick={() => handleDetailClick(user)}
                  className="btn-primary"
                >
                  Detail
                </Button>
                <Button
                  onClick={() => handleCertificatesClick(user)}
                  className="btn-primary ml-2"
                >
                  Certificates
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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

      {showModalCertificates && (
        <ModalCertificates
          certificates={certificates}
          tags={tags}
          closeModalCertificates={closeModalCertificates}
          handlePreview={handlePreview}
          handleDeleteCertificate={handleDeleteCertificate}
          handleOpenReasonModal={handleOpenReasonModal}
        />
      )}

      {previewPDF && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="fixed inset-0 bg-black opacity-50"
            onClick={closeModalPreviewPDF}
          ></div>
          <div
            className="relative bg-white rounded-lg shadow-lg z-50 p-4"
            style={{ width: "80%", height: "80%" }}
          >
            <button
              className="absolute top-2 right-2 text-gray-600"
              onClick={closeModalPreviewPDF}
            >
              &times;
            </button>
            <embed
              src={previewPDF}
              type="application/pdf"
              width="100%"
              height="100%"
            />
          </div>
        </div>
      )}
      {showModalDetail && selectedUser && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-20 pb-20 text-center sm:block sm:p-0">
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
                      Detail Points
                    </h3>
                    <ul className="list-disc list-inside">
                      {Object.entries(selectedUser.totalPoints).map(
                        ([category, points]) => (
                          <li key={category} className="mb-2 text-gray-700">
                            <span className="font-semibold">{category}:</span>{" "}
                            {points.points}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={() => setShowModalDetail(false)}
                  className="btn"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showReasonModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="fixed inset-0 bg-black opacity-50"
            onClick={() => setShowReasonModal(false)}
          ></div>
          <div className="bg-white rounded-lg shadow-lg z-50 p-6">
            <h2 className="text-xl font-bold mb-4">Reason</h2>
            <p>{certificateReason}</p>
            <button
              className="btn mt-4"
              onClick={() => setShowReasonModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MahasiswaList;
