import React, { useState } from "react";
import "./confirmBooking.css"; // Make sure to create this CSS file for styling
import { useSelector } from "react-redux";
import { CiTimer } from "react-icons/ci";
import { IoPersonCircleOutline } from "react-icons/io5";
import { LuScissors } from "react-icons/lu";
import { TbCategory } from "react-icons/tb";
import { CiCalendarDate } from "react-icons/ci";
import { FaCheckCircle } from "react-icons/fa"; // Import spinner icon
import BounceLoader from "react-spinners/BounceLoader";
import { PiCurrencyEurBold } from "react-icons/pi";
import { MdOutlineHome } from "react-icons/md";
import { GrLocation } from "react-icons/gr";
import { BsCartPlusFill } from "react-icons/bs";

const PartThree = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");

  const selectedExtras = useSelector((state) => state.services.selectedExtras);

  const selectedBarberId = useSelector(
    (state) => state.services.selectedBarber
  );
  const selectedDateTime = useSelector(
    (state) => state.services.selectedDateTime
  );
  const selectedCategory = useSelector(
    (state) => state.services.selectedCategory
  );
  const selectedService = useSelector(
    (state) => state.services.selectedServiceid
  );
  // Extract service IDs from selectedExtras
  const selectedExtraIds = selectedExtras.map((extra) => extra.service_id); // Adjust based on your actual object structure

  const selectedServiceName = useSelector(
    (state) => state.services.selectedService
  );
  const selectBarber = useSelector((state) => state.services.selectBarberName);
  const selectBaraerPrice = useSelector(
    (state) => state.services.selectbarberPrice
  ); // Corrected selector
  // Handle input changes
  const handleNameChange = (e) => setName(e.target.value);
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePhoneChange = (e) => setPhone(e.target.value);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Create the booking data object
    const bookingData = {
      barber_id: selectedBarberId,
      service_id: selectedService,
      customer_name: name,
      appointment_time: selectedDateTime,
      email: email,
      phone: phone,
      price: selectBaraerPrice,
      extra: selectedExtraIds,
    };

    try {
      // Simulate loading for 3 seconds
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Send the data to the backend
      const response = await fetch("http://127.0.0.1:8080/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      const result = await response.json();

      if (response.ok) {
        setResponseMessage("success"); // Set success message
        // Reset input fields after successful booking
        setName("");
        setEmail("");
        setPhone("");
      } else {
        setResponseMessage(`Error: ${result.message}`);
      }
    } catch (error) {
      setResponseMessage("An error occurred while creating the booking.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="part-three-container">
      <div className="width1">
        <h3>Booking Information</h3>

        <div className="redux-values">
          <p>
            <strong>
              <IoPersonCircleOutline size={22} />
            </strong>
            {selectBarber || "None selected"}
          </p>
          <p>
            <strong>
              <CiCalendarDate size={22} />
            </strong>
            {selectedDateTime
              ? `${new Date(selectedDateTime)
                  .toLocaleDateString("fi-FI", { weekday: "short" })
                  .charAt(0)
                  .toUpperCase()}${new Date(selectedDateTime)
                  .toLocaleDateString("fi-FI", { weekday: "short" })
                  .slice(1)} ${new Date(selectedDateTime).toLocaleDateString(
                  "fi-FI",
                  { day: "numeric", month: "numeric", year: "numeric" }
                )}`
              : "None selected"}
            <strong>
              <CiTimer size={22} />
            </strong>
            {selectedDateTime
              ? selectedDateTime.split(" ")[1]
              : "None selected"}{" "}
          </p>
          <p>
            <strong>
              <TbCategory size={22} />
            </strong>{" "}
            {selectedCategory || "None selected"}
          </p>
          <p>
            <strong>
              <LuScissors size={22} />
            </strong>{" "}
            {selectedServiceName || "None selected"}
          </p>
          {selectedExtras.length > 0 && (
            <p>
              <strong>
                <BsCartPlusFill size={22} />
              </strong>
              {Object.entries(selectedExtras).map(([key, item]) => (
                <div key={key}>
                  {item.name}- {item.price}€
                </div>
              ))}
            </p>
          )}
          <p>
            <strong>
              {" "}
              <PiCurrencyEurBold size={21} />
            </strong>
            {selectBaraerPrice || "None selected"}
          </p>
          <p>
            <strong>
              <MdOutlineHome size={21} />
            </strong>
            The Best One barbershop
          </p>
          <p>
            <strong>
              <GrLocation size={21} />
            </strong>
            Rongankatu 4 C 56, Tampere
          </p>
        </div>
      </div>
      <div className="width">
        {loading ? (
          <div className="loading-indicator">
            <BounceLoader color="#90ee90" size={70} />
            <p>Booking in progress, please wait.</p>
          </div>
        ) : responseMessage === "success" ? (
          <div className="success-message">
            <FaCheckCircle size={90} color="green" />
            <p>
              Thank you for your booking! Please check your email for booking
              information.
            </p>
          </div>
        ) : (
          <>
            <h3>Personal Information</h3>
            {responseMessage && (
              <p className="response-message">{responseMessage}</p>
            )}

            <form className="input-form" onSubmit={handleSubmit}>
              <div className="input-group">
                <label htmlFor="name">Name *</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={handleNameChange}
                  placeholder="Enter your name..."
                  required
                />
              </div>
              <div className="input-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="Enter your email..."
                  required
                />
              </div>
              <div className="input-group">
                <label htmlFor="phone">Phone *</label>
                <input
                  type="tel"
                  id="phone"
                  value={phone}
                  onChange={handlePhoneChange}
                  placeholder="Enter your phone number"
                  required
                />
              </div>
              <button type="submit" disabled={loading}>
                {loading ? "Sending..." : "Submit Booking"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default PartThree;
