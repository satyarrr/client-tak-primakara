import AdminCertificates from "../../components/AdminCertificates";
import AdminNavbar from "../../components/AdminNavbar";

import React from "react";

const page = () => {
  return (
    <>
      <AdminNavbar />
      <div className=" m-4 ">
        <AdminCertificates />
      </div>
    </>
  );
};

export default page;
