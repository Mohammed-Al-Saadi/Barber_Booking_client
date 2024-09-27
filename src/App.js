import Booking from "./Bookings/stepsComponent/mainStepsCom.js";
import Dash from "./dashboard/dash.js";
import Footer from "./footer/Footer.js";
import Login from "./login/Login.js";
import NavBar from "./navBar/NavBar.js";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute.js";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={<ProtectedRoute element={<Dash />} />}
        />
        <Route
          path="/"
          element={
            <>
              <NavBar />
              <Booking />
              <Footer />
            </>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
