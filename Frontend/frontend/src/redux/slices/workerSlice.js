import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  workerDetails: null,
};

const workerSlice = createSlice({
  name: "worker",
  initialState,
  reducers: {
    setWorkerDetails: (state, action) => {
      state.workerDetails = action.payload;
    },
  },
});

export const { setWorkerDetails, clearWorkerDetails } = workerSlice.actions;
export default workerSlice.reducer;
