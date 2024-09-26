import React, { useState } from "react";
import { HashLink as Link } from "react-router-hash-link";
import "./NavBar.css";
import { CiMenuBurger } from "react-icons/ci";
import { IoCloseOutline } from "react-icons/io5";
import { NavBarData } from "./Data";

function NavBar() {
  const [menu, setMenu] = useState(false);

  const toggleOpenMenu = () => {
    setMenu(!menu);
  };

  return (
    <nav className="navbar">
      <img alt="Logo" src={""} className="navbar-logo" />

      <div className="menu">
        <ul className="navbar-list">
          {NavBarData.map((item, index) => (
            <li key={index} className="navbar-item">
              <Link smooth to={item.path}>
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="mobile_menu_icon">
        <CiMenuBurger onClick={toggleOpenMenu} size={45} />
        <div className={`mobile_menu ${menu ? "show" : ""}`}>
          <div className="icon">
            <IoCloseOutline onClick={toggleOpenMenu} size={50} />
          </div>
          <ul className="mobile_list">
            {NavBarData.map((item, index) => (
              <li key={index}>
                <Link smooth to={item.path} onClick={toggleOpenMenu}>
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
