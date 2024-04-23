"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Home() {
  return (
    <div className="m-2 p-2">
      <h1 className=" text-center font-semibold text-2xl">Tak Primakara</h1>
      <div className=" text-center font-semibold font-2xl">
        Selamat Datang Tuan Satya 😎
      </div>
      test
    </div>
  );
}
