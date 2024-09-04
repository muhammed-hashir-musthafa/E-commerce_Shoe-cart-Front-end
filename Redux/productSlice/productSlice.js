import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchProducts = createAsyncThunk(
  "productSlice/fetchProducts",
  async () => {
    try {
      const res = await axios.get("http://localhost:8000/products");
      // console.log(res.data);
      return res.data;
    } catch (error) {
      console.log("something went wrong!");
    }
  }
);

const initialState = {
  products: [],
  filteredProducts: [],
  category: "all",
};

const productSlice = createSlice({
  name: "productSlice",
  initialState,
  reducers: {
    searchFilter: (state, action) => {
      state.filteredProducts = state.products.filter((product) =>
        product.title.toLowerCase().includes(action.payload.toLowerCase())
      );
    },
    categorize: (state, action) => {
      if (action.payload === "all") {
        state.filteredProducts = state.products;
      } else {
        state.filteredProducts = state.products.filter(
          (product) => product.category === action.payload
        );
      }
      // console.log(action.payload);
    },
    deleteProduct: (state, action) => {
      const productId = action.payload.id;
      state.products = state.products.filter(
        (product) => product.id !== productId
      );
      state.filteredProducts = state.filteredProducts.filter(
        (product) => product.id !== productId
      );
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchProducts.pending, (state, action) => {
      console.log("loading");
    }),
      builder.addCase(fetchProducts.rejected, (state, action) => {
        console.log("Error in fetching");
      }),
      builder.addCase(fetchProducts.fulfilled, (state, action) => {
        // console.log("Succes");
        state.products = action.payload;
        state.filteredProducts = action.payload;
        // console.log(action.payload);
      });
  },
});

export default productSlice.reducer;
export const { categorize, searchFilter, deleteProduct } = productSlice.actions;