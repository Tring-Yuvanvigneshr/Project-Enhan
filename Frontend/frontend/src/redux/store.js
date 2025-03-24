import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import customerReducer from "./slices/customerSlice"
import workerReducer from "./slices/workerSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    customer: customerReducer,
    worker: workerReducer
  },
})
