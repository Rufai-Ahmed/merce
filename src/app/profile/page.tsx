// src/pages/ProfilePage.tsx
"use client";

import React from "react";
import { useAppSelector } from "@/lib/hooks/redux";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useGetCustomerByIdQuery } from "@/apis/customer.api";
import { useGetOrdersQuery } from "@/apis/order.api";

export default function ProfilePage() {
  const { userId } = useAppSelector((state) => state.auth);
  const router = useRouter();

  if (!userId) {
    router.push("/login");
    return null;
  }

  const { data: customer, isLoading: isCustomerLoading } = useGetCustomerByIdQuery(userId);
  const { data: orders, isLoading: isOrdersLoading } = useGetOrdersQuery(userId);

  if (isCustomerLoading || isOrdersLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-4">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold mb-8 text-center text-indigo-700"
        >
          My Account
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-white p-6 rounded-xl shadow-md mb-8"
        >
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Personal Information</h2>
          <div className="space-y-2">
            <p><strong>Name:</strong> {customer?.first_name} {customer?.last_name}</p>
            <p><strong>Email:</strong> {customer?.email}</p>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="bg-white p-6 rounded-xl shadow-md"
        >
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Order History</h2>
          {orders && orders.length > 0 ? (
            <ul className="space-y-4">
              {orders.map((order, index) => (
                <motion.li
                  key={order.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="border-b pb-4 last:border-b-0"
                >
                  <p><strong>Order #{order.id}</strong></p>
                  <p><strong>Status:</strong> {order.status}</p>
                  <p><strong>Total:</strong> ₦{parseFloat(order.total).toLocaleString()}</p>
                  <p><strong>Date:</strong> {new Date(order.date_created).toLocaleDateString()}</p>
                </motion.li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">You haven’t placed any orders yet.</p>
          )}
        </motion.div>
      </div>
    </div>
  );
}