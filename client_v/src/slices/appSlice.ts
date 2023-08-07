import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  showMenu: false,
  showLogIn: false,
  currentWidth: null,
  pickSidebar: 'Home',
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setShowMenu: (state, action) => {
      state.showMenu = action.payload;
    },
    setShowLogIn: (state, action) => {
      state.showLogIn = action.payload;
    },
    setCurrentWidth: (state, action) => {
      state.currentWidth = action.payload;
    },
    setPickSidebar: (state, action) => {
      state.pickSidebar = action.payload;
    },
  },
});

export const { setShowMenu, setShowLogIn, setCurrentWidth, setPickSidebar } = appSlice.actions;

export const getShowMenu = (state: any) => state.app.showMenu;
export const getShowLogIn = (state: any) => state.app.showLogIn;
export const getCurrentWidth = (state: any) => state.app.currentWidth;
export const getPickSidebar = (state: any) => state.app.pickSidebar;

export default appSlice.reducer;
