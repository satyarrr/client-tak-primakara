import React from "react";
import CertificatesUser from "../../../components/CertificatesUser";
import UserNavbar from "../../../components/UserNavbar";
const page = () => {
  return (
    <div>
      <UserNavbar />
      <div className="m-4">
        <CertificatesUser />
      </div>
    </div>
  );
};

export default page;
