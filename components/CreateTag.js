"use client";
import React, { useState, useEffect } from "react";
import useAuthentication from "../hooks/useAuthentication";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Spiner from "./ui/Loading";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { ChevronsUpDown } from "lucide-react";

const CreateTag = () => {
  const { user } = useAuthentication();
  const [categories, setCategories] = useState([]);
  const [activities, setActivities] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedActivityId, setSelectedActivityId] = useState("");
  const [tagValue, setTagValue] = useState("");
  const [tagName, setTagName] = useState("");
  const [error, setError] = useState(null);
  const [openCategory, setOpenCategory] = useState(false);
  const [openActivity, setOpenActivity] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
    setLoading(false);
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
      setCategories(data);
    } catch (error) {
      setError(error.message);
    }
  };
  useEffect(() => {
    if (selectedCategoryId) {
      const fetchActivities = async () => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/categories/${selectedCategoryId}/activities`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch activities");
          }
          const data = await response.json();
          setActivities(data);
        } catch (error) {
          setError(error.message);
        }
      };

      fetchActivities();
    } else {
      setActivities([]);
    }
  }, [selectedCategoryId]);

  const handleTagValueChange = (e) => {
    setTagValue(e.target.value);
  };

  const handleTagNameChange = (e) => {
    setTagName(e.target.value);
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
          category_id: selectedCategoryId,
          activity_id: selectedActivityId,
          value: tagValue,
          name: tagName,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to create tag");
      }
      setTagValue("");
      setTagName("");
      setError(null);
      alert("Tag created successfully!");
    } catch (error) {
      setError(error.message);
    }
  };
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <Spiner size="large" />
      </div>
    );
  }

  if (user?.role !== "admin") {
    return (
      <div>
        <p>Sorry you don't have access to this page</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 pt-8">
      <div className="bg-white p-8 rounded-lg shadow-md w-[70%] mb-96">
        <h3 className="text-lg font-semibold mb-4 text-center">
          Create Sub Activity
        </h3>
        <form onSubmit={handleSubmitTag}>
          <div className="mb-4">
            <Popover open={openCategory} onOpenChange={setOpenCategory}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className="w-full justify-between mt-3"
                >
                  {selectedCategoryId
                    ? categories.find(
                        (category) => category.id === selectedCategoryId
                      )?.name
                    : "Select category..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full justify-start p-0">
                <Command>
                  <CommandInput placeholder="Search categories..." />
                  <CommandList>
                    <CommandEmpty>No category found.</CommandEmpty>
                    <CommandGroup>
                      {categories.map((category) => (
                        <CommandItem
                          key={category.id}
                          value={category.id}
                          onSelect={() => {
                            setSelectedCategoryId(category.id);
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
          </div>

          <div className="mb-4">
            <Popover open={openActivity} onOpenChange={setOpenActivity}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className="w-full justify-between mt-3"
                >
                  {selectedActivityId
                    ? activities.find(
                        (activity) => activity.id === selectedActivityId
                      )?.name
                    : "Select activity..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full justify-start p-0">
                <Command>
                  <CommandInput placeholder="Search activities..." />
                  <CommandList>
                    <CommandEmpty>No activity found.</CommandEmpty>
                    <CommandGroup>
                      {activities.map((activity) => (
                        <CommandItem
                          key={activity.id}
                          value={activity.id}
                          onSelect={() => {
                            setSelectedActivityId(activity.id);
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
          </div>

          <div className="mb-4">
            <Input
              type="text"
              id="tagName"
              value={tagName}
              placeholder="Input sub activity name"
              onChange={handleTagNameChange}
              className="input input-bordered w-full mt-3"
              required
            />
          </div>
          <div className="mb-4">
            <Input
              type="number"
              id="tagValue"
              value={tagValue}
              placeholder="Input sub activity value"
              onChange={handleTagValueChange}
              className="input input-bordered w-full mt-3"
              required
            />
          </div>

          <Button type="submit" className="btn-primary w-full">
            Create Sub Activity
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreateTag;
