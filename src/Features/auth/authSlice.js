import { createSlice } from '@reduxjs/toolkit';
import { checkToken } from '../../Token/token';

const authSlice = createSlice({
  name: 'auth', 
  initialState: {
    isLoggedIn: checkToken() ? true : false, // Check if token exists to set initial state
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