"use client";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import Spiner from "./ui/Loading";

const DashboardAdmin = () => {
  const [certificates, setCertificates] = useState([]);
  const [avgCertificates, setAvgCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoryAverages, setCategoryAverages] = useState({});

  useEffect(() => {
    fetchCertificates();
    fetchCertificatesAverage();
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
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
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
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
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
    return <p>Error: {error}</p>;
  }
  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Admin Dashboard</h2>
      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="flex justify-between items-center">
          <div className="text-lg">
            <p>Need Take Actions Certificates:</p>
          </div>
          <div className="text-3xl font-bold">
            <p>{pendingCertificatesCount}</p>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6 mt-4">
        <h3 className="text-xl font-bold mb-4">
          Average Certificates per Category
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
  );
};

export default DashboardAdmin;
