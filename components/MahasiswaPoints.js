import React, { useState, useEffect } from "react";
import useAuthentication from "../hooks/useAuthentication";
import { Progress } from "@/components/ui/progress";

import Spiner from "./ui/Loading";

const MahasiswaDashboard = () => {
  const { user } = useAuthentication();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [calculationComplete, setCalculationComplete] = useState(false);

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
        setCalculationComplete(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [userData]);

  if (loading || !calculationComplete) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <Spiner size="large" />
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
    <div className="">
      <div className=" bg-white p-8 rounded-xl shadow-lg max-w-lg mx-auto">
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
            <div className="text-center">
              {" "}
              {userData.totalPointsAll} points of 126
            </div>
            <div className="grid grid-cols-1 gap-4">
              {Object.entries(userData.totalPoints).map(
                ([category, { points, min_point }]) => (
                  <div
                    key={category}
                    className="bg-white p-4 rounded-lg shadow"
                  >
                    <h3 className="font-semibold ">{category}</h3>
                    <p className="">
                      Points: {points} / {min_point}
                    </p>
                    <div className="mt-4 bg-gray-300 rounded-md">
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
    </div>
  );
};

export default MahasiswaDashboard;
