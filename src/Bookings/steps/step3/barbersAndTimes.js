import React, { useState, useEffect, useRef, useMemo } from "react";
import "./barbersAndTimes.css";
import { useDispatch, useSelector } from "react-redux";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from "react-icons/fa"; // Calendar icon
import { GrNext, GrPrevious } from "react-icons/gr"; // Next/Prev buttons
import {
  selectBarber,
  selectDateTime,
  selectedBarberPrice,
  selectName,
} from "../../../redux/slices";

import BounceLoader from "react-spinners/BounceLoader";
import { PiClockCountdownDuotone } from "react-icons/pi";

import img from "../../../assets/1.jpg";
// Define barber images based on barber_id
const barberImages = {
  1: img, // Replace with actual URLs or paths
  2: img,
  3: img,
  4: img,
  5: img,
};

const Barber = () => {
  const dispatch = useDispatch();
  const selectedService = useSelector(
    (state) => state.services.selectedService
  );
  const selectedBarberId = useSelector(
    (state) => state.services.selectedBarber
  );
  const selectedDateTime = useSelector(
    (state) => state.services.selectedDateTime
  );

  // Local state
  const [barberData, setBarberData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedBarber, setSelectedBarber] = useState(selectedBarberId);
  const [selectedDate, setSelectedDate] = useState(new Date()); // Set initial date to today
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(
    selectedDateTime ? selectedDateTime : null
  );
  const [dayOffset, setDayOffset] = useState(0); // Offset for next/prev buttons
  const [isCalendarOpen, setIsCalendarOpen] = useState(false); // State to control the calendar visibility
  // Retrieve values from Redux
  const selectedExtras = useSelector((state) => state.services.selectedExtras);

  // Memoize the combined services array to avoid re-creating it on every render
  const combinedServices = useMemo(() => {
    const extraNames = selectedExtras.map((extra) => extra.name);
    return [selectedService, ...extraNames]; // This combines the main service and extra services
  }, [selectedService, selectedExtras]);

  // Reference to DatePicker and outside click detection
  const datepickerRef = useRef(null);
  const calendarContainerRef = useRef(null);

  useEffect(() => {
    if (combinedServices) {
      setLoading(true);
      setError(null);

      fetch("http://127.0.0.1:8080/get_barbers_and_slots", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          service_name: combinedServices,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch barber data");
          }
          return response.json();
        })
        .then((data) => {
          console.log("Barber data:", data);
          setBarberData(data.barbers);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setError(err.message);
          setLoading(false);
        });
    }
  }, [combinedServices]); // This effect will only run when combinedServices changes

  useEffect(() => {
    if (selectedBarberId) {
      setSelectedBarber(selectedBarberId);
    }
  }, [selectedBarberId]);

  // When selectedDate or barberData changes, fetch available slots
  useEffect(() => {
    if (selectedDate && barberData && selectedBarber) {
      const dateString = selectedDate.toISOString().split("T")[0];
      const slots = barberData.time_slots[selectedBarber]?.[dateString] || [];
      setAvailableSlots(slots);
    }
  }, [selectedDate, barberData, selectedBarber]);

  const handleBarberSelection = (barberId, barberName, barberPrice) => {
    setSelectedBarber(barberId);
    dispatch(selectBarber(barberId));
    dispatch(selectName(barberName));
    dispatch(selectedBarberPrice(barberPrice));
  };

  const handleSlotSelection = (date, time) => {
    const slotIdentifier = `${date} ${time}`;
    dispatch(selectDateTime(slotIdentifier));
    setSelectedSlot(slotIdentifier);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setDayOffset(0); // Reset dayOffset when a new date is selected
    setIsCalendarOpen(false); // Close calendar on date select
  };

  // Format the date to show "Thursday, 21/09/2024"
  const formatDate = (date) => {
    return date.toLocaleDateString("fi-FI", {
      weekday: "short",
      day: "numeric",
      month: "numeric",
      year: "2-digit",
      timeZone: "Europe/Helsinki",
    });
  };

  const getCurrentDayDate = (offset = 0) => {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + offset);
    return currentDate;
  };

  const moveDay = (offset) => {
    const newDate = getCurrentDayDate(offset);
    setSelectedDate(newDate);
    setDayOffset(offset);
  };

  // Detect clicks outside the calendar to close it
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        calendarContainerRef.current &&
        !calendarContainerRef.current.contains(event.target)
      ) {
        setIsCalendarOpen(false);
      }
    }
    if (isCalendarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCalendarOpen]);

  if (loading) {
    return (
      <div className="loading-indicator-barber">
        <BounceLoader color="#90ee90" size={70} />
        <p>Loading barber's, please wait.</p>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="categories-main">
      {barberData ? (
        <div>
          <div className="barbers-row">
            {barberData.barbers.map((barber) => (
              <div
                key={barber.barber_id}
                onClick={() =>
                  handleBarberSelection(
                    barber.barber_id,
                    barber.name,
                    barber.price
                  )
                }
                className={`barber-item ${
                  selectedBarber === barber.barber_id ? "selected-barber" : ""
                }`}
              >
                {/* Display Barber Image */}
                {barber.price} €
                <img
                  src={barberImages[barber.barber_id]} // Use the image corresponding to barber_id
                  alt={barber.name}
                />
                {barber.name}
                <div className="line"></div>
              </div>
            ))}
          </div>

          {selectedBarber && (
            <div className="calendar-container">
              {/* Next/Previous Day Buttons */}
              <div className="day-navigation">
                <GrPrevious
                  color={dayOffset <= 0 ? "gray" : "white"}
                  className={`icon-border ${dayOffset <= 0 ? "disabled" : ""}`}
                  size={22}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent opening calendar on prev click
                    if (dayOffset > 0) {
                      moveDay(dayOffset - 1);
                    }
                  }}
                />
                {/* Make the date clickable to open the calendar */}
                <div
                  onClick={() => setIsCalendarOpen(true)}
                  style={{ cursor: "pointer" }}
                >
                  {formatDate(selectedDate)}{" "}
                  <FaCalendarAlt size={14} color="gray" />
                </div>
                <GrNext
                  className="icon-border"
                  size={22}
                  color="white"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent opening calendar on next click
                    moveDay(dayOffset + 1);
                  }}
                />
              </div>

              {/* Hidden DatePicker controlled by the navigation click */}
              <div className="calender" ref={calendarContainerRef}>
                <DatePicker
                  ref={datepickerRef}
                  selected={selectedDate}
                  onChange={handleDateChange}
                  open={isCalendarOpen}
                  onClickOutside={() => setIsCalendarOpen(false)}
                  dateFormat="dd/MM/yyyy"
                  minDate={new Date()} // Restrict past dates
                  placeholderText="Select a date"
                  customInput={<div />} // Hide the default input
                />
                <PiClockCountdownDuotone color="gray" size={30} />
              </div>

              {selectedDate && (
                <div className="available-slots">
                  <ul className="time-slot-list">
                    {availableSlots.length > 0 ? (
                      availableSlots.map((slot, index) => {
                        const slotIdentifier = `${
                          selectedDate.toISOString().split("T")[0]
                        } ${slot.Time}`;
                        return (
                          <li
                            key={index}
                            className={`time-slot ${
                              selectedSlot === slotIdentifier
                                ? "selected-slot"
                                : ""
                            }`}
                            onClick={() =>
                              handleSlotSelection(
                                selectedDate.toISOString().split("T")[0],
                                slot.Time
                              )
                            }
                            style={{ cursor: "pointer" }}
                          >
                            {slot.Time}
                          </li>
                        );
                      })
                    ) : (
                      <li className="no-slots">No available times</li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div>
          Select a category and service to view available barbers and time
          slots.
        </div>
      )}
    </div>
  );
};

export default Barber;
