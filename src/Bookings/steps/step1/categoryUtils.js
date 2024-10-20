// categoryUtils.js

import { selectedAdditionalServices, setSelectedCategory } from "../../../redux/slices";

// Handle additional services for the "Lisäpalvelut" category
export const handleAdditionalServices = (items, dispatch) => {
  const services = items["Lisäpalvelut"]; 
  if (services) {
    const serviceDetails = services.map((service) => ({
      name: service.service_name,
      estimatedTime: service.estimated_time,
      price: service.price,
      service_id: service.service_id,
    }));

    // Dispatch action to store additional services in Redux
    dispatch(selectedAdditionalServices(serviceDetails));
  }
};

// Handle category toggle
export const toggleCategory = (categoryName, expandedCategory, setExpandedCategory, dispatch) => {
  if (expandedCategory !== categoryName) {
    setExpandedCategory(categoryName); 
    dispatch(setSelectedCategory(categoryName)); 
  }
};
