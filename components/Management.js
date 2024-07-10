"use client";
import React, { useEffect, useState } from "react";
import Modal from "./ui/modal";
import Form from "./ui/form";
import { Button } from "./ui/button";

const Management = () => {
  const [data, setData] = useState([]);
  const [modal, setModal] = useState({ open: false, type: "", item: null });
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeActivity, setActiveActivity] = useState(null);

  const toggleCategory = (categoryId) => {
    setActiveCategory(activeCategory === categoryId ? null : categoryId);
  };

  const toggleActivity = (activityId) => {
    setActiveActivity(activeActivity === activityId ? null : activityId);
  };

  const fetchData = async () => {
    // Fetch data from the API
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/management`
      );
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    // Fetch data when component mounts
    fetchData();
  }, []);

  const handleModalOpen = (type, item) => {
    setModal({ open: true, type, item });
  };

  const handleModalClose = () => {
    setModal({ open: false, type: "", item: null });
  };

  const handleEdit = async (type, item) => {
    const endpoint =
      type === "category"
        ? `/category/${item.id}`
        : type === "activity"
        ? `/activity/${item.id}`
        : `/tag/${item.id}`;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(item),
      }
    );

    if (response.ok) {
      const updatedData = await response.json();
      // Update data locally
      setData((prevData) => {
        if (type === "category") {
          return prevData.map(
            (cat) => (cat.id === item.id ? updatedData : cat) // Access updatedData correctly
          );
        } else if (type === "activity") {
          return prevData.map((cat) => ({
            ...cat,
            activities: cat.activities.map(
              (act) => (act.id === item.id ? updatedData : act) // Access updatedData correctly
            ),
          }));
        } else if (type === "tag") {
          return prevData.map((cat) => ({
            ...cat,
            activities: cat.activities.map((act) => ({
              ...act,
              tags: act.tags.map(
                (tag) => (tag.id === item.id ? updatedData : tag) // Access updatedData correctly
              ),
            })),
          }));
        }
      });

      handleModalClose();
      fetchData(); // Fetch data again after editing
    } else {
      console.error("Error editing", type);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {data.map((category) => (
        <div key={category.id} className="mb-6">
          <div className="flex justify-between items-center bg-white p-4 rounded shadow">
            <h2 className="text-xl font-semibold">{category.name}</h2>
            <div>
              <Button
                className="btn-secondary mr-2"
                onClick={() => handleModalOpen("category", category)}
              >
                Edit
              </Button>
              <Button
                className="btn-secondary"
                onClick={() => toggleCategory(category.id)}
              >
                {activeCategory === category.id ? "Hide" : "Show"}
              </Button>
            </div>
          </div>
          {activeCategory === category.id && (
            <div className="mt-2 bg-white p-4 rounded shadow">
              <p className="mb-2">Minimum Points: {category.min_point}</p>
              <ul className="list-disc ml-5">
                {category.activities.map((activity) => (
                  <li key={activity.id} className="mb-2">
                    <div className="flex justify-between items-center">
                      <p>{activity.name}</p>
                      <div>
                        <Button
                          className="btn-secondary mr-2"
                          onClick={() => handleModalOpen("activity", activity)}
                        >
                          Edit
                        </Button>
                        <Button
                          className="btn-secondary"
                          onClick={() => toggleActivity(activity.id)}
                        >
                          {activeActivity === activity.id ? "Hide" : "Show"}
                        </Button>
                      </div>
                    </div>
                    {activeActivity === activity.id && (
                      <ul className="list-disc ml-5 mt-2 bg-gray-50 p-4 rounded">
                        {activity.tags.map((tag) => (
                          <li key={tag.id} className="mb-2">
                            <div className="flex justify-between items-center">
                              <p>
                                {tag.name} - {tag.value}
                              </p>
                              <div>
                                <Button
                                  className="btn-secondary mr-2"
                                  onClick={() => handleModalOpen("tag", tag)}
                                >
                                  Edit
                                </Button>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}

      {modal.open && (
        <Modal onClose={handleModalClose}>
          <Form
            type={modal.type}
            item={modal.item}
            onSave={(updatedItem) => handleEdit(modal.type, updatedItem)}
            onClose={handleModalClose}
          />
        </Modal>
      )}
    </div>
  );
};

export default Management;
