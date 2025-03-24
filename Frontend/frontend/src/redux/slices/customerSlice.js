import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  customerDetails: null,
};

const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    setCustomerDetails: (state, action) => {
      state.customerDetails = action.payload;
    },
  },
});

export const { setCustomerDetails, clearCustomerDetails } = customerSlice.actions;
export default customerSlice.reducer;
