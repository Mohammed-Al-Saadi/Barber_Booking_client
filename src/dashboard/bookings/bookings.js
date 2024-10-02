import React, { useEffect, useState } from "react";
import "./bookings.css"; // Import your CSS file for styling
import BeatLoader from "react-spinners/BeatLoader"; // Loader
import { useSelector } from "react-redux";
import Modal from "../../ModelView";
import DatePicker from "react-datepicker"; // Import Date Picker
import "react-datepicker/dist/react-datepicker.css"; // Date Picker CSS
import { SlCalender } from "react-icons/sl";
import { GrNext } from "react-icons/gr";
import { GrPrevious } from "react-icons/gr";
import OverAll from "../overAll/overAll";

function Bookings() {
  const [bookings, setBookings] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date()); // Track the selected date
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState([]); // For multiple slot selection
  const [newPrice, setNewPrice] = useState("");
  const [modalType, setModalType] = useState(""); // New state to differentiate between price and time modals
  const [loadingSlots, setLoadingSlots] = useState(false); // Track loading state for slots
  const [breaks, setBreaks] = useState([]); // Initialize breaks as an empty array
  const [successMessage, setSuccessMessage] = useState(""); // State for success message
  const barberId = useSelector((state) => state.services.selectedBarberIdDash);

  // Fetch bookings data
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8080/get_todays_bookings?barber_id=${barberId}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();

        if (Array.isArray(data.bookings)) {
          // Group bookings by date
          const groupedBookings = groupBookingsByDate(data.bookings);
          setBookings(groupedBookings);
        } else {
          setBookings({});
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [barberId]);

  // Group bookings by date and sort them by status
  const groupBookingsByDate = (bookings) => {
    return bookings.reduce((acc, booking) => {
      const date = new Date(booking.appointment_time).toLocaleDateString(
        "en-GB"
      );
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(booking);
      return acc;
    }, {});
  };

  // Sort bookings by status (current, upcoming, done)
  const sortBookingsByStatus = (bookingsForDate) => {
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

  const getBookingStatus = (appointmentTime, totalEstimatedTime) => {
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

  const handlePrevDate = () => {
    const newDate = new Date(selectedDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set today's time to midnight for accurate comparison

    newDate.setDate(newDate.getDate() - 1);

    // Prevent navigating to a date earlier than today
    if (newDate >= today) {
      setSelectedDate(newDate);
    }
  };

  const handleNextDate = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    setSelectedDate(newDate);
  };

  const fetchBreaksForBooking = async (bookingId) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8080/get_barber_breaks?barber_id=${barberId}&type=Extend`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();

      if (data.success && Array.isArray(data.breaks)) {
        const bookingBreaks = data.breaks.filter(
          (break_) => break_.booking_id === bookingId
        );
        setBreaks(bookingBreaks);
      } else {
        setBreaks([]);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchAvailableSlots = async (date, bookingEndTime) => {
    setLoadingSlots(true);
    try {
      const response = await fetch(
        `http://127.0.0.1:8080/available-slots?barber_id=${barberId}&date=${date}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch available slots");
      }
      const data = await response.json();

      if (data.available_slots && Array.isArray(data.available_slots)) {
        const filteredSlots = filterSlotsAfterBooking(
          data.available_slots,
          bookingEndTime
        );
        setAvailableSlots(filteredSlots);
      } else {
        setAvailableSlots([]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingSlots(false);
    }
  };

  const filterSlotsAfterBooking = (slots, bookingEndTime) => {
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

  const convertSlotToDateTime = (slot) => {
    const [hours, minutes] = slot.split(":").map(Number);
    const now = new Date();
    return new Date(now.setHours(hours, minutes, 0, 0));
  };

  const calculateBookingEndTime = (booking) => {
    const appointmentTime = new Date(booking.appointment_time);
    const totalEstimatedTime = booking.total_estimated_time * 60000;
    return new Date(appointmentTime.getTime() + totalEstimatedTime);
  };

  const handleExtendClick = (booking) => {
    const bookingEndTime = calculateBookingEndTime(booking);
    setSelectedBooking(booking);
    fetchAvailableSlots(booking.appointment_time.split(" ")[0], bookingEndTime);
    fetchBreaksForBooking(booking.booking_id);
    setModalType("extend");
  };

  const handleUpdatePriceClick = (booking) => {
    setSelectedBooking(booking);
    setNewPrice(booking.price);
    setModalType("price");
  };

  const toggleSlotSelection = (slot) => {
    setSelectedSlots((prevSelectedSlots) =>
      prevSelectedSlots.includes(slot)
        ? prevSelectedSlots.filter((s) => s !== slot)
        : [...prevSelectedSlots, slot]
    );
  };

  const handleExtendBookingTime = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8080/add_barber_break_slot`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            booking_id: selectedBooking.booking_id,
            barber_id: barberId,
            break_time: selectedSlots,
            break_date: selectedBooking.appointment_time.split(" ")[0],
            timeType: "Extend",
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to extend booking time");
      }

      const data = await response.json();
      setSuccessMessage("Booking time extended successfully!");
      setTimeout(() => {
        setSuccessMessage("");
        setSelectedBooking(null);
      }, 2000); // Close modal after 2 seconds
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdatePrice = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8080/update_price`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          booking_id: selectedBooking.booking_id,
          new_price: newPrice,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update price");
      }

      const data = await response.json();
      setSuccessMessage("Price updated successfully!");
      setTimeout(() => {
        setSuccessMessage("");
        setSelectedBooking(null); // Close modal after success
      }, 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  // Get the date keys (sorted) from the grouped bookings
  const dateKeys = Object.keys(bookings).sort(
    (a, b) => new Date(a) - new Date(b)
  );

  const formattedSelectedDate = selectedDate.toLocaleDateString("en-GB");

  // Display loading state
  if (loading) {
    return (
      <div className="loading-container">
        <BeatLoader color="gray" size={30} />
        <p>Loading, please wait...</p>
      </div>
    );
  }

  // Display error state
  if (error) {
    return <div>Error: {error}</div>;
  }

  // No bookings available message
  if (dateKeys.length === 0) {
    return <div>No bookings available from today onwards.</div>;
  }

  // Get bookings for selected date
  const bookingsForSelectedDate = bookings[formattedSelectedDate] || [];
  const sortedBookingsForSelectedDate = sortBookingsByStatus(
    bookingsForSelectedDate
  );

  // Count total done, current, and upcoming bookings
  const totalDone = sortedBookingsForSelectedDate.filter(
    (booking) =>
      getBookingStatus(
        booking.appointment_time,
        booking.total_estimated_time
      ) === "done"
  ).length;

  const totalCurrent = sortedBookingsForSelectedDate.filter(
    (booking) =>
      getBookingStatus(
        booking.appointment_time,
        booking.total_estimated_time
      ) === "current"
  ).length;

  const totalUpcoming = sortedBookingsForSelectedDate.filter(
    (booking) =>
      getBookingStatus(
        booking.appointment_time,
        booking.total_estimated_time
      ) === "upcoming"
  ).length;

  return (
    <div className="main_bookings">
      <div className="date-navigation-container">
        <div className="next-prev-date">
          <GrPrevious onClick={handlePrevDate} size={20}>
            Prev
          </GrPrevious>
        </div>
        <div className="date-picker-container">
          <label>
            <SlCalender size={16} />
          </label>
          <label className="layout">
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              dateFormat="E, dd/MM/yyyy"
              minDate={new Date()}
              className="custom-date-picker"
            />
          </label>
        </div>
        <div className="next-prev-date">
          <GrNext onClick={handleNextDate} size={20}>
            Next
          </GrNext>
        </div>
      </div>
      <div className="total-bookings">
        <label>
          Total Bookings:
          {sortedBookingsForSelectedDate.length}
        </label>
        <label>
          Done: <strong> {totalDone}</strong>
        </label>
        <label>
          Current: <strong> {totalCurrent}</strong>
        </label>
        <label>
          Upcoming: <strong>{totalUpcoming}</strong>
        </label>
      </div>

      {sortedBookingsForSelectedDate.length > 0 ? (
        <div className="bookings-container">
          {sortedBookingsForSelectedDate.map((booking) => {
            const status = getBookingStatus(
              booking.appointment_time,
              booking.total_estimated_time
            );

            return (
              <div
                key={booking.booking_id}
                className={`booking-card ${status}`}
              >
                <h4>Booking ID: {booking.booking_id}</h4>
                <p>
                  <strong>Customer Name:</strong> {booking.customer_name}
                </p>
                <p>
                  <strong>Email:</strong> {booking.email}
                </p>
                <p>
                  <strong>Phone:</strong> {booking.phone}
                </p>
                <p>
                  <strong>Service:</strong> {booking.service_name}
                </p>
                <p>
                  <strong>Price:</strong> {booking.price}€
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(booking.appointment_time).toLocaleDateString(
                    "en-GB"
                  )}
                </p>
                <p>
                  <strong>Time:</strong>{" "}
                  {new Date(booking.appointment_time).toLocaleTimeString(
                    "en-GB",
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: false,
                    }
                  )}
                </p>

                <p>
                  <strong>Status:</strong>{" "}
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </p>

                {booking.extra_services &&
                  booking.extra_services.length > 0 && (
                    <div>
                      <strong>Extra Services:</strong>
                      <ul>
                        {booking.extra_services.map((service, index) => (
                          <li key={index}>{service}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                <div className="action-buttons">
                  <button onClick={() => handleUpdatePriceClick(booking)}>
                    Update Price
                  </button>
                  {status !== "done" && (
                    <button onClick={() => handleExtendClick(booking)}>
                      Extend Time
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="empty">No bookings available for the selected date.</p>
      )}

      {/* Modal for updating price */}
      <Modal
        isOpen={!!selectedBooking && modalType === "price"}
        onClose={() => setSelectedBooking(null)}
      >
        {successMessage ? (
          <h4 className="message">{successMessage}</h4>
        ) : (
          <h4>Update Price {selectedBooking?.booking_id}</h4>
        )}
        <div className="price-update">
          <h4>Insert New Price </h4>
          <input
            type="number"
            value={newPrice}
            onChange={(e) => setNewPrice(e.target.value)}
            placeholder="Enter new price"
          />
          <button onClick={handleUpdatePrice}>Update</button>
        </div>
      </Modal>

      {/* Modal for extending booking time */}
      <Modal
        isOpen={!!selectedBooking && modalType === "extend"}
        onClose={() => setSelectedBooking(null)}
      >
        {successMessage ? (
          <h4 className="message">{successMessage}</h4>
        ) : (
          <h4>Extend Booking {selectedBooking?.booking_id}</h4>
        )}

        <div className="slot-selection">
          {loadingSlots ? (
            <div className="loading-container">
              <BeatLoader color="gray" size={20} />
              <p>Loading available slots, please wait...</p>
            </div>
          ) : (
            <>
              {breaks.length > 0 && <h4>Added Times</h4>}
              {breaks.length > 0 && (
                <ul className="break-list">
                  {breaks.map((break_) => (
                    <li key={break_.break_id} className="break-item">
                      {break_.break_time.slice(0, -3)} <br />
                    </li>
                  ))}
                </ul>
              )}

              <h4>Select Available Times</h4>
              <div className="slots-container">
                {availableSlots.length > 0 ? (
                  availableSlots.map((slot, index) => (
                    <div
                      key={index}
                      className={`slot ${
                        selectedSlots.includes(slot) ? "selected" : ""
                      }`}
                      onClick={() => toggleSlotSelection(slot)}
                    >
                      {slot}
                    </div>
                  ))
                ) : (
                  <p>No available times</p>
                )}
              </div>
            </>
          )}
        </div>
        <button onClick={handleExtendBookingTime}>Submit</button>
      </Modal>
    </div>
  );
}

export default Bookings;
