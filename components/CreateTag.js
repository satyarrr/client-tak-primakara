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
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/categories`
      );
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tags`, {
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
          <form onSubmit={handleSubmitTag} className="space-y-4">
            <div>
              <input
                type="text"
                id="tagName"
                value={tagName}
                placeholder="input tag name"
                onChange={handleTagNameChange}
                className="input input-bordered w-full"
                required
              />
            </div>
            <div>
              <input
                type="number"
                id="tagValue"
                value={tagValue}
                placeholder="input value point for tag"
                onChange={handleTagValueChange}
                className="input input-bordered w-full"
                required
              />
            </div>
            <div>
              <select
                id="category"
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="select select-bordered w-full"
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
            <button type="submit" className="btn w-full">
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
