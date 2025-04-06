import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  data: {
    user: {
      id: number;
    };
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
