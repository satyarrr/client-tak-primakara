"use client";
import React, { useState, useEffect } from "react";
import useAuthentication from "../hooks/useAuthentication";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Spiner from "@/components/ui/Loading";
import { cn } from "@/lib/utils";
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

const CreateActivity = () => {
  const { user } = useAuthentication();
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [activityName, setActivityName] = useState("");
  const [error, setError] = useState(null);
  const [openCategory, setOpenCategory] = useState(false);
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

  const handleActivityNameChange = (e) => {
    setActivityName(e.target.value);
  };

  const handleSubmitActivity = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/activities`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            category_id: selectedCategoryId,
            name: activityName,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to create activity");
      }
      setActivityName("");
      setError(null);
      alert("Activity created successfully!");
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
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <Spiner size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 pt-8">
      <div className="bg-white p-8 rounded-lg shadow-md w-[70%] mb-96">
        <h3 className="text-lg font-semibold mb-4 text-center">
          Create Activity
        </h3>
        <form onSubmit={handleSubmitActivity}>
          <div className="mb-4">
            <Popover open={openCategory} onOpenChange={setOpenCategory}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className="w-full justify-between"
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
            <Input
              type="text"
              id="activityName"
              value={activityName}
              placeholder="Input activity name"
              onChange={handleActivityNameChange}
              className="input input-bordered w-full mt-3"
              required
            />
          </div>

          <Button type="submit" className="btn-primary w-full">
            Create Activity
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreateActivity;
