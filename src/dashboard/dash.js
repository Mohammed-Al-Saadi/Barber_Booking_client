import React, { useState } from "react";
import "./dash.css";
import Sidebar from "./sidebar/sideBar";
import Bookings from "./bookings/bookings";

function Dash() {
  const [activeComponent, setActiveComponent] = useState(<Bookings />); // Default component

  return (
    <div className="main_dash_container">
      <Sidebar onSelect={setActiveComponent} />
      <div className="content">
        {activeComponent} {/* Render the active component here */}
      </div>
    </div>
  );
}

// Sample component implementations

export default Dash;
