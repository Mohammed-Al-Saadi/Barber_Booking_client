import React, { useState, useEffect } from "react";
import "./nameDate.css";
// BarberInfo Component
const BarberInfo = ({ barberName }) => {
  const [currentDate, setCurrentDate] = useState("");

  // Use useEffect to set the current date when the component mounts
  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-FI", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    setCurrentDate(formattedDate);
  }, []);

  return (
    <div className="main-date-name">
      <label>Hello, {barberName}</label>
      <label>Date: {currentDate}</label>
    </div>
  );
};

export default BarberInfo;
