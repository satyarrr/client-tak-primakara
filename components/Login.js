"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const Login = () => {
  const [nim, setNim] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nim, password }),
      });

      if (!response.ok) {
        throw new Error("Failed to login");
      }

      const data = await response.json();
      // console.log("data login", data);
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("token", data.token);

      router.push(data.redirect);
    } catch (error) {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-400 p-4 md:p-0">
      <div className="max-w-screen-lg w-full md:w-9/12 flex flex-col md:flex-row justify-center overflow-hidden rounded-lg bg-white shadow-lg">
        {/* Bagian kiri (gambar) */}
        <div className="relative hidden md:block w-full md:w-1/2">
          <img
            src="https://primakara.ac.id/assets/primakara-university-building.a6543dc5.jpg" // Ganti dengan path gambar Anda
            alt="Image"
            className="h-full w-full object-cover brightness-90"
          />
          <span className="absolute bottom-20 underline decoration-lime-400 left-4 text-white">
            Selamat datang
          </span>
          <span className="absolute bottom-10 left-4 text-white font-bold">
            Sistem Informasi Manajemen TAK
          </span>
          <span className="absolute text-white bottom-3 left-4 font-bold text-2xl">
            Universitas Primakara
          </span>
        </div>
        {/* Bagian kanan (form login) */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12">
          <form className="w-full" onSubmit={handleSubmit}>
            <h2 className="text-2xl font-bold mb-8 text-center">Login</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="mb-4">
              <label
                htmlFor="nim"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                NIM
              </label>
              <input
                type="text"
                id="nim"
                className="input input-bordered w-full"
                placeholder="Enter your NIM"
                value={nim}
                onChange={(e) => setNim(e.target.value)}
                required
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                className="input input-bordered w-full"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex items-center justify-between">
              <button type="submit" className="btn w-full">
                Sign In
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
