"use client";

import { useRouter } from "next/navigation";
const { useState, useEffect } = require("react");

const useAuthentication = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);

  async function fetchUser(token) {
    try {
      const response = await fetch("http://localhost:2000/user", {
        headers: { Authorization: `Bearer ${token}` },
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user");
      }

      const data = await response.json();
      setUser(data.user);
    } catch (error) {
      console.log("Failed to fetch user");
      router.push("/login");
    }
  }

  const logout = async () => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/login");
  };

  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     const token = localStorage.getItem("token");
  //     fetchUser(token);
  //   }
  // }, []);

  return { user, fetchUser, logout };
};

export default useAuthentication;
