"use client";
import CertificatesUser from "@/components/CertificatesUser";
import MahasiswaPoints from "@/components/MahasiswaPoints";
import UploadComponent from "@/components/UploadComponent";
import React from "react";
import useAuthentication from "@/hooks/useAuthentication";

const page = () => {
  const { logout } = useAuthentication();

  return (
    <div>
      <button onClick={logout}>logout</button>
      <MahasiswaPoints />
      <UploadComponent />
      <CertificatesUser />
    </div>
  );
};

export default page;
