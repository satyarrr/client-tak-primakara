import React, { useState, useEffect } from "react";
import { Input } from "./input";
import { Button } from "./button";

const Form = ({ type, item, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    is_visible: item ? item.is_visible : false, // atau true tergantung nilai default yang diinginkan
  });

  useEffect(() => {
    setFormData(item);
  }, [item]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const val = type === "checkbox" ? e.target.checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {type === "category" && (
        <>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Name:
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </label>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Minimum Points:
              <Input
                type="number"
                name="min_point"
                value={formData.min_point}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </label>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Visibility:
              <select
                name="is_visible"
                value={formData.is_visible}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value={true}>Show</option>
                <option value={false}>Archived</option>
              </select>
            </label>
          </div>
        </>
      )}
      {type === "activity" && (
        <>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Name:
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </label>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Visibility:
              <select
                name="is_visible"
                value={formData.is_visible}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value={true}>Show</option>
                <option value={false}>Archived</option>
              </select>
            </label>
          </div>
        </>
      )}
      {type === "tag" && (
        <>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Name:
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </label>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Value:
              <input
                type="text"
                name="value"
                value={formData.value}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </label>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Visibility:
              <select
                name="is_visible"
                value={formData.is_visible}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value={true}>Show</option>
                <option value={false}>Arcived</option>
              </select>
            </label>
          </div>
        </>
      )}
      <div className="flex justify-end">
        <Button type="submit" className="btn btn-primary mr-2">
          Save
        </Button>
        <Button type="button" className="btn btn-warning" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default Form;
