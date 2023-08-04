import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
};

export const userSlice = createSlice({
  name: "userInfo",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    logout: (state, action) => {
      state.user = null;
    },

  },
});

export const { setUser, logout, } = userSlice.actions;

export const getUser = (state: any) => state.userInfo.user;

export default userSlice.reducer;
