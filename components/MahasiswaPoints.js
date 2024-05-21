"use client";
import useAuthentication from "../hooks/useAuthentication";
import React, { useState, useEffect } from "react";

const MahasiswaPoints = () => {
  const { user } = useAuthentication();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserData = async () => {
    try {
      const response = await fetch(
        `http://localhost:2000/user/${user?.user_id}/mahasiswa`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
      const data = await response.json();
      setUserData(data.user);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.user_id) {
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, [user?.user_id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (user?.role !== "mahasiswa") {
    return (
      <div>
        <p>Sorry you don't have access to this page</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg max-w-lg mx-auto">
      {userData && (
        <div>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Jumlah TAK Mahasiswa
          </h2>
          <p className="text-lg text-gray-700 mb-2">{userData.full_name}</p>
          <p className="text-lg text-gray-700 mb-2">NIM: {userData.nim}</p>
          <h2 className="text-xl font-semibold mb-3 text-gray-800">
            Total Points
          </h2>
          <ul className="list-disc list-inside">
            {Object.entries(userData.totalPoints).map(([category, points]) => (
              <li key={category} className="mb-2 text-gray-700">
                <span className="font-semibold">{category}:</span> {points}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MahasiswaPoints;
