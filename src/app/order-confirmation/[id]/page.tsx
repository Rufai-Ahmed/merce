"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetOrderByIdQuery } from "@/apis/order.api";

export default function OrderConfirmationPage() {
  const { id } = useParams();
  const orderId = parseInt(id as string, 10);
  const { data: order, isLoading, isError } = useGetOrderByIdQuery(orderId);
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="max-w-frame mx-auto px-4 xl:px-0 py-20">
        <Skeleton className="h-8 w-1/3 mb-6" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="max-w-frame mx-auto px-4 xl:px-0 py-20 text-center">
        <h2 className="text-2xl font-bold">Order not found</h2>
        <Button asChild className="mt-4">
          <Link href="/shop">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <main className="pb-20">
      <div className="max-w-frame mx-auto px-4 xl:px-0">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">
          Order Confirmation
        </h2>
        <div className="border rounded-lg p-6">
          <h3 className="text-xl font-semibold">Thank you for your order!</h3>
          <p className="mt-2">Order #{order.id}</p>
          <div className="mt-4">
            <h4 className="font-semibold">Items:</h4>
            <ul className="list-disc pl-5">
              {order.line_items.map((item: any) => (
                <li key={item.id}>
                  {item.name} x {item.quantity} - ₦
                  {(item.price * item.quantity).toLocaleString()}
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-4">
            <h4 className="font-semibold">Shipping:</h4>
            <p>
              {order.shipping_lines[0]?.method_title || "N/A"} - ₦
              {order.shipping_total || "0"}
            </p>
            <p>
              {order.shipping.first_name} {order.shipping.last_name}
            </p>
            <p>
              {order.shipping.address_1}, {order.shipping.city},{" "}
              {order.shipping.state}, {order.shipping.country}
            </p>
          </div>
          <div className="mt-4">
            <h4 className="font-semibold">Total:</h4>
            <p>₦{parseFloat(order.total).toLocaleString()}</p>
          </div>
          <Button asChild className="mt-6">
            <Link href="/shop">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
