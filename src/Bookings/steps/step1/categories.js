import React, { useState, useEffect } from "react";
import "./categories.css";
import { useDispatch, useSelector } from "react-redux";
import { handleAdditionalServices, toggleCategory } from "./categoryUtils";
import { categoryIcons } from "./categoryData";

const CategoriesList = ({ items }) => {
  const dispatch = useDispatch();
  const selectedCategory = useSelector(
    (state) => state.services.selectedCategory
  );
  const [expandedCategory, setExpandedCategory] = useState(selectedCategory);

  // Handle additional services ("Lisäpalvelut")
  useEffect(() => {
    if (items && items["Lisäpalvelut"]) {
      handleAdditionalServices(items, dispatch);
    }
  }, [items, dispatch]);

  return (
    <div className="categories-main-container">
      {items ? (
        <div className="categories-services">
          {Object.keys(items).map((categoryName, index) => {
            // Exclude the "Lisäpalvelut" category from rendering
            if (categoryName === "Lisäpalvelut") {
              return null;
            }

            return (
              <div
                key={index}
                className="category-item"
                onClick={() =>
                  toggleCategory(
                    categoryName,
                    expandedCategory,
                    setExpandedCategory,
                    dispatch
                  )
                }
              >
                <label className="category-main-name">
                  {categoryName}
                  <input
                    type="checkbox"
                    checked={expandedCategory === categoryName}
                    onChange={() =>
                      toggleCategory(
                        categoryName,
                        expandedCategory,
                        setExpandedCategory,
                        dispatch
                      )
                    }
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
