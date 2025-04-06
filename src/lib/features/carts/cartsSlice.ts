// src/lib/slices/cartsSlice.ts
import { compareArrays } from "@/lib/utils";
import { type Product } from "@/types/product.types";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

export type RemoveCartItem = {
  id: number;
  attributes: string[];
};

export interface CartItem extends Product {
  quantity: number;
}

export type Cart = {
  items: CartItem[];
  totalQuantities: number;
};

interface CartsState {
  cart: Cart | null;
  totalPrice: number;
  adjustedTotalPrice: number;
  action: "update" | "add" | "delete" | null;
}

const initialState: CartsState = {
  cart: null,
  totalPrice: 0,
  adjustedTotalPrice: 0,
  action: null,
};

const getAdjustedPrice = (item: CartItem): number => {
  const basePrice = item.price;
  if (item.discount.percentage > 0) {
    return Math.round(basePrice - (basePrice * item.discount.percentage) / 100);
  }
  if (item.discount.amount > 0) {
    return Math.round(basePrice - item.discount.amount);
  }
  return basePrice;
};

const recalculateTotals = (items: CartItem[]) => ({
  totalPrice: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
  adjustedTotalPrice: items.reduce(
    (sum, item) => sum + getAdjustedPrice(item) * item.quantity,
    0
  ),
  totalQuantities: items.reduce((sum, item) => sum + item.quantity, 0),
});

export const cartsSlice = createSlice({
  name: "carts",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const newItem = action.payload;
      if (!state.cart) {
        state.cart = { items: [newItem], totalQuantities: newItem.quantity };
      } else {
        const existingItemIndex = state.cart.items.findIndex(
          (item) =>
            item.id === newItem.id &&
            compareArrays(item.attributes, newItem.attributes)
        );

        if (existingItemIndex >= 0) {
          // Update existing item
          state.cart.items[existingItemIndex].quantity += newItem.quantity;
        } else {
          // Add new item
          state.cart.items.push(newItem);
        }
        state.cart.totalQuantities += newItem.quantity;
      }

      const totals = recalculateTotals(state.cart.items);
      state.totalPrice = totals.totalPrice;
      state.adjustedTotalPrice = totals.adjustedTotalPrice;
      state.action = "add";
    },

    removeCartItem: (state, action: PayloadAction<RemoveCartItem>) => {
      if (!state.cart) return;

      const itemToRemove = state.cart.items.find(
        (item) =>
          item.id === action.payload.id &&
          compareArrays(
            typeof item.attributes?.[0] === "object"
              ? item.attributes.map((a) => a.options)
              : item.attributes,
            action.payload.attributes
          )
      );

      if (itemToRemove) {
        itemToRemove.quantity -= 1;
        state.cart.items = state.cart.items.filter((item) => item.quantity > 0);
        state.cart.totalQuantities -= 1;

        const totals = recalculateTotals(state.cart.items);
        state.totalPrice = totals.totalPrice;
        state.adjustedTotalPrice = totals.adjustedTotalPrice;
        state.action = "update";

        if (state.cart.items.length === 0) state.cart = null;
      }
    },

    remove: (state, action: PayloadAction<RemoveCartItem>) => {
      if (!state.cart) return;

      const itemToRemove = state.cart.items.find(
        (item) =>
          item.id === action.payload.id &&
          compareArrays(
            typeof item.attributes?.[0] === "object"
              ? item.attributes.map((a) => a.options)
              : item.attributes,
            action.payload.attributes
          )
      );

      if (itemToRemove) {
        state.cart.items = state.cart.items.filter(
          (item) =>
            !(
              item.id === action.payload.id &&
              compareArrays(
                typeof item.attributes?.[0] === "object"
                  ? item.attributes.map((a) => a.options)
                  : item.attributes,
                action.payload.attributes
              )
            )
        );
        state.cart.totalQuantities -= itemToRemove.quantity;

        const totals = recalculateTotals(state.cart.items);
        state.totalPrice = totals.totalPrice;
        state.adjustedTotalPrice = totals.adjustedTotalPrice;
        state.action = "delete";

        if (state.cart.items.length === 0) state.cart = null;
      }
    },

    clearCart: (state) => {
      state.cart = null;
      state.totalPrice = 0;
      state.adjustedTotalPrice = 0;
      state.action = null;
    },
  },
});

export const { addToCart, removeCartItem, remove, clearCart } =
  cartsSlice.actions;
export default cartsSlice.reducer;
