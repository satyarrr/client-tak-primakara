"use client";
import useAuthentication from "@/hooks/useAuthentication";
import React, { useState, useEffect } from "react";

const AdminCertificates = () => {
  const { user } = useAuthentication();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const response = await fetch(
          "http://localhost:2000/certificates/all-with-users"
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

    fetchCertificates();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      const response = await fetch(`http://localhost:2000/certificate/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }), // Send the status in the request body
      });
      if (!response.ok) {
        throw new Error("Failed to update certificate status");
      }
      // Refresh the certificates list after successful update
    } catch (error) {
      console.error("Error updating certificate status:", error.message);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (user?.role !== "admin") {
    return (
      <div>
        <p>Sorry you don't have access to this page</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Admin Certificates</h2>
      <ul>
        {certificates.map((certificate) => (
          <li key={certificate.cert_id}>
            <p>Title: {certificate.title}</p>
            <p>Status: {certificate.status}</p>
            <p>User ID: {certificate.user_id}</p>
            <p>User Name: {certificate.user.full_name}</p>
            <p>User NIM: {certificate.user.nim}</p>
            <button
              onClick={() => handleStatusChange(certificate.cert_id, "approve")}
            >
              Approve
            </button>
            <button
              onClick={() => handleStatusChange(certificate.cert_id, "reject")}
            >
              Reject
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminCertificates;
