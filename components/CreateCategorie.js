"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useAuthentication from "../hooks/useAuthentication";

const CreateCategorie = () => {
  const { user } = useAuthentication();
  const [categoryName, setCategoryName] = useState("");
  const [minPoint, setMinPoint] = useState(""); // State for min_point
  const [error, setError] = useState(null);

  const handleCategoryNameChange = (e) => {
    setCategoryName(e.target.value);
  };

  const handleMinPointChange = (e) => {
    setMinPoint(e.target.value);
  };

  const handleSubmitCategory = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/categories`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: categoryName,
            min_point: minPoint, // Include min_point in the request body
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to create category");
      }
      setCategoryName("");
      setMinPoint(""); // Clear minPoint after successful submission
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
            <Input
              type="text"
              id="categoryName"
              value={categoryName}
              placeholder="Input category name"
              onChange={handleCategoryNameChange}
              className="input input-bordered w-full mt-3"
              required
            />
          </div>

          <div className="mb-4">
            <Input
              type="number" // Assuming min_point is numeric, adjust type as needed
              id="minPoint"
              value={minPoint}
              placeholder="Input minimum points"
              onChange={handleMinPointChange}
              className="input input-bordered w-full mt-3"
              required
            />
          </div>

          <Button type="submit" className="btn w-full">
            Create Category
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreateCategorie;
