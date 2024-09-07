import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import axios from "axios";
import api from "../../utils/axios";

export const settingCart = createAsyncThunk(
  "cartSlice/settingCart",
  async () => {
    try {
      const id = localStorage.getItem("id");
      if (!id) {
        throw new Error("User ID not found");
      }
      const res = await api.get(`/admin/userlist`);
      // console.log(res.data.data);
      return res.data?.data?.cart;
    } catch (error) {
      console.log("something went wrong!");
      throw error;
    }
  }
);

export const addToCartAsync = createAsyncThunk(
  "cartSlice/addToCartAsync",
  async (product, { getState }) => {
    try {
      const state = getState();
      const id = localStorage.getItem("id");
      let userCart = [...state.cartSlice];

      const existingProductIndex = userCart.findIndex(
        (item) => item.id === product.id
      );

      if (existingProductIndex !== -1) {
        const updatedCart = userCart.map((item, index) => {
          if (index === existingProductIndex) {
            return { ...item, quantity: item.quantity + product.quantity };
          }
          return item;
        });
        userCart = updatedCart;
      } else {
        userCart.push({ ...product, quantity: product.quantity });
      }

      await api.post(`/user/${id}/cart`, { cart: userCart });

      return userCart;
    } catch (error) {
      console.log("Something went wrong!", error);
      throw error;
    }
  }
);

export const removeFromCartAsync = createAsyncThunk(
  "cartSlice/removeFromCartAsync",
  async (productId, { getState }) => {
    try {
      const state = getState();
      const id = localStorage.getItem("id");
      const userCart = state.cartSlice.cart.filter(
        (item) => item.id !== productId
      );

      await api.delete(`/user/${id}/cart`, { cart: userCart });
      return userCart;
    } catch (error) {
      console.log("something went wrong!");
      throw error;
    }
  }
);

export const quantityIncrementAsync = createAsyncThunk(
  "cartSlice/quantityIncrementAsync",
  async (productId, { getState }) => {
    try {
      const state = getState();
      const id = localStorage.getItem("id");
      const userCart = state.cartSlice.cart.map((item) => {
        if (item.id === productId) {
          return { ...item, quantity: item.quantity + 1 };
        }
        return item;
      });

      await api.post(`user/${id}/cart`, { cart: userCart });
      return userCart;
    } catch (error) {
      console.log("something went wrong!");
      throw error;
    }
  }
);

export const quantityDecrementAsync = createAsyncThunk(
  "cartSlice/quantityDecrementAsync",
  async (productId, { getState }) => {
    try {
      const state = getState();
      const id = localStorage.getItem("id");
      const userCart = state.cartSlice.cart.map((item) => {
        if (item.id === productId && item.quantity > 1) {
          return { ...item, quantity: item.quantity - 1 };
        }
        return item;
      });

      await api.post(`/user/${id}/cart`, { cart: userCart });
      return userCart;
    } catch (error) {
      console.log("something went wrong!");
      throw error;
    }
  }
);

const INITIAL_STATE = {
  cart: [],
};

const cartSlice = createSlice({
  name: "cartSlice",
  initialState: INITIAL_STATE,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(settingCart.pending, (state) => {
        console.log("cart is loading");
      })
      .addCase(settingCart.rejected, (state) => {
        console.log("Error in fetching cart");
      })
      .addCase(settingCart.fulfilled, (state, action) => {
        console.log("cart updated successfully");
        state.cart = action.payload;
      })
      .addCase(addToCartAsync.fulfilled, (state, action) => {
        state.cart = action.payload;
      })
      .addCase(removeFromCartAsync.fulfilled, (state, action) => {
        state.cart = action.payload;
      })
      .addCase(quantityIncrementAsync.fulfilled, (state, action) => {
        state.cart = action.payload;
      })
      .addCase(quantityDecrementAsync.fulfilled, (state, action) => {
        state.cart = action.payload;
      });
  },
});

export default cartSlice.reducer;

export const {
  addToCart,
  removeFromCart,
  quantityIncrement,
  quantityDecrement,
} = cartSlice.actions;
