import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "./times.css"; // Import the CSS for styling
import BeatLoader from "react-spinners/BeatLoader"; // Loader

const BarberSchedule = () => {
  const [schedule, setSchedule] = useState(null); // State to store schedule data
  const [loading, setLoading] = useState(true); // Loading state for fetching data
  const [saving, setSaving] = useState(false); // Loading state for saving data
  const [error, setError] = useState(null); // Error state
  const [isEditing, setIsEditing] = useState(false); // Editing state
  const [newStartTime, setNewStartTime] = useState(""); // New start time state
  const [newEndTime, setNewEndTime] = useState(""); // New end time state
  const barberId = useSelector((state) => state.services.selectedBarberIdDash);

  // Fetch the barber's schedule when the component mounts or when barberId changes
  useEffect(() => {
    const fetchBarberSchedule = async () => {
      try {
        setLoading(true); // Start loading when fetching
        const response = await fetch(
          `http://127.0.0.1:8080/get_barber_schedule?barber_id=${barberId}`
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        setSchedule(data); // Set the schedule data from the response
        setNewStartTime(data.start_time); // Initialize newStartTime with existing data
        setNewEndTime(data.end_time); // Initialize newEndTime with existing data
        setLoading(false); // Stop the loading state
      } catch (error) {
        setError(error.message); // Set any error that occurs
        setLoading(false); // Stop the loading state
      }
    };

    fetchBarberSchedule();
  }, [barberId]); // Dependency array, re-fetches if barberId changes

  // Handler for editing schedule
  const handleEdit = () => {
    setIsEditing(!isEditing); // Toggle edit mode
  };

  // Handler for saving the updated schedule
  const handleSave = async () => {
    setSaving(true); // Set saving state to true
    try {
      const response = await fetch(
        `http://127.0.0.1:8080/update_barber_schedule`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            barber_id: barberId,
            start_time: newStartTime,
            end_time: newEndTime,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      setSchedule(data); // Update the schedule with the new times
      setIsEditing(false); // Exit editing mode
      setSaving(false); // Stop saving state
    } catch (error) {
      setError(error.message);
      setSaving(false); // Stop saving state on error
    }
  };

  // Conditional rendering based on loading, saving, error, or successful data fetching
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

  if (!schedule) {
    return <div>No schedule found for barber with ID {barberId}</div>;
  }

  return (
    <div className="barber-schedule-container">
      <h2>Barber Schedule</h2>
      {isEditing ? (
        <div className="edit-schedule">
          <label>
            <strong>Start Time:</strong>
            <input
              type="time"
              value={newStartTime}
              onChange={(e) => setNewStartTime(e.target.value)}
            />
          </label>
          <label>
            <strong>End Time:</strong>
            <input
              type="time"
              value={newEndTime}
              onChange={(e) => setNewEndTime(e.target.value)}
            />
          </label>
          {saving ? (
            <p>Saving...</p> // Show saving message or spinner here
          ) : (
            <>
              <button className="save-button" onClick={handleSave}>
                Save
              </button>
              <button className="cancel-button" onClick={handleEdit}>
                Cancel
              </button>
            </>
          )}
        </div>
      ) : (
        <div>
          <p>
            <strong>Start Time:</strong> {schedule.start_time}
          </p>
          <p>
            <strong>End Time:</strong> {schedule.end_time}
          </p>
          <button className="edit-button" onClick={handleEdit}>
            Edit
          </button>
        </div>
      )}
    </div>
  );
};

export default BarberSchedule;
