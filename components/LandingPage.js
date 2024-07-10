import Link from "next/link";
import React from "react";
import Head from "next/head";
import Image from "next/image";

const LandingPage = () => {
  const apps = [
    { name: "TAK Primakara", href: "/login", imageSrc: "/logo.png" },
    { name: "Web 2", href: "/app2", imageSrc: "" },
    { name: "Web 3", href: "/app3", imageSrc: "" },
    { name: "Web 4", href: "/app4", imageSrc: "" },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-2">
      <Head>
        <title>My Portal</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-3xl font-bold mb-8">
          Welcome to Portal Hub Universitas Primakara
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4">
          {apps.map((app) => (
            <div key={app.name} className="card-container">
              <Link href={app.href}>
                <div className="card shadow-lg hover:shadow-xl transition-shadow duration-300 block rounded-lg overflow-hidden">
                  <div className="w-full h-48 relative overflow-hidden rounded-t-lg bg-gray-200 hover:bg-gray-300">
                    {app.imageSrc ? (
                      <Image
                        src={app.imageSrc}
                        alt={app.name}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-t-lg"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-300 animate-pulse"></div>
                    )}
                  </div>
                  <div className="p-4">
                    <h2 className="text-xl font-semibold">{app.name}</h2>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
