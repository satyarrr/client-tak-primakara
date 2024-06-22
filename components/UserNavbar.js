"use client";
import React, { useState } from "react";
import Link from "next/link";
import useAuthentication from "../hooks/useAuthentication";
import Image from "next/image";

const UserNavbar = () => {
  const { logout } = useAuthentication();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="px-4 bg-white items-center shadow-md">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Image
              src="/primakara-logo.png"
              width={100}
              height={500}
              alt="Primakara logo"
              className="mr-2"
            />
            <span className="font-bold text-lg">TAK Primakara</span>
          </div>
          <div className="hidden md:flex space-x-4">
            <Link
              href="/dashboard"
              className="hover:bg-slate-200 py-2 rounded-md text-sm font-medium"
            >
              Dashboard
            </Link>
            <Link
              href="/dashboard/certificates"
              className="hover:bg-slate-200 py-2 rounded-md text-sm font-medium"
            >
              Certificates
            </Link>
            <Link
              href="/dashboard/upload-certificates"
              className="hover:bg-slate-200 py-2 rounded-md text-sm font-medium"
            >
              Upload Certificates
            </Link>
            <button
              onClick={logout}
              className="hover:bg-slate-200 py-2 rounded-md text-sm font-medium"
            >
              Logout
            </button>
          </div>
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-700"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </button>
          </div>
        </div>
        {isOpen && (
          <div className="md:hidden mt-2 space-y-2">
            <Link
              href="/dashboard"
              className="block hover:bg-slate-200 py-2 rounded-md text-sm font-medium"
            >
              Dashboard
            </Link>
            <Link
              href="/dashboard/certificates"
              className="block hover:bg-slate-200 py-2 rounded-md text-sm font-medium"
            >
              Certificates
            </Link>
            <Link
              href="/dashboard/upload-certificates"
              className="block hover:bg-slate-200 py-2 rounded-md text-sm font-medium"
            >
              Upload Certificates
            </Link>
            <button
              onClick={logout}
              className="block w-full text-left hover:bg-slate-200 py-2 rounded-md text-sm font-medium"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default UserNavbar;
