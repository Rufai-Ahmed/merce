import React from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { FiSliders } from "react-icons/fi";
import Filters from ".";

interface MobileFiltersProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  updateSearchParams: (params: {
    [key: string]: string | number | undefined;
  }) => void;
}

const MobileFilters: React.FC<MobileFiltersProps> = ({
  isOpen,
  setIsOpen,
  updateSearchParams,
}) => {
  return (
    <>
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        {" "}
        <DrawerTrigger asChild>
          <button
            type="button"
            className="h-8 w-8 rounded-full bg-[#F0F0F0] text-black p-1 md:hidden"
          >
            <FiSliders className="text-base mx-auto" />
          </button>
        </DrawerTrigger>
        <DrawerContent className="max-h-[90%]">
          <DrawerHeader>
            <div className="flex items-center justify-between">
              <span className="font-bold text-black text-xl">Filters</span>
              <FiSliders className="text-2xl text-black/40" />
            </div>
            <DrawerTitle className="hidden">filters</DrawerTitle>
            <DrawerDescription className="hidden">filters</DrawerDescription>
          </DrawerHeader>
          <div className="max-h-[90%] overflow-y-auto w-full px-5 md:px-6 py-5 space-y-5 md:space-y-6">
            <Filters updateSearchParams={updateSearchParams} />{" "}
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default MobileFilters;
