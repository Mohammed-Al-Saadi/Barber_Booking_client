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
  authBarnerId: null,
  selectedBarberNameDash: null,
  selectedBarberIdDash: null,
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
      state.selectedDateTime = action.payload; 
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
    selectedBarberDashName: (state, action) => {
      state.selectedBarberNameDash = action.payload;
    },
    selectedBarberDashId: (state, action) => {
      state.selectedBarberIdDash = action.payload;
    },
    // New reducers for authentication
    login: (state, action) => {
      state.authBarnerId = action.payload; 
    },
    logout: (state) => {
      state.authBarnerId = null; 
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
  selectedAuthBarberId,
  login,
  logout,
  selectedBarberDashName,
  selectedBarberDashId,
} = servicesSlice.actions;

export default servicesSlice.reducer;
