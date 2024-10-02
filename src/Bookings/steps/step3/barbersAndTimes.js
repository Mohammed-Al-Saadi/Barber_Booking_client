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
  1: img,
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
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(
    selectedDateTime ? selectedDateTime : null
  );
  const [dayOffset, setDayOffset] = useState(0);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

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
          console.log("Barber data:", data); // Debug line
          setBarberData(data.barbers);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setError(err.message);
          setLoading(false);
        });
    }
  }, [combinedServices]);

  useEffect(() => {
    if (selectedBarberId) {
      setSelectedBarber(selectedBarberId);
    }
  }, [selectedBarberId]);

  // When selectedDate or barberData changes, fetch available slots
  useEffect(() => {
    if (selectedDate && barberData && selectedBarber) {
      const dateString = selectedDate.toLocaleDateString("en-CA"); // Format: YYYY-MM-DD
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
    setDayOffset(0);
    setIsCalendarOpen(false);
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
    currentDate.setDate(currentDate.getDate() + offset); // Adjust for the offset
    return currentDate;
  };

  const moveDay = (offset) => {
    const newDate = getCurrentDayDate(offset);
    setSelectedDate(newDate); // Set the new selected date
    setDayOffset(offset); // Update the offset
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
                {barber.price} €
                <img src={barberImages[barber.barber_id]} alt={barber.name} />
                {barber.name}
                <div className="line"></div>
              </div>
            ))}
          </div>

          {selectedBarber && (
            <div className="calendar-container">
              <div className="day-navigation">
                <GrPrevious
                  color={dayOffset <= 0 ? "gray" : "white"}
                  className={`icon-border ${dayOffset <= 0 ? "disabled" : ""}`}
                  size={22}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (dayOffset > 0) {
                      moveDay(dayOffset - 1);
                    }
                  }}
                />
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
                    e.stopPropagation();
                    moveDay(dayOffset + 1);
                  }}
                />
              </div>

              <div className="calender" ref={calendarContainerRef}>
                <DatePicker
                  ref={datepickerRef}
                  selected={selectedDate}
                  onChange={handleDateChange}
                  open={isCalendarOpen}
                  dateFormat="dd/MM/yyyy"
                  minDate={new Date()}
                  placeholderText="Select a date"
                  customInput={<div />}
                />
                <PiClockCountdownDuotone color="gray" size={30} />
              </div>

              {selectedDate && (
                <div className="available-slots">
                  <ul className="time-slot-list">
                    {availableSlots.length > 0 ? (
                      availableSlots.map((slot, index) => {
                        const slotIdentifier = `${selectedDate.toLocaleDateString(
                          "en-CA"
                        )} ${slot.Time}`;
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
                                selectedDate.toLocaleDateString("en-CA"),
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
