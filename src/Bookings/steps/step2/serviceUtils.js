// serviceUtils.js

import { selectedExtraServices, selectedServiceId, updateSelectedService } from "../../../redux/slices";

// Function to handle service selection
export const selectService = (dispatch, selectedService, serviceName, serviceId) => {
  // Reset extra services when a different main service is selected
  if (selectedService !== serviceName) {
    dispatch(selectedExtraServices([])); // Clear selected extras in Redux
  }

  dispatch(updateSelectedService(serviceName));
  dispatch(selectedServiceId(serviceId));
};

// Function to handle extra service toggling in the modal
export const handleExtraChange = (item, selectedExtras, dispatch) => {
  const updatedExtras = selectedExtras.some((extra) => extra.name === item.name)
    ? selectedExtras.filter((extra) => extra.name !== item.name) // If already selected, remove it
    : [...selectedExtras, item]; // Otherwise, add it

  dispatch(selectedExtraServices(updatedExtras)); // Dispatch the updated extras to Redux
};
