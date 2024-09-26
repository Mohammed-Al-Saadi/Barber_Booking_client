import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  categories: {},
  selectedCategory: null,
  selectedService: null,
  selectedDateTime: null,
  selectedBarber: null,
  selectBarberName: null,
  selectedServiceid: null,
  selectbarberPrice: null,
  additionalServices: [],
  selectedExtras: [],
};

const servicesSlice = createSlice({
  name: "services",
  initialState,
  reducers: {
    setServices(state, action) {
      state.categories = action.payload.categories;
    },
    setSelectedCategory(state, action) {
      state.selectedCategory = action.payload;
    },
    updateSelectedService: (state, action) => {
      // Renamed the action here
      state.selectedService = action.payload;
    },
    selectDateTime: (state, action) => {
      state.selectedDateTime = action.payload; // Store date and time together
    },
    selectBarber: (state, action) => {
      state.selectedBarber = action.payload;
    },
    selectName: (state, action) => {
      state.selectBarberName = action.payload;
    },
    selectedServiceId: (state, action) => {
      state.selectedServiceid = action.payload;
    },
    selectedBarberPrice: (state, action) => {
      state.selectbarberPrice = action.payload;
    },
    selectedAdditionalServices: (state, action) => {
      state.additionalServices = action.payload;
    },
    selectedExtraServices: (state, action) => {
      state.selectedExtras = action.payload;
    },
  },
});

// Export the action
export const {
  setServices,
  setSelectedCategory,
  updateSelectedService,
  selectDateTime,
  selectBarber,
  selectName,
  selectedServiceId,
  selectedBarberPrice,
  selectedAdditionalServices,
  selectedExtraServices,
} = servicesSlice.actions;

// Export the reducer
export default servicesSlice.reducer;
