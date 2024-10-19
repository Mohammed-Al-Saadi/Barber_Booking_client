import React, { useEffect, useState } from "react";
import "./exceptions.css";
import { useSelector } from "react-redux";
import BeatLoader from "react-spinners/BeatLoader";
import { getData, postData } from "../../api/apiService";
import { resetForm } from "./exceptionsUtils";
const BarberExceptions = () => {
  const [exceptions, setExceptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const barberId = useSelector((state) => state.services.selectedBarberIdDash);
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
        const data = await getData(
          `get_barber_exceptions?barber_id=${barberId}`
        );
        setExceptions(data);
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
      const newException = await postData("insert_barber_exception", {
        barber_id: barberId,
        exception_date: exceptionDate,
        custom_start_time: isOff ? null : customStartTime,
        custom_end_time: isOff ? null : customEndTime,
        is_off: isOff,
      });

      setExceptions([...exceptions, newException]); 

      // Reset the form after submission using the resetForm utility
      resetForm({
        setExceptionDate,
        setCustomStartTime,
        setCustomEndTime,
        setIsOff,
        setIsFormVisible,
      });
    } catch (err) {
      setError(err.message);
    }
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
