import React, { useState } from "react";
import "./dash.css";
import Sidebar from "../sidebar/sideBar";
import Bookings from "../bookings/bookings";
import BarberInfo from "../nameDate/nameDate";
import { useSelector } from "react-redux";

function Dash() {
  const [activeComponent, setActiveComponent] = useState(<Bookings />);
  const barberName = useSelector(
    (state) => state.services.selectedBarberNameDash
  );

  return (
    <div className="main_dash_container">
      <div className="side_bar_pos">
        <Sidebar onSelect={setActiveComponent} />
      </div>
      <div className="content">
        <BarberInfo barberName={barberName} />
        {activeComponent} {/* Render the active component here */}
      </div>
    </div>
  );
}

export default Dash;
