"use client";

import React from "react";
import { useAppSelector } from "@/lib/hooks/redux";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { useGetOrdersQuery } from "@/apis/order.api";
import { cn } from "@/lib/utils";

const OrdersPage = () => {
  const { userId } = useAppSelector((state) => state.auth);
  const router = useRouter();

  if (!userId) {
    router.push("/login");
    return null;
  }

  const { data: orders, isLoading, isError } = useGetOrdersQuery(userId);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-5xl w-full px-4 space-y-4">
          <Skeleton className="h-12 w-1/3" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (isError || !orders) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-lg text-red-600">Failed to load your orders.</p>
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
          My Orders
        </motion.h1>
        {orders.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="space-y-6"
          >
            {orders.map((order, index: number) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
                className="bg-white p-6 rounded-xl shadow-md"
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  Order #{order.id}
                </h2>
                <div className="space-y-2 text-gray-600">
                  <p>
                    <strong>Status:</strong>{" "}
                    <span
                      className={cn(
                        "capitalize",
                        order.status === "completed" && "text-green-600",
                        order.status === "processing" && "text-yellow-600",
                        order.status === "pending" && "text-orange-600",
                        order.status === "failed" && "text-red-600"
                      )}
                    >
                      {order.status}
                    </span>
                  </p>
                  <p>
                    <strong>Total:</strong> ₦
                    {parseFloat(order.total).toLocaleString()}
                  </p>
                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(order.date_created).toLocaleDateString()}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-center text-gray-600 text-lg"
          >
            You haven’t placed any orders yet.{" "}
            <Link href="/shop" className="text-indigo-600 hover:underline">
              Start shopping!
            </Link>
          </motion.p>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
