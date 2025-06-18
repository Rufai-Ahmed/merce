"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetOrderByIdQuery,
  useRegeneratePaymentUrlMutation,
  useVerifyOrderPaymentMutation,
} from "@/apis/order.api";

export default function OrderConfirmationPage() {
  const { id } = useParams();
  const orderId = id as string;
  const { data: order, isLoading, isError } = useGetOrderByIdQuery(orderId);
  const [regeneratePaymentUrl, { isLoading: isGeneratingPayment }] =
    useRegeneratePaymentUrlMutation();
  const [verifyOrderPayment] = useVerifyOrderPaymentMutation();
  const searchParams = useSearchParams();
  const tx_ref = searchParams.get("tx_ref");
  const transaction_id = searchParams.get("transaction_id");
  const [paymentStatus, setPaymentStatus] = useState<
    null | "success" | "failed" | "pending"
  >(null);
  const [verifying, setVerifying] = useState(false);
  const router = useRouter();
  const hasVerified = useRef(false);

  useEffect(() => {
    if ((tx_ref || transaction_id) && !hasVerified.current) {
      hasVerified.current = true;
      setVerifying(true);
      verifyOrderPayment({
        tx_ref: tx_ref || undefined,
        transaction_id: transaction_id || undefined,
      })
        .unwrap()
        .then((res) => {
          if (res.data?.data?.status === "successful")
            setPaymentStatus("success");
          else setPaymentStatus("failed");
          // Remove query params after verification
          router.replace(`/order-confirmation/${orderId}`);
        })
        .catch(() => {
          setPaymentStatus("failed");
          router.replace(`/order-confirmation/${orderId}`);
        })
        .finally(() => setVerifying(false));
    }
  }, [tx_ref, transaction_id, verifyOrderPayment, orderId, router]);

  const handleMakePayment = async () => {
    if (!order) return;

    try {
      // If order already has a payment URL, use it
      if (order.payment_url) {
        window.location.href = order.payment_url;
        return;
      }

      // Otherwise, regenerate the payment URL
      const result = await regeneratePaymentUrl(order.id).unwrap();
      if (result.payment_url) {
        window.location.href = result.payment_url;
      }
    } catch (error) {
      console.error("Failed to generate payment URL:", error);
      alert("Failed to generate payment URL. Please try again.");
    }
  };

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

          {/* Payment Status */}
          <div className="mt-4">
            <h4 className="font-semibold">Payment Status:</h4>
            {verifying ? (
              <p className="font-medium text-blue-600">Verifying payment...</p>
            ) : paymentStatus === "success" ? (
              <p className="font-medium text-green-600">Payment Successful</p>
            ) : paymentStatus === "failed" ? (
              <p className="font-medium text-red-600">Payment Failed</p>
            ) : (
              <p
                className={`font-medium ${
                  order.needs_payment ? "text-red-600" : "text-green-600"
                }`}
              >
                {order.needs_payment ? "Payment Required" : "Payment Completed"}
              </p>
            )}
          </div>

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

          {/* Payment Button */}
          {order.needs_payment && (
            <div className="mt-6">
              <Button
                onClick={handleMakePayment}
                disabled={isGeneratingPayment}
                className="w-full bg-black text-white rounded-full py-4 mb-4"
              >
                {isGeneratingPayment ? "Generating Payment..." : "Make Payment"}
              </Button>
              <p className="text-sm text-gray-600 text-center">
                Click the button above to complete your payment
              </p>
            </div>
          )}

          <Button asChild className="mt-6">
            <Link href="/shop">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
