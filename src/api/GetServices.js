import React, { useEffect, useState } from "react";
import { selectedAdditionalServices, setServices } from "../redux/slices"; 
import { useDispatch } from "react-redux";
import { getData } from "../apiService"; 

const CategoriesAndServices = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    getData("/get_categories_and_services") 
      .then((data) => {
        if (data) {
          dispatch(setServices(data)); 
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

  return null;
};

export default CategoriesAndServices;
