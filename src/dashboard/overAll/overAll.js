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
import { formatEvents, calculateTimeRange, isFreeSlot } from "./overallUtils";

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
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [minTime, setMinTime] = useState(null);
  const [maxTime, setMaxTime] = useState(null);

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
        console.log("Fetched data:", data);

        if (data.length === 0) {
          setEvents([]);
        } else {
          setAppointments(data);
          const formattedEvents = formatEvents(data);
          setEvents(formattedEvents);

          const { minTime, maxTime } = calculateTimeRange(data);
          setMinTime(minTime || new Date("1970-01-01T08:00:00"));
          setMaxTime(maxTime || new Date("1970-01-01T18:00:00"));
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
        setEvents([]);
      }
    };

    fetchAppointments();
  }, [selectedDate]);

  // Custom function to handle Next and Previous button clicks
  const handlePrevDay = () => {
    setSelectedDate((prevDate) => {
      const previousDay = moment(prevDate).subtract(1, "day");

      // Prevent navigation to past dates
      if (previousDay.isBefore(moment(), "day")) {
        return prevDate;
      }

      return previousDay.toDate();
    });
  };

  const handleNextDay = () => {
    setSelectedDate((prevDate) => moment(prevDate).add(1, "day").toDate());
  };

  const CustomTimeSlotWrapper = ({ children, value }) => {
    const currentSlot = moment(value).format("HH:mm");
    const isFree = isFreeSlot(events, currentSlot);

    return (
      <div>
        {children}
        {isFree && <div className="free-slot-text">No Booking</div>}
      </div>
    );
  };
  const handleNavigate = (newDate) => {
    setSelectedDate(newDate);
  };

  const eventPropGetter = (event) => {
    let style = {};

    if (event.resource.type === "appointment") {
      style = {
        backgroundColor: "#28a745",
        color: "white",
        borderRadius: "4px",
        padding: "8px",
        border: "1px solid #1e7e34",
        textAlign: "center",
        border: "none",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      };
    } else if (event.resource.type === "break") {
      style = {
        backgroundColor: "#dc3545",
        color: "white",
        borderRadius: "4px",
        padding: "8px",
        border: "1px solid #c82333",
        border: "none",
        textAlign: "center",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      };
    } else if (event.resource.type === "extended") {
      style = {
        backgroundColor: "#ffc107",
        color: "black",
        borderRadius: "4px",
        border: "none",
        padding: "8px",
        border: "1px solid #e0a800",
        textAlign: "center",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
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
          <GrPrevious size={20} onClick={handlePrevDay} className="btn-prev">
            Previous
          </GrPrevious>
        </div>
        <div className="db-bg2">
          <IoCalendarOutline size={18} />
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="EE, yyyy-MM-dd"
            className="custom-datepicker"
            minDate={new Date()}
          />
        </div>

        <div className="db-bg">
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
        date={selectedDate} // Controlled `date`
        onNavigate={handleNavigate} // Add the `onNavigate` handler
        components={{
          toolbar: CustomToolbar,
          timeSlotWrapper: CustomTimeSlotWrapper,
        }}
        min={minTime || new Date("1970-01-01T08:00:00")}
        max={maxTime || new Date("1970-01-01T18:00:00")}
      />
    </div>
  );
};

export default OverAll;
