import React from "react";

export type MenuItem = {
  id: number | string;
  type: "MenuItem" | "MenuList";
  label: string | React.ReactNode;
  url?: string;
  children:
    | (Omit<MenuItem, "children" | "type"> & {
        description?: string | React.ReactNode;
      })[]
    | [];
};

export type MenuListData = (Omit<MenuItem, "children" | "type"> & {
  description?: string | React.ReactNode;
})[];

export type NavMenu = MenuItem[];
