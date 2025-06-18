import { User } from "@/apis/admin.api";
import { clsx, type ClassValue } from "clsx";
import { formatDate as dateFormat, FormatOptions } from "date-fns";
import { jwtDecode } from "jwt-decode";
import { twMerge } from "tailwind-merge";

interface DecodedToken {
  data: {
    user: Partial<User>;
  };
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const compareArrays = (a: any[], b: any[]) => {
  return a.toString() === b.toString();
};
export function decodeToken(token: string): DecodedToken {
  return jwtDecode<DecodedToken>(token);
}
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "NGN",
  }).format(amount);
}

export const formatDate = (
  date: string | Date,
  formatStr = "PPpp",
  options?: FormatOptions
) => dateFormat(new Date(date), formatStr, options);

export function removeNullishValues<T extends Record<string, any>>(
  obj: T
): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([_, value]) => value !== undefined && value !== null
    )
  ) as Partial<T>;
}
