import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLogged: false,
};

const loginSlice = createSlice({
  name: "logSlice",
  initialState,
  reducers: {
    login: (state, action) => {
      state.isLogged=true
     },
    logout: (state, action) => {
      state.isLogged=false
 
    },
  },
});

export default loginSlice.reducer;
export const { login, logout } = loginSlice.actions;
