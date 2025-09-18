import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

let initialState = {
  selectedCategory: 0,
  minPrice:-1,
  maxPrice:-1
};

export const filterSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setCategory: (state, action) => {
      state.selectedCategory = action.payload.selectedCategory;
    },
    setMinPrice: (state, action) => {
      console.log(action);
      
      state.minPrice = action.payload.minPrice;
    },
    setMaxPrice: (state, action) => {
      state.maxPrice = action.payload.maxPrice;
    },
  },
});

export const {setCategory, setMinPrice, setMaxPrice}=filterSlice.actions;

export default filterSlice.reducer;
