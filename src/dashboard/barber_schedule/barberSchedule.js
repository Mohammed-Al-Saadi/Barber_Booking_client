import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "./barberSchedule.css";
import BeatLoader from "react-spinners/BeatLoader";
import { getData, postData } from "../../api/apiService";
const BarberSchedule = () => {
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newStartTime, setNewStartTime] = useState("");
  const [newEndTime, setNewEndTime] = useState("");
  const barberId = useSelector((state) => state.services.selectedBarberIdDash);

  // Fetch the barber's schedule when the component mounts or when barberId changes
  useEffect(() => {
    const fetchBarberSchedule = async () => {
      try {
        setLoading(true);
        const data = await getData(`get_barber_schedule?barber_id=${barberId}`);
        setSchedule(data);
        setNewStartTime(data.start_time);
        setNewEndTime(data.end_time);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchBarberSchedule();
  }, [barberId]);

  // Handler for editing schedule
  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  // Handler for saving the updated schedule
  const handleSave = async () => {
    setSaving(true);
    try {
      const data = await postData(`update_barber_schedule`, {
        barber_id: barberId,
        start_time: newStartTime,
        end_time: newEndTime,
      });

      setSchedule(data);
      setIsEditing(false);
      setSaving(false);
    } catch (error) {
      setError(error.message);
      setSaving(false);
    }
  };

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
            <p>Saving...</p>
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
