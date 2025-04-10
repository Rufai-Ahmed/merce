"use client";

import React, { useState } from "react";
import { useLoginMutation } from "@/apis/auth.api";
import { useAppDispatch } from "@/lib/hooks/redux";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { decodeToken } from "@/lib/utils";
import { setAuth } from "@/lib/features/auth/auth.slice";
import Link from "next/link";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [login, { isLoading, error }] = useLoginMutation();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await login({ username, password }).unwrap();
      const token = response.token;
      const decoded = decodeToken(token);
      const userId = decoded.data.user.id;
      dispatch(setAuth({ token, userId }));
      router.push("/profile");
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br ">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-black">
          Welcome Back
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Username or email
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-black text-white py-2 rounded-md hover:bg-black/80 transition-colors"
          >
            {isLoading ? "Logging in..." : "Login"}
          </motion.button>
          {error && (
            <p
              className="text-sm text-red-600"
              dangerouslySetInnerHTML={{
                __html:
                  (error as any)?.data?.message || "<p>Error logging in</p>",
              }}
            ></p>
          )}
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link href="/auth/register" className="text-black hover:underline">
            Register
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
