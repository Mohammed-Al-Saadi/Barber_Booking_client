import React, { useState } from "react";
import "./categories.css";
import { useDispatch, useSelector } from "react-redux";
import {
  selectedAdditionalServices,
  setSelectedCategory,
} from "../../../redux/slices";
import { GiBeard, GiScissors } from "react-icons/gi"; // Import additional icons
import { TbColorSwatch } from "react-icons/tb";

const categoryIcons = {
  Leikkaukset: <GiScissors size={80} />, // Icon for Haircuts
  Parta: <GiBeard size={80} />, // Icon for Beard
  Värjäykset: <TbColorSwatch size={80} />, // Icon for Color
  // Add more categories and their corresponding icons as needed
};

const CategoriesList = ({ items }) => {
  const dispatch = useDispatch();
  const selectedCategory = useSelector(
    (state) => state.services.selectedCategory
  );

  const [expandedCategory, setExpandedCategory] = useState(selectedCategory);

  const toggleCategory = (categoryName) => {
    if (expandedCategory !== categoryName) {
      setExpandedCategory(categoryName);
      dispatch(setSelectedCategory(categoryName));
    }
  };

  return (
    <div className="categories-main-container">
      {items ? (
        <div className="categories-services">
          {Object.keys(items).map((categoryName, index) => {
            // Exclude the "Lisäpalvelut" category
            if (categoryName === "Lisäpalvelut") {
              // Access the services from the items object
              const services = items[categoryName]; // Get the services array for "Lisäpalvelut"
              const serviceDetails = services.map((service) => ({
                name: service.service_name,
                estimatedTime: service.estimated_time,
                price: service.price,
                service_id: service.service_id,
              })); // Create an array of objects with service name and estimated time

              dispatch(selectedAdditionalServices(serviceDetails));

              return null; // Skip rendering for this category
            }
            return (
              <div
                key={index}
                className="category-item"
                onClick={() => toggleCategory(categoryName)}
              >
                <label className="category-main-name">
                  {categoryName}
                  <input
                    type="checkbox"
                    checked={expandedCategory === categoryName}
                    onChange={() => toggleCategory(categoryName)}
                  />
                </label>
                <label>{categoryIcons[categoryName] || null}</label>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};

export default CategoriesList;
