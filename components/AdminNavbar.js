"use client";
import React from "react";
import useAuthentication from "../hooks/useAuthentication";
import Link from "next/link";
import Image from "next/image";

const AdminNavbar = () => {
  const { logout } = useAuthentication();

  return (
    <nav className="lg:px-4 px-4 bg-white flex flex-wrap items-center  shadow-md">
      <div className="flex-1 flex justify-between items-center">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <Image
              src="/primakara-logo.png"
              width={100}
              height={500}
              alt="Picture of the author"
            />
            <span className="  font-bold text-lg">TAK Primakara</span>
          </div>

          <div className="flex ml-80 gap-4">
            <Link
              href="/dashboard-admin"
              className=" flex-shrink-0 flex items-center"
            >
              <span className="  hover:bg-slate-200  py-2 rounded-md text-sm font-medium cursor-pointer">
                Dashboard
              </span>
            </Link>
            <Link
              href="/dashboard-admin/mahasiswa-list"
              className=" flex-shrink-0 flex items-center"
            >
              <span className="  hover:bg-slate-200  py-2 rounded-md text-sm font-medium cursor-pointer">
                Student List
              </span>
            </Link>
            <Link
              href="/dashboard-admin/create-category"
              className=" flex-shrink-0 flex items-center"
            >
              <span className="  hover:bg-slate-200  py-2 rounded-md text-sm font-medium cursor-pointer">
                Create Category
              </span>
            </Link>
            <Link
              href="/dashboard-admin/create-tag"
              className="  flex-shrink-0 flex items-center"
            >
              <span className=" hover:bg-slate-200  py-2 rounded-md items-center text-sm font-medium cursor-pointer">
                Create Tag
              </span>
            </Link>

            <Link
              href="/dashboard-admin/upload-many"
              className=" flex flex-shrink-0 items-center"
            >
              <span className="  hover:bg-slate-200  py-2 rounded-md text-sm font-medium cursor-pointer">
                Upload Xlsx
              </span>
            </Link>
            <span className=" flex flex-shrink-0 items-center cursor-pointer   py-2 rounded-md text-sm font-medium">
              <button
                onClick={logout}
                className="hover:bg-slate-200 rounded-md font-medium py-2 text-sm"
              >
                Logout
              </button>
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
