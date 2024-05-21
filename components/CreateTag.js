"use client";
import useAuthentication from "../hooks/useAuthentication";
import React, { useState, useEffect } from "react";

const CreateTag = () => {
  const { user } = useAuthentication();
  const [tagName, setTagName] = useState("");
  const [tagValue, setTagValue] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);
  const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost:2000/categories");
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }
      const data = await response.json();
      setCategories(data.categories || []);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleTagNameChange = (e) => {
    setTagName(e.target.value);
  };

  const handleTagValueChange = (e) => {
    setTagValue(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleSubmitTag = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:2000/tags", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: tagName,
          value: parseInt(tagValue), // Convert tag value to integer
          category_id: selectedCategory,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to create tag");
      }
      setTagName("");
      setTagValue("");
      setSelectedCategory("");
      setError(null);
      alert("Tag created successfully!");
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 pb-20">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-center">Create Tag</h2>

        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-center">Create Tag</h3>
          <form onSubmit={handleSubmitTag} className="space-y-4">
            <div>
              <label htmlFor="tagName" className="block text-gray-700">
                Tag Name:
              </label>
              <input
                type="text"
                id="tagName"
                value={tagName}
                onChange={handleTagNameChange}
                className="border border-gray-300 rounded px-4 py-2 w-full focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="tagValue" className="block text-gray-700">
                Tag Value:
              </label>
              <input
                type="number"
                id="tagValue"
                value={tagValue}
                onChange={handleTagValueChange}
                className="border border-gray-300 rounded px-4 py-2 w-full focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="category" className="block text-gray-700">
                Category:
              </label>
              <select
                id="category"
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="border border-gray-300 rounded px-4 py-2 w-full focus:outline-none focus:border-blue-500"
                required
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option
                    key={category.category_id}
                    value={category.category_id}
                  >
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white font-semibold px-4 py-2 rounded hover:bg-blue-700"
            >
              Create Tag
            </button>
          </form>
        </div>

        {error && <p className="text-red-500 mt-4">Error: {error}</p>}
      </div>
    </div>
  );
};

export default CreateTag;
