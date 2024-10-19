import React, { useEffect, useState } from "react";
import "./manageBreaks.css";
import { useSelector } from "react-redux";
import BeatLoader from "react-spinners/BeatLoader";
import { getData, postData, deleteData } from "../../api/apiService";
function Manage() {
  const [breaks, setBreaks] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [newBreakDate, setNewBreakDate] = useState("");
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState({});
  const [fetchLoading, setFetchLoading] = useState(true);
  const [slotLoading, setSlotLoading] = useState(false);
  const barberId = useSelector((state) => state.services.selectedBarberIdDash);

  // Fetch breaks when component mounts
  useEffect(() => {
    const fetchBreaks = async () => {
      setFetchLoading(true);
      try {
        const data = await getData(
          `get_barber_breaks?barber_id=${barberId}&type=Break`
        );
        if (data.success) {
          setBreaks(Array.isArray(data.breaks) ? data.breaks : []);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setFetchLoading(false);
      }
    };

    fetchBreaks();
  }, [barberId]);

  // Fetch available slots when the break date is selected
  useEffect(() => {
    const fetchAvailableSlots = async () => {
      if (newBreakDate) {
        setSlotLoading(true);
        try {
          const data = await getData(
            `available-slots?barber_id=${barberId}&date=${newBreakDate}`
          );
          if (data.available_slots) {
            setAvailableSlots(data.available_slots);
          } else {
            setAvailableSlots([]);
            setError(data.message || "No available slots found.");
          }
        } catch (err) {
          setError(err.message);
        } finally {
          setSlotLoading(false);
        }
      }
    };

    fetchAvailableSlots();
  }, [newBreakDate, barberId]);

  const handleAddBreak = async () => {
    if (!newBreakDate || selectedSlots.length === 0) {
      setError("Please select both a date and at least one time.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const newBreak = await postData("add_barber_break_slot", {
        barber_id: barberId,
        break_date: newBreakDate,
        break_time: selectedSlots,
        timeType: "Break",
        booking_id: 0,
      });

      if (newBreak.breaks) {
        setBreaks([...breaks, ...newBreak.breaks]);
      } else {
        setBreaks([...breaks, newBreak]);
      }

      setNewBreakDate("");
      setSelectedSlots([]);
      setSuccessMessage("Breaks added successfully!");
      setShowForm(false);
      setTimeout(() => setSuccessMessage(null), 2000);
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(null), 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBreak = async (breakId) => {
    setDeleteLoading((prev) => ({ ...prev, [breakId]: true }));
    setError(null);
    setSuccessMessage(null);

    try {
      await deleteData(`delete_barber_break?break_id=${breakId}`);
      setBreaks(breaks.filter((b) => b.break_id !== breakId));
      setSuccessMessage("Break deleted successfully!");
      setTimeout(() => setSuccessMessage(null), 2000);
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(null), 2000);
    } finally {
      setDeleteLoading((prev) => ({ ...prev, [breakId]: false }));
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
