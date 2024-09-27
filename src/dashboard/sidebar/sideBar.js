import React, { useState } from "react";
import "./sideBar.css"; // CSS for styles
import Bookings from "../bookings/bookings";
import Manage from "../manage/manage";
import { Link } from "react-router-dom";

const Sidebar = ({ onSelect }) => {
  const [isOpen, setIsOpen] = useState(true);

  const navItems = [
    { id: 1, name: "Dashboard", component: <Bookings /> },
    { id: 2, name: "Profile", component: <Manage /> },
    { id: 3, name: "Settings", component: <Bookings /> },
    { id: 4, name: "Logout", component: <Manage /> },
  ];

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      <button className="toggle-btn" onClick={toggleSidebar}>
        {isOpen ? "Close" : "Open"}
      </button>
      <ul className="nav-list">
        {navItems.map((item) => (
          <li key={item.id}>
            <button onClick={() => onSelect(item.component)}>
              {item.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
