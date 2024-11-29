// store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice"; // Adjust path as necessary

const store = configureStore({
  reducer: {
    auth: authReducer, // Ensure this matches how you're accessing the state
  },
});

export default store;
