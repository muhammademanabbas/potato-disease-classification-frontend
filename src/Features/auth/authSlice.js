import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth', 
  initialState: {
    isLoggedIn: false,
  },
  reducers: {
    login: (state, action) => {
      const loginVar = action.payload;
      // console.log("login var :",loginVar);
      state.isLoggedIn = loginVar;
      // console.log("Redux isLoggedIn state after login:", state.isLoggedIn);
    },
    logout: (state,action) => {
      state.isLoggedIn = action.payload
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;