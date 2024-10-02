import React, { useState } from "react";
import "./mainStepsCom.css"; // Optional CSS file for styling
import { useSelector } from "react-redux";
import Barber from "../steps/step3/barbersAndTimes.js";
import CategoriesList from "../steps/step1/categories.js";
import PartThree from "../steps/step4/confirmBooking.js";
import ServicesList from "../steps/step2/services.js";
import { GrNext, GrPrevious } from "react-icons/gr";
import CategoriesAndServices from "../../api/GetServices.js";

const Booking = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const categories = useSelector((state) => state.services.categories);
  const selectedCategory = useSelector(
    (state) => state.services.selectedCategory
  );
  const selectedService = useSelector(
    (state) => state.services.selectedService
  );
  const selectedBarber = useSelector(
    (state) => state.services.selectBarberName
  );
  const selectedDataTime = useSelector(
    (state) => state.services.selectedDateTime
  );

  // Navigation labels
  const steps = ["Category", "Services", "Barbers", "Confirm"];

  // Render different content based on the current step
  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return <CategoriesList items={categories} />;
      case 1:
        return (
          <div>
            <ServicesList items={categories} />
          </div>
        );
      case 2:
        return (
          <div>
            <Barber items={categories} />
          </div>
        );
      case 3:
        return (
          <div>
            <PartThree />
          </div>
        );
      case 4:
        return (
          <div>
            <PartThree />
          </div>
        );
      default:
        return null;
    }
  };

  // Function to go to the next step
  const goToNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Function to go to the previous step
  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Determine if "Next" button should be disabled
  const isNextDisabled =
    (currentStep === 0 && !selectedCategory) || // Disable if on step 0 and no category selected
    (currentStep === 1 && !selectedService) || // Disable if on step 1 and no service selected
    (currentStep === 2 && !selectedDataTime) ||
    (currentStep === 2 && !selectedBarber);

  return (
    <section id="service" className="booking-container">
      <CategoriesAndServices />;
      <nav className="booking-nav">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`nav-item ${index <= currentStep ? "active" : ""}`}
          >
            {step}
          </div>
        ))}
      </nav>
      <div className="navigation-buttons">
        <button onClick={goToPreviousStep} disabled={currentStep === 0}>
          <GrPrevious color="white" size={20} />
          Previous
        </button>
        {currentStep < steps.length - 1 && ( // Only show the "Next" button if not on the last step
          <button onClick={goToNextStep} disabled={isNextDisabled}>
            Next
            <GrNext color="white" size={20} />
          </button>
        )}
      </div>
      <div className="step-content">{renderStepContent(currentStep)}</div>
    </section>
  );
};

export default Booking;
