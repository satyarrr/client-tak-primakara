import React from "react";
import UploadComponents from "../../../components/UploadComponent";
import UserNavbar from "../../../components/UserNavbar";
const page = () => {
  return (
    <div>
      <UserNavbar />
      <div className="m-4">
        <UploadComponents />
      </div>
    </div>
  );
};

export default page;
