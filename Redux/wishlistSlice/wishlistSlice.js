import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const settingWishList = createAsyncThunk(
  "wishlistSlice/settingWishList",
  async () => {
    try {
      const id = localStorage.getItem("id");
      const res = await axios.get(`http://localhost:8000/User/${id}`);
      return res.data.wishlist;
    } catch (error) {
      console.log("Something went wrong!");
      throw error;
    }
  }
);

export const addToWishListAsync = createAsyncThunk(
  "wishlistSlice/addToWishListAsync",
  async (product, { getState }) => {
    try {
      const state = getState();
      const id = localStorage.getItem("id");
      let userWishList = [...state.wishlistSlice.wishlist];

      const existingProductIndex = userWishList.findIndex(
        (item) => item.id === product.id
      );

      if (existingProductIndex !== -1) {
        return "Product is already in wishlist";
      } else {
        userWishList.push({ ...product });
      }

      await axios.patch(`http://localhost:8000/User/${id}`, {
        wishlist: userWishList,
      });

      return userWishList;
    } catch (error) {
      console.log("Something went wrong!", error);
      throw error;
    }
  }
);

export const removeFromWishListAsync = createAsyncThunk(
  "wishlistSlice/removeFromWishListAsync",
  async (productId, { getState }) => {
    try {
      const state = getState();
      const id = localStorage.getItem("id");
      let userWishList = [...state.wishlistSlice.wishlist];

      userWishList = userWishList.filter((item) => item.id !== productId);

      await axios.patch(`http://localhost:8000/User/${id}`, {
        wishlist: userWishList,
      });

      return userWishList;
    } catch (error) {
      console.log("Something went wrong!", error);
      throw error;
    }
  }
);

const initialState = {
  wishlist: [],
  status: "idle",
  error: null,
};

const wishlistSlice = createSlice({
  name: "wishlistSlice",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(settingWishList.pending, (state) => {
        state.status = "loading";
      })
      .addCase(settingWishList.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.wishlist = action.payload;
      })
      .addCase(settingWishList.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addToWishListAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addToWishListAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (typeof action.payload === "string") {
          console.log(action.payload);
        } else {
          state.wishlist = action.payload;
        }
      })
      .addCase(addToWishListAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(removeFromWishListAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(removeFromWishListAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.wishlist = action.payload;
      })
      .addCase(removeFromWishListAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default wishlistSlice.reducer;
