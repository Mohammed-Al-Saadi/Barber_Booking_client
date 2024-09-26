import React from "react";
import "./Footer.css";
import { PiCityDuotone } from "react-icons/pi";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { AiOutlinePhone } from "react-icons/ai";

const Footer = () => {
  return (
    <footer className="section__padding app__footer">
      <div className="app__footer-container">
        <div className="app__footer-content">
          <h3 className="footer__heading">Yhteystiedot</h3>
          <p className="footer__text2">
            <PiCityDuotone />
          </p>
          <p className="footer__text2">
            <MdOutlineAlternateEmail />
          </p>
          <p className="footer__text2">
            <AiOutlinePhone />
          </p>
        </div>
        <div className="app__footer-content">
          <h3 className="footer__heading">Aukioloajat</h3>
          <p className="footer__text">
            {"Maanantai - Lauantai: Sopimuksen mukaan"}
            <br />
            {"Sunnuntai: Suljettu"}
            <br />
          </p>
        </div>
        <div className="app__footer-content">
          <h3 className="footer__heading">Seuraa meitä</h3>
          <div className="footer__social-links">
            <a href="https://example.com" className="footer__social-link">
              <img alt="" src={""} />
            </a>
            <a href="https://example.com" className="footer__social-link">
              <img alt="" src={""} />
            </a>
          </div>
        </div>
      </div>

      <div className="app__footer-bottom">
        <p className="footer__text">
          &copy; {new Date().getFullYear()}
          {" kaikki oikeudet pidätetään."}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
