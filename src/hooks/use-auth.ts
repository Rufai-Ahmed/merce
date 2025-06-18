"use client";
import { useAppSelector } from "@/lib/hooks/redux";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function useAuth(requireAdmin = false) {
  const router = useRouter();
  const { token, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!token) {
      router.push("/auth/login");
      return;
    }

    if (requireAdmin && !user?.role.includes("admin")) {
      router.push("/");
      return;
    }
  }, [token, user, requireAdmin, router]);

  return {
    isAuthenticated: !!token,
    user,
    isAdmin: user?.role === "admin",
  };
}
