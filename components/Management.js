// pages/management.js
"use client";

import { useEffect, useState } from "react";

const Management = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/management`
        ); // Adjust API route as needed
        const data = await response.json();
        setData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleEdit = (activityId) => {
    // Implement edit functionality
    console.log("Edit activity with ID:", activityId);
  };

  const handleDelete = (activityId) => {
    // Implement delete functionality
    console.log("Delete activity with ID:", activityId);
  };

  return (
    <div>
      <h1>Management Page</h1>
      {data.map((category) => (
        <div key={category.id}>
          <h2>{category.name}</h2>
          <p>Minimum Points: {category.min}</p>
          <ul>
            {category.activities.map((activity) => (
              <li key={activity.id}>
                <p>{activity.name}</p>
                <ul>
                  {activity.tags.map((tag) => (
                    <li key={tag.id}>
                      <p>
                        {tag.name} - {tag.value}
                      </p>
                    </li>
                  ))}
                </ul>
                <button onClick={() => handleEdit(activity.id)}>Edit</button>
                <button onClick={() => handleDelete(activity.id)}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default Management;
