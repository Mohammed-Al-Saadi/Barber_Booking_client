import React, { useState } from "react";
import "./services.css";
import { useDispatch, useSelector } from "react-redux";
import {
  selectedExtraServices,
  selectedServiceId,
  updateSelectedService,
} from "../../../redux/slices.js";
import Modal from "../../../ModelView.js"; // Import the modal component
import { FaPlusCircle } from "react-icons/fa";

const ServicesList = ({ items }) => {
  const dispatch = useDispatch();
  const [openServiceId, setOpenServiceId] = useState(null); // Track which service's extra details are open
  const [isModalOpen, setIsModalOpen] = useState(false); // Track modal visibility

  const additionalServices = useSelector(
    (state) => state.services.additionalServices
  );
  const selectedExtras = useSelector((state) => state.services.selectedExtras);

  // Retrieve values from Redux
  const selectedCategory = useSelector(
    (state) => state.services.selectedCategory
  );
  const selectedService = useSelector(
    (state) => state.services.selectedService
  );

  const selectService = (serviceName, serviceId) => {
    // Reset extra services when a different main service is selected
    if (selectedService !== serviceName) {
      dispatch(selectedExtraServices([])); // Clear selected extras in Redux
    }

    dispatch(updateSelectedService(serviceName));
    dispatch(selectedServiceId(serviceId));
  };

  const toggleExtra = (serviceId) => {
    if (openServiceId === serviceId) {
      setOpenServiceId(null); // Close if already open
      setIsModalOpen(false); // Close the modal
    } else {
      setOpenServiceId(serviceId);
      setIsModalOpen(true); // Open the modal
    }
  };

  const handleExtraChange = (item) => {
    const updatedExtras = selectedExtras.some(
      (extra) => extra.name === item.name
    )
      ? selectedExtras.filter((extra) => extra.name !== item.name) // If already selected, remove it
      : [...selectedExtras, item]; // Otherwise, add it

    dispatch(selectedExtraServices(updatedExtras)); // Dispatch the updated extras to Redux
  };

  return (
    <div className="categories-services-container">
      {items ? (
        <div>
          {Object.keys(items).map((categoryName, categoryIndex) => (
            <div key={categoryIndex}>
              {selectedCategory === categoryName && (
                <div>
                  <ul className="services_prices">
                    {items[categoryName].map((service) => (
                      <li key={service.service_id} className="service-item">
                        <div className="service-card">
                          <label className="service-checkbox">
                            <span
                              className={
                                selectedService === service.service_name
                                  ? "selected"
                                  : ""
                              }
                              onClick={() =>
                                selectService(
                                  service.service_name,
                                  service.service_id
                                )
                              }
                            >
                              <label className="price_time">
                                <label className="space">
                                  <label className="bold padding">
                                    {service.service_name}
                                  </label>
                                </label>
                                <input
                                  type="checkbox"
                                  checked={
                                    selectedService === service.service_name
                                  }
                                  onChange={() =>
                                    selectService(
                                      service.service_name,
                                      service.service_id
                                    )
                                  }
                                />
                              </label>
                              <div className="space2">
                                <label className="time2">
                                  <label>{service.estimated_time} Min</label>
                                </label>
                                <div
                                  className="extra_service"
                                  onClick={() =>
                                    toggleExtra(service.service_id)
                                  }
                                >
                                  <FaPlusCircle
                                    className="arrow-icon"
                                    color="gray"
                                    size={18}
                                  />
                                  <label> Extra services</label>
                                </div>
                              </div>
                            </span>
                          </label>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : null}

      {/* Modal for extra services */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {Object.entries(additionalServices).map(([key, item]) => (
          <div key={key}>
            {item.name} - {item.estimatedTime} Min
            <input
              type="checkbox"
              checked={selectedExtras.some((extra) => extra.name === item.name)} // Check if the service is selected
              onChange={() => handleExtraChange(item)} // Handle selection change
            />
            {item.price} €
          </div>
        ))}
      </Modal>
    </div>
  );
};

export default ServicesList;
