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

  useEffect(() => {
    const fetchMahasiswa = async () => {
      try {
        const response = await fetch("http://localhost:2000/users/mahasiswa");
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

    fetchMahasiswa();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  const handleSearchNIM = (e) => {
    setSearchNIM(e.target.value);
  };

  const handleDetailClick = async (user) => {
    try {
      const response = await fetch(
        `http://localhost:2000/user/${user.user_id}/mahasiswa`
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

  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
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
                <button
                  onClick={() => handleDetailClick(user)}
                  className="bg-blue-500 text-white px-2 py-1 rounded-md"
                >
                  Detail
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
                <button
                  onClick={closeModal}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MahasiswaList;
