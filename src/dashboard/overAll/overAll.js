import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./OverAll.css";
import { GrNext } from "react-icons/gr";
import { GrPrevious } from "react-icons/gr";
import { IoCalendarOutline } from "react-icons/io5";

// Setup moment.js localizer for react-big-calendar
const localizer = momentLocalizer(moment);

// Custom Toolbar to remove Next and Today buttons
const CustomToolbar = ({ label }) => (
  <div className="rbc-toolbar">
    <span className="rbc-toolbar-label">{label}</span>
  </div>
);

const OverAll = () => {
  const [appointments, setAppointments] = useState([]);
  const [events, setEvents] = useState([]); // Store formatted events for the calendar
  const [selectedDate, setSelectedDate] = useState(new Date()); // Store the selected date
  const [minTime, setMinTime] = useState(null); // Store the minimum time for the day
  const [maxTime, setMaxTime] = useState(null); // Store the maximum time for the day

  // Fetch data from the backend based on the selected date
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const formattedDate = moment(selectedDate).format("YYYY-MM-DD");
        const response = await fetch(
          `http://127.0.0.1:8080/barber?barber_id=1&date=${formattedDate}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();

        // Clear events state before setting new data
        setEvents([]);

        if (data.length === 0) {
          setEvents([]); // Clear events if no bookings are returned
        } else {
          setAppointments(data);
          formatEvents(data); // Format appointments into calendar events
          calculateTimeRange(data); // Set the min and max time based on the data
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
        setEvents([]); // Clear events in case of error or no data
      }
    };

    fetchAppointments();
  }, [selectedDate]); // Refetch appointments when selectedDate changes

  // Function to format appointments and breaks into calendar events
  const formatEvents = (appointmentsByDate) => {
    const formattedEvents = [];
    const addedBreakTimes = new Set(); // Track break times to avoid duplicates

    // Loop through each date
    appointmentsByDate.forEach(({ date, appointments }) => {
      // Loop through each appointment
      appointments.forEach(
        ({ appointment_time, appointment_end_time, breaks }) => {
          // Create the start and end times using the date + time combination for appointments
          if (appointment_time && appointment_end_time) {
            formattedEvents.push({
              title: "Appointment", // No need to include time in the title
              start: new Date(`${date}T${appointment_time}`),
              end: new Date(`${date}T${appointment_end_time}`), // Use appointment_end_time for the end
              allDay: false,
              resource: {
                type: "appointment",
              },
            });
          }

          // Add breaks as separate events, but only if not already added for this time
          breaks.forEach((breakObj) => {
            const { break_date, break_time, break_type } = breakObj;
            const breakKey = `${break_date}T${break_time}`; // Unique identifier for each break time

            if (break_date && break_time && !addedBreakTimes.has(breakKey)) {
              // Calculate the break end time by adding 15 minutes to the break start time
              const breakStartTime = moment(`${break_date}T${break_time}`);
              const breakEndTime = breakStartTime.clone().add(15, "minutes");

              formattedEvents.push({
                title: break_type === "Extend" ? "Extended" : "Break", // No need to include time in the title
                start: breakStartTime.toDate(),
                end: breakEndTime.toDate(),
                allDay: false,
                resource: {
                  type: break_type === "Extend" ? "extended" : "break",
                },
              });
              addedBreakTimes.add(breakKey); // Mark this break time as added
            }
          });
        }
      );
    });

    setEvents(formattedEvents); // Ensure that the events state is reset every time
  };

  // Function to calculate the min and max times from the response data
  const calculateTimeRange = (appointmentsByDate) => {
    let minTime = null;
    let maxTime = null;

    appointmentsByDate.forEach(({ appointments }) => {
      appointments.forEach(({ start_time, end_time }) => {
        const startTime = new Date(`1970-01-01T${start_time}`);
        const endTime = new Date(`1970-01-01T${end_time}`);

        if (!minTime || startTime < minTime) {
          minTime = startTime;
        }
        if (!maxTime || endTime > maxTime) {
          maxTime = endTime;
        }
      });
    });

    setMinTime(minTime);
    setMaxTime(maxTime);
  };

  // Custom function to handle Next and Previous button clicks
  const handlePrevDay = () => {
    setSelectedDate((prevDate) => {
      const previousDay = moment(prevDate).subtract(1, "day");

      // Prevent navigation to past dates
      if (previousDay.isBefore(moment(), "day")) {
        return prevDate; // Don't update the date if it's before today
      }

      return previousDay.toDate();
    });
  };

  const handleNextDay = () => {
    setSelectedDate((prevDate) => moment(prevDate).add(1, "day").toDate());
  };

  const CustomTimeSlotWrapper = ({ children, value }) => {
    const currentSlot = moment(value).format("HH:mm");
    const isFree = !events.some((event) => {
      const eventStart = moment(event.start).format("HH:mm");
      const eventEnd = moment(event.end).format("HH:mm");
      return currentSlot >= eventStart && currentSlot < eventEnd; // Check if the time slot is within any event
    });

    return (
      <div>
        {children}
        {isFree && <div className="free-slot-text">No Booking</div>}
      </div>
    );
  };

  const eventPropGetter = (event) => {
    let style = {};

    if (event.resource.type === "appointment") {
      style = {
        backgroundColor: "#28a745", // Green for appointments
        color: "white",
        borderRadius: "4px",
        padding: "8px",
        border: "1px solid #1e7e34",
        textAlign: "center",
        border: "none",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Add a subtle box shadow
      };
    } else if (event.resource.type === "break") {
      style = {
        backgroundColor: "#dc3545", // Red for regular breaks
        color: "white",
        borderRadius: "4px",
        padding: "8px",
        border: "1px solid #c82333",
        border: "none",
        textAlign: "center",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Add a subtle box shadow
      };
    } else if (event.resource.type === "extended") {
      style = {
        backgroundColor: "#ffc107", // Yellow for extended breaks
        color: "black",
        borderRadius: "4px",
        border: "none",
        padding: "8px",
        border: "1px solid #e0a800",
        textAlign: "center",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Add a subtle box shadow
      };
    }

    return { style };
  };

  return (
    <div className="overall-container">
      <h2>Barber's Schedule</h2>

      {/* Next and Previous buttons */}
      <div className="date-navigation">
        <div className="db-bg">
          {" "}
          <GrPrevious size={20} onClick={handlePrevDay} className="btn-prev">
            Previous
          </GrPrevious>
        </div>
        <div className="db-bg2">
          <IoCalendarOutline size={18} />
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)} // Update selected date
            dateFormat="EE, yyyy-MM-dd"
            className="custom-datepicker"
            minDate={new Date()} // Disable past dates
          />
        </div>

        <div className="db-bg">
          {" "}
          <GrNext size={20} onClick={handleNextDay} className="btn-next">
            Next
          </GrNext>
        </div>
      </div>

      {/* Calendar Component */}
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        className="custom-calendar"
        defaultView="day"
        views={["day"]}
        step={15}
        timeslots={1}
        eventPropGetter={eventPropGetter}
        date={selectedDate}
        components={{
          toolbar: CustomToolbar,
          timeSlotWrapper: CustomTimeSlotWrapper, // Use the custom wrapper
        }}
        min={minTime}
        max={maxTime}
      />
    </div>
  );
};

export default OverAll;
