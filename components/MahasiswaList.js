"use client";
import React, { useState, useEffect } from "react";
import { Spinner } from "@chakra-ui/react";

const MahasiswaList = () => {
  const [mahasiswa, setMahasiswa] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchNIM, setSearchNIM] = useState("");

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

  const filteredMahasiswa = mahasiswa.filter((user) =>
    user.nim.toString().includes(searchNIM)
  );

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
            <th className="py-2 px-4">NIM</th>
            <th className="py-2 px-4">Total Poin TAK</th>
          </tr>
        </thead>
        <tbody>
          {filteredMahasiswa.map((user) => (
            <tr key={user.user_id} className="border-b border-gray-200">
              <td className="py-2 px-4">{user.full_name}</td>
              <td className="py-2 px-4">{user.nim}</td>
              <td className="py-2 px-4">{user.totalPoints}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MahasiswaList;
