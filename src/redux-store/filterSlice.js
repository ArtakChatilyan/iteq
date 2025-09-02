import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

let initialState = {
  selectedCategory: 0,
};

export const filterSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setCategory: (state, action) => {
      state.selectedCategory = action.payload.selectedCategory;
    },
  },
});

export const {setCategory}=filterSlice.actions;

export default filterSlice.reducer;
