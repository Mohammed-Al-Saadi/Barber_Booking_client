// store.js
import { configureStore } from "@reduxjs/toolkit";
import servicesReducer from "../redux/slices.js"; // Adjust the path if needed

const store = configureStore({
  reducer: {
    services: servicesReducer, // Add other reducers here if you have more slices
  },
});

export default store;
