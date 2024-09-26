import React, { useEffect, useState } from "react";
import "./GetServices.css";
import { selectedAdditionalServices, setServices } from "../redux/slices"; // Ensure this path is correct
import { useDispatch } from "react-redux";

const CategoriesAndServices = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    fetch("http://127.0.0.1:8080/get_categories_and_services")
      .then((response) => {
        if (!response.ok) {
          console.error("Server error:", response);
          throw new Error(`Failed to fetch: ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data) {
          console.log("Dispatching 333:", data);
          dispatch(setServices(data)); // Dispatch action to set categories

          // Check for "Lisäpalvelut" and dispatch its services
          const additionalServices = data["Lisäpalvelut"];
          if (additionalServices) {
            dispatch(selectedAdditionalServices(additionalServices));
          }
        } else {
          console.error("Unexpected data structure:", data);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        setError(error.message);
        setLoading(false);
      });
  }, [dispatch]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  // Indicate that the fetch and dispatch were successful
  return null; // Return null or a suitable component here
};

export default CategoriesAndServices;
