"use client";
import React, { useState, useEffect, useRef } from "react";
import { useDropzone } from "react-dropzone";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronsUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import useAuthentication from "@/hooks/useAuthentication";
import Spiner from "./ui/Loading";

const MySwal = withReactContent(Swal);

const FileUpload = () => {
  const { user } = useAuthentication();
  const [title, setTitle] = useState("");
  const [activityDate, setActivityDate] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [tagId, setTagId] = useState("");
  const [activityId, setActivityId] = useState("");
  const [categories, setCategories] = useState([]);
  const [activities, setActivities] = useState([]);
  const [tags, setTags] = useState([]);
  const [excelFile, setExcelFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [openCategory, setOpenCategory] = useState(false);
  const [openActivity, setOpenActivity] = useState(false);
  const [openTag, setOpenTag] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingActivities, setLoadingActivities] = useState(false);
  const [loadingTags, setLoadingTags] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (categoryId) {
      fetchActivities(categoryId);
    } else {
      setActivities([]);
    }
  }, [categoryId]);

  useEffect(() => {
    if (activityId) {
      fetchTags(activityId);
    } else {
      setTags([]);
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
      const visibleCategories = data.filter((category) => category.is_visible);
      setCategories(visibleCategories);
    } catch (error) {
      console.error("Could not fetch categories:", error);
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
      const visibleActivities = data.filter((activity) => activity.is_visible);
      setActivities(visibleActivities);
    } catch (error) {
      console.error("Could not fetch activities:", error);
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
      const visibleTags = data.filter((tag) => tag.is_visible);
      setTags(visibleTags);
    } catch (error) {
      console.error("Could not fetch tags:", error);
    } finally {
      setLoadingTags(false);
    }
  };

  const onDropExcel = (acceptedFiles) => {
    setExcelFile(acceptedFiles[0]);
  };

  const onDropPdf = (acceptedFiles) => {
    setPdfFile(acceptedFiles[0]);
  };

  const {
    getRootProps: getExcelRootProps,
    getInputProps: getExcelInputProps,
    isDragActive: isExcelDragActive,
  } = useDropzone({ onDrop: onDropExcel, accept: ".xlsx,.xls" });

  const {
    getRootProps: getPdfRootProps,
    getInputProps: getPdfInputProps,
    isDragActive: isPdfDragActive,
  } = useDropzone({ onDrop: onDropPdf, accept: "application/pdf" });

  const handleSubmit = async () => {
    if (!excelFile || !pdfFile || !title || !categoryId || !tagId) {
      setMessage("Please fill in all fields and upload both files.");
      return;
    }

    setUploading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("file", excelFile);
      formData.append("image", pdfFile);
      formData.append("title", title);
      formData.append("tag_id", tagId);
      formData.append("activity_date", activityDate);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        const data = await response.json();
        setMessage("Files uploaded successfully");
        console.log("Files uploaded successfully:", data);
      } else {
        const errorData = await response.json();
        setMessage("Error uploading files");
        console.error("Error uploading files:", errorData);
      }
    } catch (error) {
      setMessage("Error uploading files");
      console.error("Error uploading files:", error.message);
    } finally {
      setUploading(false);
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-[70%] mt-5 mb-52">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Upload Excel File and PDF
        </h2>
        {/* <p>
          upload exel format .xlsx and make sure field containing nim and
          full_name
        </p> */}

        <Input
          type="text"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Input your title for certificate"
          className="input input-bordered w-full mb-4"
          required
        />

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal mb-4",
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
              className="w-full justify-between mb-4"
            >
              {categoryId ? (
                categories.find((category) => category.id === categoryId)?.name
              ) : loadingCategories ? (
                <Spiner />
              ) : (
                "Select category..."
              )}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full justify-start p-0">
            <Command>
              <CommandInput placeholder="Search category..." />
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
              className="w-full justify-between mb-4"
              disabled={!categoryId}
            >
              {activityId ? (
                activities.find((activity) => activity.id === activityId)?.name
              ) : loadingActivities ? (
                <Spiner />
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

        <Popover open={openTag} onOpenChange={setOpenTag}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className="w-full justify-between mb-4"
              disabled={!activityId}
            >
              {tagId ? (
                tags.find((tag) => tag.id === tagId)?.name
              ) : loadingTags ? (
                <Spiner />
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
                <CommandEmpty>No sub activity found.</CommandEmpty>
                <CommandGroup>
                  {tags?.map((tag) => (
                    <CommandItem
                      key={tag.id}
                      value={tag.id}
                      onSelect={() => {
                        setTagId(tag.id);
                        setOpenTag(false);
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

        <div
          {...getExcelRootProps()}
          className={`border-dashed border-2 p-4 mb-4 text-center ${
            isExcelDragActive ? "border-blue-500" : "border-gray-300"
          }`}
        >
          <input {...getExcelInputProps()} />
          {excelFile ? (
            <p>{excelFile.name}</p>
          ) : (
            <p>Drag 'n' drop an Excel file here, or click to select one</p>
          )}
        </div>

        <div
          {...getPdfRootProps()}
          className={`border-dashed border-2 p-4 mb-4 text-center ${
            isPdfDragActive ? "border-blue-500" : "border-gray-300"
          }`}
        >
          <Input {...getPdfInputProps()} />
          {pdfFile ? (
            <p>{pdfFile.name}</p>
          ) : (
            <p>Drag 'n' drop a PDF file here, or click to select one</p>
          )}
        </div>

        {message && <p className="mb-4 text-red-500">{message}</p>}

        <Button
          type="button"
          onClick={handleSubmit}
          disabled={uploading}
          className={`btn-primary w-full ${uploading ? "opacity-50" : ""}`}
        >
          {uploading ? "Uploading..." : "Upload Files"}
        </Button>
      </div>
    </div>
  );
};

export default FileUpload;
