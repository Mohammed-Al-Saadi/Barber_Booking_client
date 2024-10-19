// overallUtils.js
import moment from "moment";

// Format appointments and breaks into calendar events
export const formatEvents = (appointmentsByDate) => {
  const formattedEvents = [];
  const addedBreakTimes = new Set();

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
            end: new Date(`${date}T${appointment_end_time}`),
            allDay: false,
            resource: {
              type: "appointment",
            },
          });
        }

        // Add breaks as separate events, but only if not already added for this time
        breaks.forEach((breakObj) => {
          const { break_date, break_time, break_type } = breakObj;
          const breakKey = `${break_date}T${break_time}`;

          if (break_date && break_time && !addedBreakTimes.has(breakKey)) {
            // Calculate the break end time by adding 15 minutes to the break start time
            const breakStartTime = moment(`${break_date}T${break_time}`);
            const breakEndTime = breakStartTime.clone().add(15, "minutes");

            formattedEvents.push({
              title: break_type === "Extend" ? "Extended" : "Break",
              start: breakStartTime.toDate(),
              end: breakEndTime.toDate(),
              allDay: false,
              resource: {
                type: break_type === "Extend" ? "extended" : "break",
              },
            });
            addedBreakTimes.add(breakKey);
          }
        });
      }
    );
  });

  return formattedEvents;
};

// Calculate the min and max time range from the response data
export const calculateTimeRange = (appointmentsByDate) => {
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

  return { minTime, maxTime };
};

// Check if the current slot is free (no booking)
export const isFreeSlot = (events, currentSlot) => {
  return !events.some((event) => {
    const eventStart = moment(event.start).format("HH:mm");
    const eventEnd = moment(event.end).format("HH:mm");
    return currentSlot >= eventStart && currentSlot < eventEnd;
  });
};
