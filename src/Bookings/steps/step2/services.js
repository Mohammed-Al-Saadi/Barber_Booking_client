import React, { useState } from "react";
import "./services.css";
import { useDispatch, useSelector } from "react-redux";
import Modal from "../../../ModelView/ModelView.js"; 
import { FaPlusCircle } from "react-icons/fa";
import { selectService, handleExtraChange } from "./serviceUtils";

const ServicesList = ({ items }) => {
  const dispatch = useDispatch();
  const [openServiceId, setOpenServiceId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const additionalServices = useSelector(
    (state) => state.services.additionalServices
  );
  const selectedExtras = useSelector((state) => state.services.selectedExtras);
  const selectedCategory = useSelector(
    (state) => state.services.selectedCategory
  );
  const selectedService = useSelector(
    (state) => state.services.selectedService
  );

  const toggleExtra = (serviceId) => {
    if (openServiceId === serviceId) {
      setOpenServiceId(null);
      setIsModalOpen(false);
    } else {
      setOpenServiceId(serviceId);
      setIsModalOpen(true);
    }
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
                                  dispatch,
                                  selectedService,
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
                                      dispatch,
                                      selectedService,
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
              checked={selectedExtras.some((extra) => extra.name === item.name)} 
              onChange={
                () => handleExtraChange(item, selectedExtras, dispatch) 
              }
            />
            {item.price} €
          </div>
        ))}
      </Modal>
    </div>
  );
};

export default ServicesList;
