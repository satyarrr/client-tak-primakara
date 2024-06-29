import React, { useState, useEffect } from "react";
import useAuthentication from "../hooks/useAuthentication";
import { Progress } from "@/components/ui/progress";
import PulseLoader from "react-spinners/PulseLoader";
import { Puff } from "react-loader-spinner";

const MahasiswaDashboard = () => {
  const { user } = useAuthentication();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/user/${user.user_id}/mahasiswa`
        );
        if (!response.ok) throw new Error("Failed to fetch user data");
        const data = await response.json();
        setUserData(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    if (user?.user_id) fetchUserData();
    else setLoading(false);
  }, [user?.user_id]);

  useEffect(() => {
    if (userData) {
      const timer = setTimeout(() => {
        const totalPoints = Object.values(userData.totalPoints).reduce(
          (acc, { points }) => acc + points,
          0
        );
        const percentage = (totalPoints / userData.min_point) * 100;
        setProgress(Math.min(percentage, 100));
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [userData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <span className="flex items-center justify-center">
          <svg
            width="20"
            height="20"
            fill="currentColor"
            class="mr-2 animate-spin"
            viewBox="0 0 1792 1792"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M526 1394q0 53-37.5 90.5t-90.5 37.5q-52 0-90-38t-38-90q0-53 37.5-90.5t90.5-37.5 90.5 37.5 37.5 90.5zm498 206q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-704-704q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm1202 498q0 52-38 90t-90 38q-53 0-90.5-37.5t-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-964-996q0 66-47 113t-113 47-113-47-47-113 47-113 113-47 113 47 47 113zm1170 498q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-640-704q0 80-56 136t-136 56-136-56-56-136 56-136 136-56 136 56 56 136zm530 206q0 93-66 158.5t-158 65.5q-93 0-158.5-65.5t-65.5-158.5q0-92 65.5-158t158.5-66q92 0 158 66t66 158z"></path>
          </svg>
          loading
        </span>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!user || user.role !== "mahasiswa") {
    return (
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-lg mx-auto">
        <p>Sorry, you don't have access to this page.</p>
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
          <div className="grid grid-cols-1 gap-4">
            {Object.entries(userData.totalPoints).map(
              ([category, { points, min_point }]) => (
                <div
                  key={category}
                  className="bg-[#d9edf7] p-4 rounded-lg shadow"
                >
                  <h3 className="font-semibold ">{category}</h3>
                  <p className="">
                    Points: {points} / {min_point}
                  </p>
                  <div className="mt-4">
                    <Progress
                      className="[&>*]:bg-[#31708f] "
                      value={(points / min_point) * 100}
                    />
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MahasiswaDashboard;
