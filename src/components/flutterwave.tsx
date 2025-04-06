"use client";

import React from "react";
import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";
import { Button } from "@/components/ui/button";
import { TbLoader2 } from "react-icons/tb";

interface FlutterwavePaymentProps {
  amount: number;
  email: string;
  phone: string;
  name: string;
  onSuccess: (orderId: number) => void;
  onCreateOrder: () => Promise<number>;
  disabled: boolean;
  isLoading?: boolean;
}

const FlutterwavePayment: React.FC<FlutterwavePaymentProps> = ({
  amount,
  email,
  phone,
  name,
  onSuccess,
  onCreateOrder,
  disabled,
  isLoading = false,
}) => {
  const config = {
    public_key: process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY || "",
    tx_ref: `order-${Date.now()}`,
    amount,
    currency: "NGN",
    payment_options: "card,mobilemoney,ussd",
    customer: {
      email,
      phone_number: phone,
      name,
    },
    customizations: {
      title: "BigVybz Checkout",
      description: "Payment for your order",
      logo: "https://your-logo-url.com/logo.png", // Optional
    },
  };


  const handleFlutterwavePayment = useFlutterwave(config);

  const initiatePayment = async () => {
    try {
      const orderId = await onCreateOrder();
      handleFlutterwavePayment({
        callback: (response) => {
          if (response.status === "successful") {
            onSuccess(orderId);
          }
          closePaymentModal();
        },
        onClose: () => {
          // Handle payment cancellation if needed
        },
      });
    } catch (error) {
      console.error("Payment initiation failed:", error);
    }
  };

  return (
    <Button
      className="w-full bg-black text-white rounded-full py-4"
      onClick={initiatePayment}
      disabled={disabled || isLoading} // Disable when loading or explicitly disabled
    >
      {isLoading ? (
        <TbLoader2 className="animate-spin" />
      ) : (
        "Pay with Flutterwave"
      )}{" "}
    </Button>
  );
};

export default FlutterwavePayment;
