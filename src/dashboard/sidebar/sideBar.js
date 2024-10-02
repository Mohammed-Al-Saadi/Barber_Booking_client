import React, { useState } from "react";
import "./sideBar.css"; // CSS for styles
import Bookings from "../bookings/bookings";
import Manage from "../manage/manage";
import { CiMenuFries } from "react-icons/ci";
import { AiOutlineLogout, AiOutlineCalendar } from "react-icons/ai";
import { MdOutlineFreeBreakfast } from "react-icons/md";
import BarberSchedule from "../times/times";
import BarberExceptions from "../exeptions/exceptions";
import { TbClockHour5 } from "react-icons/tb";
import { IoCloseOutline } from "react-icons/io5";
import logo from "../../assets/logo.png";
import { BiCalendar } from "react-icons/bi";
import OverAll from "../overAll/overAll";
import { AiOutlineException } from "react-icons/ai";

const Sidebar = ({ onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Array of navigation items with icons
  const navItems = [
    {
      id: 6,
      name: "Overview",
      component: <OverAll />,
      icon: <BiCalendar color="white" size={40} />,
    },
    {
      id: 1,
      name: "Bookings",
      component: <Bookings />,
      icon: <AiOutlineCalendar color="white" size={40} />,
    },
    {
      id: 2,
      name: "Breaks",
      component: <Manage />,
      icon: <MdOutlineFreeBreakfast color="white" size={40} />,
    },
    {
      id: 3,
      name: "Opening Hours",
      component: <BarberSchedule />,
      icon: <TbClockHour5 color="white" size={40} />,
    },
    {
      id: 4,
      name: "Custom Schedule",
      component: <BarberExceptions />,
      icon: <AiOutlineException color="white" size={40} />,
    },
    {
      id: 5,
      name: "Logout",
      component: <Manage />,
      icon: <AiOutlineLogout color="white" size={40} />,
    },
  ];

  // Function to toggle the sidebar open/close
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Function to handle selection of a navigation item and close the sidebar
  const handleSelect = (component) => {
    onSelect(component); // Trigger the parent onSelect handler
    setIsOpen(false); // Close the sidebar after selection
  };

  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="sidebae-icon">
        {!isOpen ? (
          <CiMenuFries
            className="icon-side"
            onClick={toggleSidebar}
            color="white"
            size={40}
          />
        ) : (
          <IoCloseOutline
            className="icon-side"
            onClick={toggleSidebar}
            color="white"
            size={40}
          />
        )}
      </div>
      <img alt="dd" src={logo}></img>

      <ul className="nav-list">
        {navItems.map((item) => (
          <div className="icon-container" key={item.id}>
            {/* Hide the icon when sidebar is open */}
            {!isOpen && (
              <div onClick={() => handleSelect(item.component)}>
                {item.icon}
              </div>
            )}
            <li>
              <button onClick={() => handleSelect(item.component)}>
                <span className="nav-item-text">{item.name}</span>
              </button>
            </li>
          </div>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
