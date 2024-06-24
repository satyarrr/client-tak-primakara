import Link from "next/link";
import React from "react";
import Head from "next/head";
import Image from "next/image";

const LandingPage = () => {
  const apps = [
    { name: "TAK Primakara", href: "/login", imageSrc: "/tak-primakara.png" },
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
        <a className="text-3xl font-bold mb-8">
          Welcome to Portal Hub Universitas Primakara
        </a>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
          {apps.map((app) => (
            <Link href={app.href} key={app.name} passHref>
              <div className="card shadow-lg hover:shadow-xl transition-shadow duration-300">
                <figure className="w-full h-48 relative">
                  {app.imageSrc ? (
                    <Image
                      src={app.imageSrc}
                      alt={app.name}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-t-lg"
                    />
                  ) : (
                    <div className="w-full h-full skeleton"></div>
                  )}
                </figure>
                <div className="card-body">
                  <h2 className="card-title">{app.name}</h2>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
