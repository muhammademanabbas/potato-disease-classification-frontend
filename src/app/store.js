import {configureStore} from '@reduxjs/toolkit';
import authReducer from '../Features/auth/authSlice'
import historyReducer from '../Features/history/historySlice'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        history: historyReducer,
      },
})