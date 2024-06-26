"use client";

import useAuthentication from "@/hooks/useAuthentication";
import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronsUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";

const MySwal = withReactContent(Swal);

const UploadComponent = () => {
  const { user } = useAuthentication();
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [tagId, setTagId] = useState("");
  const [categories, setCategories] = useState([]); // Initialize as empty array
  const [tags, setTags] = useState([]); // Initialize as empty array
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (categoryId) {
      fetchTags(categoryId);
    } else {
      setTags([]); // Reset tags when no category is selected
    }
  }, [categoryId]);

  const fetchCategories = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/categories`,
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Fetched categories:", data); // Debugging line

      setCategories(Array.isArray(data) ? data : []); // Ensure data is an array
    } catch (error) {
      console.error("Could not fetch categories:", error);
      setCategories([]); // Set to empty array on error
    }
  };

  const fetchTags = async (categoryId) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/categories/${categoryId}/tags`,
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Fetched tags:", data); // Debugging line
      setTags(Array.isArray(data) ? data : []); // Ensure data is an array
    } catch (error) {
      console.error("Could not fetch tags:", error);
      setTags([]); // Set to empty array on error
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== "application/pdf") {
        MySwal.fire({
          title: "Error!",
          text: "Only PDF files are allowed.",
          icon: "error",
          confirmButtonText: "OK",
          customClass: {
            confirmButton: "bg-red-500 text-white rounded px-4 py-2",
          },
          buttonsStyling: false,
        });
        fileInputRef.current.value = "";
        setFile(null);
      } else {
        setFile(selectedFile);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !title || !categoryId || !tagId) {
      alert("Please fill in all fields.");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("tag_id", tagId);
    formData.append("user_id", user?.user_id);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/upload`,
        {
          method: "POST",
          body: formData,
        },
      );

      if (response.ok) {
        const result = await response.json();
        console.log("File uploaded successfully:", result);

        MySwal.fire({
          title: "Success!",
          text: "File uploaded successfully!",
          icon: "success",
          confirmButtonText: "OK",
          customClass: {
            confirmButton: "bg-blue-500 text-white rounded px-4 py-2",
          },
          buttonsStyling: false,
        });

        setFile(null);
        setTitle("");
        setCategoryId("");
        setTagId("");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        const error = await response.json();
        console.error("Upload failed:", error);
        MySwal.fire({
          title: "Error!",
          text: "File upload failed. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
          customClass: {
            confirmButton: "bg-red-500 text-white rounded px-4 py-2",
          },
          buttonsStyling: false,
        });
      }
    } catch (error) {
      console.error("Upload error:", error);
      MySwal.fire({
        title: "Error!",
        text: "An error occurred. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
        customClass: {
          confirmButton: "bg-red-500 text-white rounded px-4 py-2",
        },
        buttonsStyling: false,
      });
    } finally {
      setUploading(false);
    }
  };

  if (user?.role !== "mahasiswa") {
    return (
      <div>
        <p>Sorry you don't have access to this page</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md mb-40"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">
          Upload Certificate
        </h2>

        <div className="flex flex-col space-y-4">
          <Input
            type="text"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Input your title for certificate"
            className="input input-bordered w-full"
            required
          />

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className="w-full justify-between"
              >
                {categoryId
                  ? categories.find(
                      (category) => category.category_id === categoryId,
                    )?.name
                  : "Select category..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full justify-start p-0">
              <Command>
                <CommandInput placeholder="Search framework..." />
                <CommandList>
                  <CommandEmpty>No category found.</CommandEmpty>
                  <CommandGroup>
                    {categories?.map((category) => (
                      <CommandItem
                        key={category.category_id}
                        value={category.category_id}
                        onSelect={() => {
                          setCategoryId(category.category_id);
                        }}
                      >
                        {category.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          {/* <select
            name="categoryId"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="select select-bordered w-full"
            required
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.category_id} value={category.category_id}>
                {category.name}
              </option>
            ))}
          </select> */}
          <select
            name="tagId"
            value={tagId}
            onChange={(e) => setTagId(e.target.value)}
            className="select select-bordered w-full"
            required
          >
            <option value="">Select Tag</option>
            {tags.map((tag) => (
              <option key={tag.id} value={tag.id}>
                {tag.name}
              </option>
            ))}
          </select>
          <input
            type="file"
            name="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="file-input file-input-bordered w-full"
            required
          />
          <button
            type="submit"
            disabled={uploading}
            className={`btn ${
              uploading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {uploading ? "Uploading..." : "Upload File"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadComponent;
