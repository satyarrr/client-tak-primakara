"use client";
import React from "react";
import { useState } from "react";
import useAuthentication from "../hooks/useAuthentication";

const CreateCategorie = () => {
  const { user } = useAuthentication();
  const [categoryName, setCategoryName] = useState("");
  const [error, setError] = useState(null);
  const handleCategoryNameChange = (e) => {
    setCategoryName(e.target.value);
  };
  const handleSubmitCategory = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:2000/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: categoryName,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to create category");
      }
      setCategoryName("");
      setError(null);
      alert("Category created successfully!");
    } catch (error) {
      setError(error.message);
    }
  };

  if (user?.role !== "admin") {
    return (
      <div>
        <p>Sorry you don't have access to this page</p>
      </div>
    );
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 pt-8">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md mb-96">
        <h3 className="text-lg font-semibold mb-4 text-center">
          Create Category
        </h3>
        <form onSubmit={handleSubmitCategory}>
          <div className="mb-4">
            <label htmlFor="categoryName" className="block text-gray-700">
              Category Name:
            </label>
            <input
              type="text"
              id="categoryName"
              value={categoryName}
              onChange={handleCategoryNameChange}
              className="border border-gray-300 rounded px-4 py-2 w-full focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white font-semibold px-4 py-2 rounded hover:bg-blue-700"
          >
            Create Category
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateCategorie;
