"use client";
import React, { useState, useEffect } from "react";
import Spiner from "./ui/Loading";
import Link from "next/link";
import Button from "@/components/ui/button";
const DashboardAdmin = () => {
  const [certificates, setCertificates] = useState([]);
  const [avgCertificates, setAvgCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoryAverages, setCategoryAverages] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      await fetchCertificates();
      await fetchCertificatesAverage();
      setLoading(false);
    };
    fetchData();
  }, []);

  const fetchCertificatesAverage = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/certificates/approved-categories`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch certificates");
      }
      const data = await response.json();
      setCategoryAverages(data.categoryCounts);
    } catch (error) {
      setError(error.message);
    }
  };

  const fetchCertificates = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/certificates/all-with-users`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch certificates");
      }
      const data = await response.json();
      setCertificates(data.certificates || []);
    } catch (error) {
      setError(error.message);
    }
  };

  const pendingCertificatesCount = certificates.filter(
    (certificate) => certificate.status === "pending"
  ).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <Spiner size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      {/* <h2 className="text-2xl font-bold mb-4 text-center">Admin Dashboard</h2> */}
      <div className="flex space-x-4">
        {/* Need Take Action Certificates */}
        <Link
          href="/dashboard-admin/approval-page"
          className="w-1/3 bg-white shadow-lg rounded-lg p-6 hover:bg-gray-100 flex items-center justify-center"
        >
          <div className="flex flex-col items-center">
            <div className="text-lg mb-2">
              <p>Need Take Actions Certificates:</p>
            </div>
            <div className="text-2xl font-bold">
              <p>{pendingCertificatesCount}</p>
            </div>
          </div>
        </Link>

        {/* Average Certificates */}
        <div className="w-2/3 bg-white shadow-lg rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">
            Total Certificates per Category
          </h3>
          <ul>
            {Object.entries(categoryAverages).map(([category, count]) => (
              <li key={category} className="flex justify-between">
                <span>{category}:</span>
                <span>{count}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;
