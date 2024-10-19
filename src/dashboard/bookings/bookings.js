import React, { useEffect, useState } from "react";
import "./bookings.css";
import BeatLoader from "react-spinners/BeatLoader";
import { useSelector } from "react-redux";
import Modal from "../../ModelView/ModelView";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { SlCalender } from "react-icons/sl";
import { GrNext, GrPrevious } from "react-icons/gr";
import { getData, postData } from "../../api/apiService";
import {
  calculateBookingEndTime,
  groupBookingsByDate,
  sortBookingsByStatus,
  getBookingStatus,
  filterSlotsAfterBooking,
} from "./bookingUtils";

function Bookings() {
  const [bookings, setBookings] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [newPrice, setNewPrice] = useState("");
  const [modalType, setModalType] = useState("");
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [breaks, setBreaks] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const barberId = useSelector((state) => state.services.selectedBarberIdDash);

  // Fetch bookings data
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await getData(`get_todays_bookings?barber_id=${barberId}`);
        if (Array.isArray(data.bookings)) {
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

  const handlePrevDate = () => {
    const newDate = new Date(selectedDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    newDate.setDate(newDate.getDate() - 1);
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
      const data = await getData(
        `get_barber_breaks?barber_id=${barberId}&type=Extend`
      );

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
      const data = await getData(
        `available-slots?barber_id=${barberId}&date=${date}`
      );

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
      const data = await postData(`add_barber_break_slot`, {
        booking_id: selectedBooking.booking_id,
        barber_id: barberId,
        break_time: selectedSlots,
        break_date: selectedBooking.appointment_time.split(" ")[0],
        timeType: "Extend",
      });

      setSuccessMessage("Booking time extended successfully!");
      setTimeout(() => {
        setSuccessMessage("");
        setSelectedBooking(null);
      }, 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdatePrice = async () => {
    try {
      const data = await postData(`update_price`, {
        booking_id: selectedBooking.booking_id,
        new_price: newPrice,
      });

      setSuccessMessage("Price updated successfully!");
      setTimeout(() => {
        setSuccessMessage("");
        setSelectedBooking(null);
      }, 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  const dateKeys = Object.keys(bookings).sort(
    (a, b) => new Date(a) - new Date(b)
  );

  const formattedSelectedDate = selectedDate.toLocaleDateString("en-GB");

  if (loading) {
    return (
      <div className="loading-container">
        <BeatLoader color="gray" size={30} />
        <p>Loading, please wait...</p>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (dateKeys.length === 0) {
    return <div>No bookings available from today onwards.</div>;
  }

  const bookingsForSelectedDate = bookings[formattedSelectedDate] || [];
  const sortedBookingsForSelectedDate = sortBookingsByStatus(
    bookingsForSelectedDate
  );

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
          Done: <strong>{totalDone}</strong>
        </label>
        <label>
          Current: <strong>{totalCurrent}</strong>
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
