"use client";
import React from "react";
import useAuthentication from "../hooks/useAuthentication";
import Link from "next/link";
import Image from "next/image";

const AdminNavbar = () => {
  const { logout } = useAuthentication();

  return (
    <nav className=" px-4 bg-white items-center  shadow-md">
      <div className="">
        <div className="flex justify-between h-16">
          <div className=" flex items-center">
            <Image
              src="/primakara-logo.png"
              width={100}
              height={500}
              alt="Picture of the author"
            />
            <span className="font-bold text-lg">TAK Primakara</span>
          </div>

          <div className=" flex mr-16 mt-4">
            <details className=" dropdown ">
              <summary className="cursor-pointer hover:bg-slate-200  py-2 rounded-md text-sm font-medium">
                Menu
              </summary>
              <div className="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52">
                <Link href="/dashboard-admin" className=" flex items-center">
                  <span className="  hover:bg-slate-200  py-2 rounded-md text-sm font-medium cursor-pointer">
                    Dashboard
                  </span>
                </Link>
                <Link
                  href="/dashboard-admin/mahasiswa-list"
                  className=" flex items-center"
                >
                  <span className="  hover:bg-slate-200  py-2 rounded-md text-sm font-medium cursor-pointer">
                    Student List
                  </span>
                </Link>
                <Link
                  className="flex items-center"
                  href="/dashboard-admin/create-category"
                >
                  <span className="  hover:bg-slate-200  py-2 rounded-md text-sm font-medium cursor-pointer">
                    Create Category
                  </span>
                </Link>
                <Link
                  href="/dashboard-admin/create-tag"
                  className=" flex items-center"
                >
                  <span className=" hover:bg-slate-200  py-2 rounded-md items-center text-sm font-medium cursor-pointer">
                    Create Tag
                  </span>
                </Link>
                <Link
                  href="/dashboard-admin/create-activity"
                  className=" flex  items-center"
                >
                  <span className="  hover:bg-slate-200  py-2 rounded-md text-sm font-medium cursor-pointer">
                    Create Activity
                  </span>
                </Link>
                <Link
                  href="/dashboard-admin/upload-many"
                  className=" flex  items-center"
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
            </details>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
