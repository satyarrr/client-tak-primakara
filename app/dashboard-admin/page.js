import DashboardAdmin from "@/components/DashboardAdmin";
import AdminCertificates from "../../components/AdminCertificates";
import AdminNavbar from "../../components/AdminNavbar";

import React from "react";

const page = () => {
  return (
    <>
      <AdminNavbar />
      <div className=" m-4 ">
        <DashboardAdmin />
      </div>
    </>
  );
};

export default page;
