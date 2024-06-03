"use client";
import React from "react";
import Link from "next/link";
import useAuthentication from "../hooks/useAuthentication";
import Image from "next/image";

const UserNavbar = () => {
  const { logout } = useAuthentication();
  return (
    <nav className="px-4 bg-white items-center shadow-md">
      <div className="">
        <div className=" flex justify-between ">
          <div className=" flex items-center">
            <Image
              src="/primakara-logo.png"
              width={100}
              height={500}
              alt="Primakara logo"
            />
            <span className="font-bold text-lg ">TAK Primakara</span>
          </div>
          <div className="flex items-center gap-4  mr-4">
            <details className="dropdown">
              <summary></summary>
            </details>
            <Link href="/dashboard" className="flex-shrink-0 flex items-center">
              <span className="hover:bg-slate-200 py-2 rounded-md text-sm font-medium cursor-pointer">
                Dashboard
              </span>
            </Link>
            <Link
              href="/dashboard/certificates"
              className="flex-shrink-0 flex items-center"
            >
              <span className="hover:bg-slate-200 py-2 rounded-md text-sm font-medium cursor-pointer">
                Certificates
              </span>
            </Link>
            <Link
              href="/dashboard/upload-certificates"
              className="flex-shrink-0 flex items-center"
            >
              <span className="hover:bg-slate-200 py-2 rounded-md text-sm font-medium cursor-pointer">
                Upload Certificates
              </span>
            </Link>
            <span className="flex-shrink-0 flex items-center">
              <button
                onClick={logout}
                className="cursor-pointer hover:bg-slate-200 py-2 rounded-md text-sm font-medium"
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

export default UserNavbar;
