import { postData } from "../../../api/apiService"; // Adjust the path if necessary

// Prepare the booking data for submission
export const prepareBookingData = (
  name,
  email,
  phone,
  selectedBarberId,
  selectedService,
  selectedDateTime,
  selectBaraerPrice,
  selectedExtraIds
) => {
  return {
    barber_id: selectedBarberId,
    service_id: selectedService,
    customer_name: name,
    appointment_time: selectedDateTime,
    email: email,
    phone: phone,
    price: selectBaraerPrice,
    extra: selectedExtraIds,
  };
};

// Handle form submission
export const handleFormSubmit = async (
  bookingData,
  setLoading,
  setResponseMessage
) => {
  setLoading(true);

  try {
    // Simulate loading for 3 seconds (optional)
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Use postData function to send the data to the backend
    const result = await postData("/bookings", bookingData);

    if (result) {
      setResponseMessage("success"); // Set success message
    } else {
      setResponseMessage(`Error: ${result.message}`);
    }
  } catch (error) {
    setResponseMessage("An error occurred while creating the booking.");
  } finally {
    setLoading(false);
  }
};
