"use client";
import React from "react";
import useAuthentication from "../hooks/useAuthentication";
import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";

import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";

const AdminNavbar = () => {
  const { logout } = useAuthentication();

  return (
    <nav className=" px-4 bg-white items-center  shadow-md">
      <div className="">
        <div className="flex justify-between h-16">
          <div className=" flex items-center">
            <Image
              priority={true}
              src="/primakara-logo.png"
              width={100}
              height={500}
              alt="Picture of the author"
            />
            <span className="font-bold text-lg">TAK Primakara</span>
          </div>

          <div className=" flex mr-4">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Management TAK</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <Link
                      href="/dashboard-admin/management"
                      legacyBehavior
                      passHref
                    >
                      <NavigationMenuLink
                        className={navigationMenuTriggerStyle()}
                      >
                        Management TAK
                      </NavigationMenuLink>
                    </Link>
                    <Link
                      href="/dashboard-admin/create-category"
                      legacyBehavior
                      passHref
                    >
                      <NavigationMenuLink
                        className={navigationMenuTriggerStyle()}
                      >
                        Create Category
                      </NavigationMenuLink>
                    </Link>
                    <Link
                      href="/dashboard-admin/create-activity"
                      legacyBehavior
                      passHref
                    >
                      <NavigationMenuLink
                        className={navigationMenuTriggerStyle()}
                      >
                        Create Activity
                      </NavigationMenuLink>
                    </Link>
                    <Link
                      href="/dashboard-admin/create-tag"
                      legacyBehavior
                      passHref
                    >
                      <NavigationMenuLink
                        className={navigationMenuTriggerStyle()}
                      >
                        Create Sub Activity
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Menu</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <Link href="/dashboard-admin" legacyBehavior passHref>
                      <NavigationMenuLink
                        className={navigationMenuTriggerStyle()}
                      >
                        Dashboard
                      </NavigationMenuLink>
                    </Link>
                    <Link
                      href="/dashboard-admin/approval-page"
                      legacyBehavior
                      passHref
                    >
                      <NavigationMenuLink
                        className={navigationMenuTriggerStyle()}
                      >
                        Approval Menu
                      </NavigationMenuLink>
                    </Link>
                    <Link
                      href="/dashboard-admin/mahasiswa-list"
                      legacyBehavior
                      passHref
                    >
                      <NavigationMenuLink
                        className={navigationMenuTriggerStyle()}
                      >
                        Mahasiswa List
                      </NavigationMenuLink>
                    </Link>
                    <Link
                      href="/dashboard-admin/upload-many"
                      legacyBehavior
                      passHref
                    >
                      <NavigationMenuLink
                        className={navigationMenuTriggerStyle()}
                      >
                        Upload Certificate
                      </NavigationMenuLink>
                    </Link>

                    <Button
                      onClick={logout}
                      className="hover:bg-slate-200 rounded-md font-medium p-4  text-sm"
                    >
                      Logout
                    </Button>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            {/* <Link href="/dashboard-admin" className=" flex items-center">
              <span className="  hover:bg-slate-200 ">Dashboard</span>
            </Link>
            <Link
              href="/dashboard-admin/mahasiswa-list"
              className=" flex items-center"
            >
              <span className="  hover:bg-slate-200 ">Student List</span>
            </Link>
            <div className="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52">
              <Link
                href="/dashboard-admin/upload-many"
                className=" flex  items-center"
              >
                <span className="  hover:bg-slate-200  py-2 rounded-md text-sm font-medium cursor-pointer">
                  Upload Xlsx
                </span>
              </Link>
              <span className=" flex flex-shrink-0 items-center cursor-pointer   py-2 rounded-md text-sm font-medium">
                <button
                  onClick={logout}
                  className="hover:bg-slate-200 rounded-md font-medium py-2 text-sm"
                >
                  Logout
                </button>
              </span>
            </div> */}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
