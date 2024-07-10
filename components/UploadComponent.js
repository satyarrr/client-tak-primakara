"use client";

import useAuthentication from "@/hooks/useAuthentication";
import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import { format } from "date-fns";
import withReactContent from "sweetalert2-react-content";
import { Calendar as CalendarIcon } from "lucide-react";

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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronsUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import Spiner from "./ui/Loading";

const MySwal = withReactContent(Swal);

const UploadComponent = () => {
  const { user } = useAuthentication();
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [activityDate, setActivityDate] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [tagId, setTagId] = useState("");
  const [activityId, setActivityId] = useState("");
  const [categories, setCategories] = useState([]);
  const [activities, setActivities] = useState([]);
  const [tags, setTags] = useState([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const [openCategory, setOpenCategory] = useState(false);
  const [openSubActivity, setOpenSubActivity] = useState(false);
  const [openActivity, setOpenActivity] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false); // Loading state for categories
  const [loadingActivities, setLoadingActivities] = useState(false); // Loading state for activities
  const [loadingTags, setLoadingTags] = useState(false); // Loading state for tags

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (categoryId) {
      fetchActivities(categoryId);
    } else {
      setActivities([]); // Reset activities when no category is selected
    }
  }, [categoryId]);

  useEffect(() => {
    if (activityId) {
      fetchTags(activityId);
    } else {
      setTags([]); // Reset tags when no activity is selected
    }
  }, [activityId]);

  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/categories`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Fetched categories:", data); // Debugging line

      const visibleCategories = data.filter((category) => category.is_visible);
      setCategories(Array.isArray(visibleCategories) ? visibleCategories : []); // Ensure data is an array
    } catch (error) {
      console.error("Could not fetch categories:", error);
      setCategories([]); // Set to empty array on error
    } finally {
      setLoadingCategories(false);
    }
  };

  const fetchActivities = async (categoryId) => {
    setLoadingActivities(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/categories/${categoryId}/activities`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Fetched activities:", data); // Debugging line

      const visibleActivities = data.filter((activity) => activity.is_visible);
      setActivities(Array.isArray(visibleActivities) ? visibleActivities : []); // Ensure data is an array
    } catch (error) {
      console.error("Could not fetch activities:", error);
      setActivities([]); // Set to empty array on error
    } finally {
      setLoadingActivities(false);
    }
  };

  const fetchTags = async (activityId) => {
    setLoadingTags(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/activities/${activityId}/tags`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Fetched tags:", data); // Debugging line

      const visibleTags = data.filter((tag) => tag.is_visible);
      setTags(Array.isArray(visibleTags) ? visibleTags : []); // Ensure data is an array
    } catch (error) {
      console.error("Could not fetch tags:", error);
      setTags([]); // Set to empty array on error
    } finally {
      setLoadingTags(false);
    }
  };

  // const handleFileChange = (e) => {
  //   if (e.target.files && e.target.files.length > 0) {
  //     const selectedFile = e.target.files[0];
  //     if (selectedFile.type !== "application/pdf") {
  //       MySwal.fire({
  //         title: "Error!",
  //         text: "Only PDF files are allowed.",
  //         icon: "error",
  //         confirmButtonText: "OK",
  //         customClass: {
  //           confirmButton: "bg-red-500 text-white rounded px-4 py-2",
  //         },
  //         buttonsStyling: false,
  //       });
  //       fileInputRef.current.value = "";
  //       setFile(null);
  //     } else {
  //       setFile(selectedFile);
  //     }
  //   }
  // };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];

      // Check file type
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
        return;
      }

      // Check file size (in bytes)
      if (selectedFile.size > 2 * 1024 * 1024) {
        // 2MB limit
        MySwal.fire({
          title: "Error!",
          text: "File size should not exceed 2MB.",
          icon: "error",
          confirmButtonText: "OK",
          customClass: {
            confirmButton: "bg-red-500 text-white rounded px-4 py-2",
          },
          buttonsStyling: false,
        });
        fileInputRef.current.value = "";
        setFile(null);
        return;
      }

      // If all validations pass, set the file
      setFile(selectedFile);
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
    formData.append("activity_date", activityDate);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/upload`,
        {
          method: "POST",
          body: formData,
        }
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
        setActivityId("");
        setTagId("");
        setActivityDate("");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        // Handle specific error scenarios
        const errorData = await response.json();

        if (
          response.status === 400 &&
          errorData.message === "DuplicateCertificateError"
        ) {
          MySwal.fire({
            title: "Error!",
            text: "Please do not upload the same certificate.",
            icon: "error",
            confirmButtonText: "OK",
            customClass: {
              confirmButton: "bg-red-500 text-white rounded px-4 py-2",
            },
            buttonsStyling: false,
          });
        } else {
          console.error("Upload failed:", errorData);
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
        className="bg-white p-8 rounded-lg shadow-md w-[70%] mb-40"
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
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !activityDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {activityDate ? (
                  format(activityDate, "PPP")
                ) : (
                  <span>Date Activity</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={activityDate}
                onSelect={setActivityDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Popover open={openCategory} onOpenChange={setOpenCategory}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className="w-full justify-between"
              >
                {categoryId ? (
                  categories.find((category) => category.id === categoryId)
                    ?.name
                ) : loadingCategories ? (
                  <Spiner /> // Show spinner if categories are loading
                ) : (
                  "Select category..."
                )}
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
                        key={category.id}
                        value={category.id}
                        onSelect={() => {
                          setCategoryId(category.id);
                          setOpenCategory(false);
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

          <Popover open={openActivity} onOpenChange={setOpenActivity}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className="w-full justify-between"
                disabled={!categoryId}
              >
                {activityId ? (
                  activities.find((activity) => activity.id === activityId)
                    ?.name
                ) : loadingActivities ? (
                  <Spiner /> // Show spinner if activities are loading
                ) : (
                  "Select activity..."
                )}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full justify-start p-0">
              <Command>
                <CommandInput placeholder="Search activity..." />
                <CommandList>
                  <CommandEmpty>No activity found.</CommandEmpty>
                  <CommandGroup>
                    {activities?.map((activity) => (
                      <CommandItem
                        key={activity.id}
                        value={activity.id}
                        onSelect={() => {
                          setActivityId(activity.id);
                          setOpenActivity(false);
                        }}
                      >
                        {activity.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          <Popover open={openSubActivity} onOpenChange={setOpenSubActivity}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className="w-full justify-between"
                disabled={!activityId}
              >
                {tagId ? (
                  tags.find((tag) => tag.id === tagId)?.name
                ) : loadingTags ? (
                  <Spiner /> // Show spinner if tags are loading
                ) : (
                  "Select sub activity..."
                )}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full justify-start p-0">
              <Command>
                <CommandInput placeholder="Search sub activity..." />
                <CommandList>
                  <CommandEmpty>No Sub Activity Found</CommandEmpty>
                  <CommandGroup>
                    {tags?.map((tag) => (
                      <CommandItem
                        key={tag.id}
                        value={tag.id}
                        onSelect={() => {
                          setTagId(tag.id);
                          setOpenSubActivity(false);
                        }}
                      >
                        {tag.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          <Input
            type="file"
            name="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className=" w-full"
            required
          />
          <Button
            type="submit"
            disabled={uploading}
            className={`btn-primary  ${
              uploading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {uploading ? "Uploading..." : "Upload File"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UploadComponent;
