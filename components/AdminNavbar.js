"use client";
import React from "react";
import useAuthentication from "@/hooks/useAuthentication";

const AdminNavbar = () => {
  const { logout } = useAuthentication();
  return (
    <nav className="bg-teal-400 opacity-70 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <span className="text-white font-bold text-lg">Tak Primakara</span>
          </div>

          <div className="flex">
            <a
              href="dashboard-admin/create-categorie"
              className="text-white hover:bg-teal-500 px-3 py-2 rounded-md text-sm font-medium"
            >
              Create Category
            </a>
            <a
              href="dashboard-admin/create-tag"
              className="text-white hover:bg-teal-500 px-3 py-2 rounded-md text-sm font-medium"
            >
              Create Tag
            </a>
            <a
              href="dashboard-admin/mahasiswa-list"
              className="text-white hover:bg-teal-500 px-3 py-2 rounded-md text-sm font-medium"
            >
              Student List
            </a>
            <a
              onClick={logout}
              className="text-white cursor-pointer hover:bg-teal-500 px-3 py-2 rounded-md text-sm font-medium"
            >
              Logout
            </a>
            <a
              href="dashboard-admin"
              className="text-white hover:bg-teal-500 px-3 py-2 rounded-md text-sm font-medium"
            >
              Dashboard
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
