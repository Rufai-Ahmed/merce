// src/pages/CheckoutPage.tsx
"use client";

import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux";
import { RootState } from "@/lib/store";
import React, { useState } from "react";

import {
  useCreateOrderMutation,
  useGetShippingMethodsQuery,
} from "@/apis/order.api";
import FlutterwavePayment from "@/components/flutterwave";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { clearCart } from "@/lib/features/carts/cartsSlice";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { cart, totalPrice, adjustedTotalPrice } = useAppSelector(
    (state: RootState) => state.carts
  );
  const { userId } = useAppSelector((state) => state.auth);

  const [createOrder, { isLoading: isOrderLoading }] = useCreateOrderMutation();
  const { data: shippingMethods, isLoading: isShippingLoading } =
    useGetShippingMethodsQuery();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "NG",
    shippingMethod: "",
  });

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-frame mx-auto px-4 xl:px-0 py-20 text-center">
        <h2 className="text-2xl font-bold">Your cart is empty</h2>
        <Button asChild className="mt-4">
          <Link href="/shop">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleShippingChange = (value: string) => {
    setFormData((prev) => ({ ...prev, shippingMethod: value }));
  };

  const selectedShipping = shippingMethods?.find(
    (method) => method.id === formData.shippingMethod
  );
  const shippingCost = selectedShipping ? parseFloat(selectedShipping.cost) : 0;
  const totalWithShipping = adjustedTotalPrice + shippingCost;

  const handleCheckout = async () => {
    const orderData = {
      line_items: cart.items.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
        ...(item.attributes.length > 0 && {
          variation_id: item.variations[0]?.id,
        }),
        meta_data: item.attributes.map((attr) => ({
          key: attr.name,
          value: attr.options[0],
        })),
      })),
      billing: {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address_1: formData.address,
        city: formData.city,
        state: formData.state,
        country: formData.country,
      },
      shipping: {
        first_name: formData.firstName,
        last_name: formData.lastName,
        address_1: formData.address,
        city: formData.city,
        state: formData.state,
        country: formData.country,
      },
      shipping_lines: selectedShipping
        ? [
            {
              method_id: selectedShipping.id,
              method_title: selectedShipping.title,
              total: shippingCost.toString(),
            },
          ]
        : [],
        customer_id: userId,
    };

    try {
      const order = await createOrder(orderData).unwrap();
      return order.id;
    } catch (error) {
      console.error("Failed to create order:", error);
      alert("Error creating order. Please try again.");
      throw error;
    }
  };

  const handlePaymentSuccess = (orderId: number) => {
    dispatch(clearCart());
    router.push(`/order-confirmation/${orderId}`);
  };

  return (
    <main className="pb-20">
      <div className="max-w-frame mx-auto px-4 xl:px-0">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">Checkout</h2>
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-2/3">
            <h3 className="text-xl font-semibold mb-4">Shipping Information</h3>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="shippingMethod">Shipping Method</Label>
                {isShippingLoading ? (
                  <Skeleton className="h-10 w-full" />
                ) : (
                  <Select
                    value={formData.shippingMethod}
                    onValueChange={handleShippingChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select shipping method" />
                    </SelectTrigger>
                    <SelectContent>
                      {shippingMethods?.map((method) => (
                        <SelectItem key={method.id} value={method.id}>
                          {method.title} (₦
                          {parseFloat(method.cost).toLocaleString()})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </form>
          </div>
          <div className="w-full lg:w-1/3">
            <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
            <div className="p-4 border rounded-lg space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₦{adjustedTotalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>
                  {shippingCost > 0
                    ? `₦${shippingCost.toLocaleString()}`
                    : "TBD"}
                </span>
              </div>
              <hr />
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>₦{totalWithShipping.toLocaleString()}</span>
              </div>
              <FlutterwavePayment
                amount={totalWithShipping}
                email={formData.email}
                phone={formData.phone}
                name={`${formData.firstName} ${formData.lastName}`}
                onSuccess={handlePaymentSuccess}
                onCreateOrder={handleCheckout}
                disabled={
                  !formData.firstName ||
                  !formData.email ||
                  !formData.shippingMethod ||
                  isOrderLoading
                }
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
