import React, { useEffect, useState } from "react";
import "./manage.css";
import { useSelector } from "react-redux";
import BeatLoader from "react-spinners/BeatLoader"; // Loader

function Manage() {
  const [breaks, setBreaks] = useState([]); // Initialize breaks as an empty array
  const [availableSlots, setAvailableSlots] = useState([]); // Initialize available slots as an empty array
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null); // Success message state
  const [showForm, setShowForm] = useState(false); // For showing/hiding the form
  const [newBreakDate, setNewBreakDate] = useState("");
  const [selectedSlots, setSelectedSlots] = useState([]); // For holding the selected break slots (multiple)
  const [loading, setLoading] = useState(false); // Loading state for adding break
  const [deleteLoading, setDeleteLoading] = useState({}); // Loading state for deleting each break
  const [fetchLoading, setFetchLoading] = useState(true); // Loading state for fetching breaks
  const [slotLoading, setSlotLoading] = useState(false); // Loading state for fetching available slots
  const barberId = useSelector((state) => state.services.selectedBarberIdDash);

  // Fetch breaks when component mounts
  useEffect(() => {
    const fetchBreaks = async () => {
      setFetchLoading(true); // Set loading to true before fetching data
      try {
        const response = await fetch(
          `http://127.0.0.1:8080/get_barber_breaks?barber_id=${barberId}&type=Break`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        if (data.success) {
          setBreaks(Array.isArray(data.breaks) ? data.breaks : []);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setFetchLoading(false); // Set loading to false after fetching data
      }
    };

    fetchBreaks();
  }, [barberId]);

  // Fetch available slots when the break date is selected
  useEffect(() => {
    const fetchAvailableSlots = async () => {
      if (newBreakDate) {
        setSlotLoading(true); // Set slot loading state
        try {
          const response = await fetch(
            `http://127.0.0.1:8080/available-slots?barber_id=${barberId}&date=${newBreakDate}`
          );
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
          if (data.available_slots) {
            setAvailableSlots(data.available_slots);
          } else {
            setAvailableSlots([]);
            setError(data.message || "No available slots found.");
          }
        } catch (err) {
          setError(err.message);
        } finally {
          setSlotLoading(false); // Set slot loading to false after fetching slots
        }
      }
    };

    fetchAvailableSlots();
  }, [newBreakDate]);

  const handleAddBreak = async () => {
    if (!newBreakDate || selectedSlots.length === 0) {
      setError("Please select both a date and at least one time.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch(
        "http://127.0.0.1:8080/add_barber_break_slot",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            barber_id: barberId,
            break_date: newBreakDate,
            break_time: selectedSlots, // Send the selected available slots as an array
            timeType: "Break",
            booking_id: 0,
          }),
        }
      );

      if (response.ok) {
        const newBreak = await response.json();
        if (newBreak.breaks) {
          setBreaks([...breaks, ...newBreak.breaks]); // Assuming breaks is an array
        } else {
          setBreaks([...breaks, newBreak]); // Handle a single break if the response doesn't contain an array
        }

        setNewBreakDate(""); // Reset input fields
        setSelectedSlots([]); // Reset selected slots
        setSuccessMessage("Breaks added successfully!"); // Set success message
        setShowForm(false); // Collapse the form after adding a break
        setTimeout(() => setSuccessMessage(null), 2000); // Hide success message after 2 seconds
      } else {
        throw new Error("Failed to add the breaks.");
      }
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(null), 2000); // Hide error message after 2 seconds
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBreak = async (breakId) => {
    setDeleteLoading((prev) => ({ ...prev, [breakId]: true })); // Set loading for specific break
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch(
        `http://127.0.0.1:8080/delete_barber_break?break_id=${breakId}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        setBreaks(breaks.filter((b) => b.break_id !== breakId));
        setSuccessMessage("Break deleted successfully!");
        setTimeout(() => setSuccessMessage(null), 2000); // Hide success message after 2 seconds
      } else {
        throw new Error("Failed to delete the break.");
      }
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(null), 2000); // Hide error message after 2 seconds
    } finally {
      setDeleteLoading((prev) => ({ ...prev, [breakId]: false })); // Reset loading for specific break
    }
  };

  const handleSlotChange = (e) => {
    const value = e.target.value;
    setSelectedSlots((prev) =>
      prev.includes(value)
        ? prev.filter((slot) => slot !== value)
        : [...prev, value]
    );
  };

  return (
    <div className="main-break-component">
      <h3 className="header">Manage Barber Breaks</h3>

      {fetchLoading ? (
        <div className="loading-container">
          <BeatLoader color="gray" size={30} />
          <p>Loading, please wait...</p>
        </div>
      ) : (
        <div className="columns">
          <div className="add-break-column">
            <button className="add-btn" onClick={() => setShowForm(!showForm)}>
              {showForm ? "Hide Add Break" : "Add Break"}
            </button>

            {showForm && (
              <div className="add-break-form">
                <label>Break Date:</label>
                <input
                  type="date"
                  value={newBreakDate}
                  onChange={(e) => setNewBreakDate(e.target.value)}
                />
                {slotLoading ? (
                  <div className="loading-container">
                    <span className="spinner"></span>
                    <p>Loading available slots...</p>
                  </div>
                ) : availableSlots.length > 0 ? (
                  <div className="slot-selection">
                    <p>Select available time slots:</p>
                    <div className="slots-container">
                      {availableSlots.map((slot, index) => (
                        <label key={index} className="slot-item">
                          <input
                            type="checkbox"
                            value={slot}
                            checked={selectedSlots.includes(slot)}
                            onChange={handleSlotChange}
                          />
                          {slot}
                        </label>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p>No available slots for the selected date.</p>
                )}

                <button
                  onClick={handleAddBreak}
                  disabled={loading}
                  className="submit-btn"
                >
                  {loading ? <span className="spinner"></span> : "Submit"}
                </button>
              </div>
            )}
          </div>

          <div className="break-list-column">
            {error && <p className="error-message">{error}</p>}
            {successMessage && (
              <p className="success-message">{successMessage}</p>
            )}

            <div className="break-list">
              {breaks.length === 0 ? (
                <div>
                  <p>No breaks found for this barber.</p>
                </div>
              ) : (
                <ul>
                  {breaks.map((break_) => (
                    <li key={break_.break_id} className="break-item">
                      <label>
                        <strong>Break Date:</strong> {break_.break_date} <br />
                      </label>
                      <label>
                        <strong>Break Time:</strong> {break_.break_time} <br />
                      </label>

                      <button
                        onClick={() => handleDeleteBreak(break_.break_id)}
                        disabled={deleteLoading[break_.break_id]}
                        className="delete-btn"
                      >
                        {deleteLoading[break_.break_id]
                          ? "Deleting..."
                          : "Delete Break"}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Manage;
