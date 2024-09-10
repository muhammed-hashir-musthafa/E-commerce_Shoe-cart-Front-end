import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import axios from "axios";
import api from "../../utils/axios";
import toast from "react-hot-toast";

export const settingWishList = createAsyncThunk(
  "wishlistSlice/settingWishList",
  async () => {
    try {
      const id = localStorage.getItem("id");
      const res = await api.get(`/user/${id}/wishlists`);
      // console.log(res.data.data)
       return res.data?.data 
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
        (item) => item._id === product._id
      );

      if (existingProductIndex !== -1) {
        return "Product is already in wishlist";
      } else {
        userWishList.push({ ...product });
      }

      await api.post(`/user/${id}/wishlists`, {
        wishlist: userWishList,
        productId: product._id,
      });

      return userWishList;
    } catch (error) {
      // console.log(error.response.status);
      // if (error.response.status === 400) {
      //   toast.error("Product already exists");
      // }
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
      // console.log(userWishList);

      userWishList = userWishList.filter((item) => item._id !== productId);

      await api.delete(`/user/${id}/wishlists`, {
        // wishlist: userWishList,
        data: { productId: productId },
      });

      return userWishList;
    } catch (error) {
      // console.log(error.response.status);
      // if (error.response.status === 400) {
      //   toast.error("Product already exists");
      // }
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
        // console.log(action.payload)
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
