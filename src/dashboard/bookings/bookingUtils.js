// bookingsUtils.js
export const groupBookingsByDate = (bookings) => {
  return bookings.reduce((acc, booking) => {
    const date = new Date(booking.appointment_time).toLocaleDateString("en-GB");
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(booking);
    return acc;
  }, {});
};

export const sortBookingsByStatus = (bookingsForDate) => {
  const now = new Date();
  const sortedBookings = [...bookingsForDate].sort((a, b) => {
    const aStatus = getBookingStatus(
      a.appointment_time,
      a.total_estimated_time
    );
    const bStatus = getBookingStatus(
      b.appointment_time,
      b.total_estimated_time
    );

    if (aStatus === "current") return -1;
    if (bStatus === "current") return 1;
    if (aStatus === "upcoming" && bStatus === "done") return -1;
    if (aStatus === "done" && bStatus === "upcoming") return 1;
    return 0;
  });

  return sortedBookings;
};

export const getBookingStatus = (appointmentTime, totalEstimatedTime) => {
  const now = new Date();
  const appointmentDate = new Date(appointmentTime);
  const endTime = new Date(
    appointmentDate.getTime() + totalEstimatedTime * 60000
  );

  if (now < appointmentDate) {
    return "upcoming";
  } else if (now >= appointmentDate && now < endTime) {
    return "current";
  } else {
    return "done";
  }
};

export const convertSlotToDateTime = (slot) => {
  const [hours, minutes] = slot.split(":").map(Number);
  const now = new Date();
  return new Date(now.setHours(hours, minutes, 0, 0));
};

export const calculateBookingEndTime = (booking) => {
  const appointmentTime = new Date(booking.appointment_time);
  const totalEstimatedTime = booking.total_estimated_time * 60000;
  return new Date(appointmentTime.getTime() + totalEstimatedTime);
};

export const filterSlotsAfterBooking = (slots, bookingEndTime) => {
  const filteredSlots = [];
  let lastSlotTime = bookingEndTime;

  for (let i = 0; i < slots.length; i++) {
    const slotTime = convertSlotToDateTime(slots[i]);

    if (slotTime >= bookingEndTime) {
      const timeDifference = (slotTime - lastSlotTime) / 60000;
      if (timeDifference > 15 && filteredSlots.length > 0) {
        break;
      }
      filteredSlots.push(slots[i]);
      lastSlotTime = slotTime;
    }
  }

  return filteredSlots;
};

