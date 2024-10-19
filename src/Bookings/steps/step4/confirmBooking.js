import React, { useState } from "react";
import "./confirmBooking.css";
import { useSelector } from "react-redux";
import BounceLoader from "react-spinners/BounceLoader";
import { FaCheckCircle } from "react-icons/fa";
import { prepareBookingData, handleFormSubmit } from "./confirmBookingUtils";
import { icons, bookingTexts } from "./confirmBookingData";

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
  const selectedServiceName = useSelector(
    (state) => state.services.selectedService
  );
  const selectBarber = useSelector((state) => state.services.selectBarberName);
  const selectBaraerPrice = useSelector(
    (state) => state.services.selectbarberPrice
  );

  // Prepare additional services
  const selectedExtraIds = selectedExtras.map((extra) => extra.service_id);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const bookingData = prepareBookingData(
      name,
      email,
      phone,
      selectedBarberId,
      selectedService,
      selectedDateTime,
      selectBaraerPrice,
      selectedExtraIds
    );

    handleFormSubmit(bookingData, setLoading, setResponseMessage);
  };

  return (
    <div className="part-three-container">
      <div className="width1">
        <h3>Booking Information</h3>
        <div className="redux-values">
          <p>
            <strong>{icons.person}</strong>
            {selectBarber || "None selected"}
          </p>
          <p>
            <strong>{icons.calendar}</strong>
            {selectedDateTime
              ? `${new Date(selectedDateTime).toLocaleDateString("fi-FI", { weekday: "short" })} 
                 ${new Date(selectedDateTime).toLocaleDateString("fi-FI", { day: "numeric", month: "numeric", year: "numeric" })}`
              : "None selected"}
            <strong>{icons.timer}</strong>
            {selectedDateTime
              ? selectedDateTime.split(" ")[1]
              : "None selected"}
          </p>
          <p>
            <strong>{icons.category}</strong>
            {selectedCategory || "None selected"}
          </p>
          <p>
            <strong>{icons.scissors}</strong>
            {selectedServiceName || "None selected"}
          </p>
          {selectedExtras.length > 0 && (
            <p>
              <strong>{icons.cart}</strong>
              {Object.entries(selectedExtras).map(([key, item]) => (
                <div key={key}>
                  {item.name}- {item.price}€
                </div>
              ))}
            </p>
          )}
          <p>
            <strong>{icons.currency}</strong>
            {selectBaraerPrice || "None selected"}
          </p>
          <p>
            <strong>{icons.home}</strong>The Best One barbershop
          </p>
          <p>
            <strong>{icons.location}</strong>Rongankatu 4 C 56, Tampere
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
                  onChange={(e) => setName(e.target.value)}
                  placeholder={bookingTexts.namePlaceholder}
                  required
                />
              </div>
              <div className="input-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={bookingTexts.emailPlaceholder}
                  required
                />
              </div>
              <div className="input-group">
                <label htmlFor="phone">Phone *</label>
                <input
                  type="tel"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={bookingTexts.phonePlaceholder}
                  required
                />
              </div>
              <button type="submit" disabled={loading}>
                {loading ? "Sending..." : bookingTexts.submitButton}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default PartThree;
