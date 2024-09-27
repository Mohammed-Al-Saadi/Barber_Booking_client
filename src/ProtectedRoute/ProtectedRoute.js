import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ element }) => {
  const navigate = useNavigate();
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
  }, [token, navigate]);

  return isAuthenticated ? element : null;
};

export default ProtectedRoute;
