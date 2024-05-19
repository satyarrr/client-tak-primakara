"use client";
import React from "react";

const CreateCategorie = () => {
  const [categoryName, setCategoryName] = useState("");
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
  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Create Category</h3>
      <form onSubmit={handleSubmitCategory}>
        <div className="mb-4">
          <label htmlFor="categoryName" className="block">
            Category Name:
          </label>
          <input
            type="text"
            id="categoryName"
            value={categoryName}
            onChange={handleCategoryNameChange}
            className="border border-gray-300 rounded px-4 py-2 w-full"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white font-semibold px-4 py-2 rounded"
        >
          Create Category
        </button>
      </form>
    </div>
  );
};

export default CreateCategorie;
