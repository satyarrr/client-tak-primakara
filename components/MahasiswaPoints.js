"use client";
import useAuthentication from "@/hooks/useAuthentication";
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
      console.log("user", user);
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

  return (
    <div className="bg-gray-200 p-6 rounded-lg">
      {userData && (
        <div>
          <h2 className="text-xl font-bold mb-4">Jumlah TAK mahasiswa</h2>
          <p className="mb-2">Hello {userData.full_name}</p>
          <p className="mb-2">NIM: {userData.nim}</p>
          <h2 className="text-xl font-bold mb-2">Total Points</h2>
          <ul>
            {Object.entries(userData.totalPoints).map(([category, points]) => (
              <li key={category} className="mb-1">
                <span className="font-bold">{category}:</span> {points}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MahasiswaPoints;
