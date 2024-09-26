import CategoriesAndServices from "./api/GetServices.js";
import Booking from "./Bookings/stepsComponent/mainStepsCom.js";
import Footer from "./footer/Footer.js";
import NavBar from "./navBar/NavBar.js";
import { BrowserRouter as Router } from "react-router-dom";

function App() {
  return (
    <div>
      <Router>
        <NavBar />
        <Booking />
        <CategoriesAndServices />
        <Footer />
      </Router>
    </div>
  );
}

export default App;
