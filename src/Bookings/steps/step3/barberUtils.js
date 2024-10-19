import { postData } from "../../../api/apiService"; // Adjust the path to your service

// Fetch barbers and available slots for selected services
export const fetchBarbersAndSlots = async (
  combinedServices,
  setBarberData,
  setLoading,
  setError
) => {
  try {
    setLoading(true);
    setError(null);

    const data = await postData("/get_barbers_and_slots", {
      service_name: combinedServices, // Send combined services
    });

    setBarberData(data.barbers);
    setLoading(false);
  } catch (error) {
    setError(error.message);
    setLoading(false);
  }
};

// Handle barber selection
export const handleBarberSelection = (
  barberId,
  barberName,
  barberPrice,
  dispatch,
  selectBarber,
  selectName,
  selectedBarberPrice
) => {
  dispatch(selectBarber(barberId));
  dispatch(selectName(barberName));
  dispatch(selectedBarberPrice(barberPrice));
};

// Handle slot selection
export const handleSlotSelection = (
  date,
  time,
  dispatch,
  selectDateTime,
  setSelectedSlot
) => {
  const slotIdentifier = `${date} ${time}`;
  dispatch(selectDateTime(slotIdentifier));
  setSelectedSlot(slotIdentifier);
};

// Format date for display
export const formatDate = (date) => {
  return date.toLocaleDateString("fi-FI", {
    weekday: "short",
    day: "numeric",
    month: "numeric",
    year: "2-digit",
    timeZone: "Europe/Helsinki",
  });
};

// Get date with offset
export const getCurrentDayDate = (offset = 0) => {
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + offset); // Adjust for the offset
  return currentDate;
};
