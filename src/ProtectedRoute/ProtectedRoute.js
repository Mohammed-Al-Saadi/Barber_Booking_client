import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectedBarberDashName, selectedBarberDashId } from "../redux/slices";

const ProtectedRoute = ({ element }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const token = useSelector((state) => state.services.authBarnerId); // Access the token from Redux
  useEffect(() => {
    const checkSession = async () => {
      console.log("Checking session with token:", token);

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch("http://127.0.0.1:8080/protected", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Session expired");
        }
        const data = await response.json();
        // Convert expiration date to a readable format
        const expirationDate = new Date(data.expiration_date);
        const now = new Date();
        // Log the readable expiration date
        //console.log("Expiration Date (Readable):", expirationDate.toLocaleString());
        //console.log("Current Time (Readable):", now.toLocaleString());
        if (expirationDate > now) {
          setIsAuthenticated(true);
          dispatch(selectedBarberDashName(data.barber_name));
          dispatch(selectedBarberDashId(data.barber_id));
        } else {
          console.log("Session expired, redirecting to login");
          navigate("/login");
        }
      } catch (error) {
        console.error("Session check failed:", error);
        navigate("/login");
      }
    };

    checkSession();
  }, [token, navigate, dispatch]);

  return isAuthenticated ? element : null;
};

export default ProtectedRoute;
