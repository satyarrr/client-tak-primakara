"use client";

import MahasiswaPoints from "../../components/MahasiswaPoints";

import UserNavbar from "../../components/UserNavbar";
import React from "react";
import useAuthentication from "../../hooks/useAuthentication";

const page = () => {
  return (
    <div className="">
      <UserNavbar />
      <div className=" m-4">
        <MahasiswaPoints />
      </div>
    </div>
  );
};

export default page;
