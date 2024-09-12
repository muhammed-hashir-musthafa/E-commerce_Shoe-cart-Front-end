import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../utils/axios';
import toast from 'react-hot-toast';

export const settingWishList = createAsyncThunk(
  'wishlistSlice/settingWishList',
  async (_, { rejectWithValue }) => {
    try {
      const id = localStorage.getItem('id');
      const response = await api.get(`/user/${id}/wishlists`);
      return response.data?.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch wishlist');
    }
  }
);

export const addToWishListAsync = createAsyncThunk(
  'wishlistSlice/addToWishListAsync',
  async (product, { rejectWithValue }) => {
    try {
      const id = localStorage.getItem('id');
      await api.post(`/user/${id}/wishlists`, { productId: product._id });
      return product;
    } catch (error) {
      if (error.response?.status === 400) {
        toast.error('Product already exists in wishlist');
      } else {
        toast.error('Failed to add product to wishlist');
      }
      return rejectWithValue('Failed to add to wishlist');
    }
  }
);

export const removeFromWishListAsync = createAsyncThunk(
  'wishlistSlice/removeFromWishListAsync',
  async (productId, { rejectWithValue }) => {
    try {
      const id = localStorage.getItem('id');
      await api.delete(`/user/${id}/wishlists`, { data: { productId } });
      return productId;
    } catch (error) {
      toast.error('Failed to remove product from wishlist');
      return rejectWithValue('Failed to remove from wishlist');
    }
  }
);

const initialState = {
  wishlist: [],
  status: 'idle',
  error: null,
};

const wishlistSlice = createSlice({
  name: 'wishlistSlice',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(settingWishList.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(settingWishList.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.wishlist = action.payload;
      })
      .addCase(settingWishList.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(addToWishListAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addToWishListAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.wishlist.push(action.payload);
      })
      .addCase(addToWishListAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(removeFromWishListAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(removeFromWishListAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.wishlist = state.wishlist.filter((item) => item._id !== action.payload);
      })
      .addCase(removeFromWishListAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default wishlistSlice.reducer;
