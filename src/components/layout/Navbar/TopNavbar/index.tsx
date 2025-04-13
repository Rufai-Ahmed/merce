"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { integralCF } from "@/styles/fonts";
import { motion } from "framer-motion";
import { useAppSelector } from "@/lib/hooks/redux";
import {
  NavigationMenu,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { MenuItem } from "./MenuItem";
import { MenuList } from "./MenuList";
import InputGroup from "@/components/ui/input-group";
import CartBtn from "./CartBtn";
import ResTopNavbar from "./ResTopNavbar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGetCategoriesQuery } from "@/apis/category.api";
import { Skeleton } from "@/components/ui/skeleton";
import type { NavMenu } from "../navbar.types";

const TopNavbar = () => {
  const { token } = useAppSelector((state) => state.auth);

  const { data: categories, isLoading } = useGetCategoriesQuery({
    fields: ["name", "slug", "id"],
  });

  const shopChildren = isLoading
    ? [
        {
          id: "loading",
          label: <Skeleton className="w-24 h-4" />,
          url: "#",
          description: "",
        },
      ]
    : (categories || []).map((category) => ({
        id: category.id,
        label: category.name,
        url: `/shop?category=${category.id}`,
        description: "",
      }));

  const data: NavMenu = [
    {
      id: 1,
      label: "Shop",
      type: "MenuList",
      children: shopChildren,
    },
    {
      id: 2,
      type: "MenuItem",
      label: "On Sale",
      url: "/shop#on-sale",
      children: [],
    },
    {
      id: 3,
      type: "MenuItem",
      label: "New Arrivals",
      url: "/shop#new-arrivals",
      children: [],
    },

    {
      id: 4,
      type: "MenuItem",
      label: "Vybz Gallery",
      url: "/photos",
      children: [],
    },
    {
      id: 5,
      type: "MenuItem",
      label: "The Vybz Journal",
      url: "/photos",
      children: [],
    },
    {
      id: 6,
      type: "MenuItem",
      label: "Contact",
      url: "/contact",
      children: [],
    },
    {
      id: 6,
      type: "MenuItem",
      label: "About",
      url: "/about",
      children: [],
    },
  ];

  return (
    <nav className="sticky top-0 bg-white z-20">
      <div className="flex relative max-w-frame mx-auto items-center justify-between md:justify-start py-5 md:py-6 px-4 xl:px-0">
        <div className="flex items-center">
          <div className="block md:hidden mr-4">
            <ResTopNavbar data={data} />
          </div>
          <Link
            href="/"
            className={cn([
              integralCF.className,
              "text-2xl lg:text-[32px] mb-2 mr-3 lg:mr-10",
            ])}
          >
            <Image
              src={"/images/rex.png"}
              width={100}
              height={100}
              alt="Logo"
              className="w-[200px] h-auto"
            />
          </Link>
        </div>
        <NavigationMenu className="hidden md:flex mr-2 lg:mr-7">
          <NavigationMenuList>
            {data.map((item) => (
              <React.Fragment key={item.id}>
                {item.type === "MenuItem" && (
                  <MenuItem label={item.label} url={item.url} />
                )}
                {item.type === "MenuList" && (
                  <MenuList data={item.children} label={item.label} />
                )}
              </React.Fragment>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
        <InputGroup className="hidden md:flex bg-[#F0F0F0] mr-3 lg:mr-10">
          <InputGroup.Text>
            <Image
              priority
              src="/icons/search.svg"
              height={20}
              width={20}
              alt="search"
              className="min-w-5 min-h-5"
            />
          </InputGroup.Text>
          <InputGroup.Input
            type="search"
            name="search"
            placeholder="Search for products..."
            className="bg-transparent placeholder:text-black/40"
          />
        </InputGroup>
        <div className="flex items-center space-x-4">
          <Link href="/search" className="block md:hidden mr-[14px] p-1">
            <Image
              priority
              src="/icons/search-black.svg"
              height={100}
              width={100}
              alt="search"
              className="max-w-[22px] max-h-[22px]"
            />
          </Link>
          <CartBtn />
          {token ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-1">
                  <Image
                    priority
                    src="/icons/user.svg"
                    height={100}
                    width={100}
                    alt="User Menu"
                    className="max-w-[22px] max-h-[22px]"
                  />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="w-full">
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/orders" className="w-full">
                    Orders
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/auth/login"
                className="px-4 py-2 bg-black text-white text-sm font-medium rounded-md hover:bg-black/80 transition-colors"
              >
                Login
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default TopNavbar;
