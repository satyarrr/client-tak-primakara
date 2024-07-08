"use client";
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Spiner from "@/components/ui/Loading";
import useAuthentication from "../hooks/useAuthentication";

const CreateCategorie = () => {
  const { user } = useAuthentication();
  const [categoryName, setCategoryName] = useState("");
  const [minPoint, setMinPoint] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleCategoryNameChange = (e) => {
    setCategoryName(e.target.value);
  };

  const handleMinPointChange = (e) => {
    setMinPoint(e.target.value);
  };

  const handleSubmitCategory = async (e) => {
    e.preventDefault();
    setLoading(true);
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
            min_point: minPoint,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to create category");
      }
      setCategoryName("");
      setMinPoint("");
      setError(null);
      alert("Category created successfully!");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== "admin") {
    return (
      <div>
        <p>Sorry you don't have access to this page</p>
      </div>
    );
  }
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <Spiner size="large" />
      </div>
    );
  }
  return (
    <div
      className={`min-h-screen flex items-center justify-center bg-gray-100 ${
        loading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="bg-white p-8 rounded-lg shadow-md w-[70%] mb-96">
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
              type="number"
              id="minPoint"
              value={minPoint}
              placeholder="Input minimum points"
              onChange={handleMinPointChange}
              className="input input-bordered w-full mt-3"
              required
            />
          </div>

          <Button
            type="submit"
            className="btn-primary w-full"
            disabled={loading}
          >
            {loading ? <Spiner /> : "Create Category"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreateCategorie;
