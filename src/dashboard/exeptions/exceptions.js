import React, { useEffect, useState } from "react";
import "./exceptions.css";
import { useSelector } from "react-redux";
import BeatLoader from "react-spinners/BeatLoader"; // Loader

const BarberExceptions = () => {
  const [exceptions, setExceptions] = useState([]); // State to store fetched exceptions
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const barberId = useSelector((state) => state.services.selectedBarberIdDash);

  // State for the form fields to add new exceptions
  const [exceptionDate, setExceptionDate] = useState("");
  const [customStartTime, setCustomStartTime] = useState("");
  const [customEndTime, setCustomEndTime] = useState("");
  const [isOff, setIsOff] = useState(false);

  // State to control the visibility of the form (collapsible)
  const [isFormVisible, setIsFormVisible] = useState(false);

  // Fetch the existing exceptions from the backend
  useEffect(() => {
    const fetchExceptions = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://127.0.0.1:8080/get_barber_exceptions?barber_id=${barberId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch exceptions.");
        }
        const data = await response.json();
        setExceptions(data); // Set the fetched exceptions
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchExceptions();
  }, [barberId]);

  // Handler for submitting the new exception form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "http://127.0.0.1:8080/insert_barber_exception",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            barber_id: barberId,
            exception_date: exceptionDate,
            custom_start_time: isOff ? null : customStartTime,
            custom_end_time: isOff ? null : customEndTime,
            is_off: isOff,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to insert exception.");
      }

      const newException = await response.json();
      setExceptions([...exceptions, newException]); // Add the new exception to the list
      resetForm();
    } catch (err) {
      setError(err.message);
    }
  };

  // Helper to reset the form
  const resetForm = () => {
    setExceptionDate("");
    setCustomStartTime("");
    setCustomEndTime("");
    setIsOff(false);
    setIsFormVisible(false); // Collapse the form after submission
  };

  // Render loading, error, or the fetched data
  if (loading)
    return (
      <div className="loading-container">
        <BeatLoader color="gray" size={30} />
        <p>Loading, please wait...</p>
      </div>
    );
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="barber-exceptions-container">
      <h3>Barber Exceptions</h3>

      {/* Button to toggle form visibility */}
      <button
        className="toggle-form-button"
        onClick={() => setIsFormVisible(!isFormVisible)}
      >
        {isFormVisible ? "Hide Add Exception" : "Add Exception"}
      </button>

      {/* Collapsible form */}
      {isFormVisible && (
        <form onSubmit={handleSubmit} className="exception-form">
          <div>
            <label htmlFor="exceptionDate">Exception Date:</label>
            <input
              type="date"
              id="exceptionDate"
              value={exceptionDate}
              onChange={(e) => setExceptionDate(e.target.value)}
              required
            />
          </div>

          {!isOff && (
            <>
              <div>
                <label htmlFor="startTime">Custom Start Time:</label>
                <input
                  type="time"
                  id="startTime"
                  value={customStartTime}
                  onChange={(e) => setCustomStartTime(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="endTime">Custom End Time:</label>
                <input
                  type="time"
                  id="endTime"
                  value={customEndTime}
                  onChange={(e) => setCustomEndTime(e.target.value)}
                />
              </div>
            </>
          )}
          <div className="dayoff">
            Mark Day Off
            <label>
              <input
                type="checkbox"
                checked={isOff}
                onChange={(e) => setIsOff(e.target.checked)}
              />
            </label>
          </div>

          <button type="submit">Add Exception</button>
        </form>
      )}

      <h3>Current Exceptions</h3>
      <ul className="exep-content">
        {exceptions.map((exception, index) => (
          <li key={index}>
            <strong>Date:</strong> {exception.exception_date}{" "}
            {exception.is_off ? (
              <span> (Day Off)</span>
            ) : (
              <span>
                <strong>Start Time:</strong> {exception.custom_start_time}{" "}
                <strong>End Time:</strong> {exception.custom_end_time}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BarberExceptions;
