import { IoPersonCircleOutline } from "react-icons/io5";
import { CiTimer, CiCalendarDate } from "react-icons/ci";
import { LuScissors } from "react-icons/lu";
import { TbCategory } from "react-icons/tb";
import { PiCurrencyEurBold } from "react-icons/pi";
import { MdOutlineHome } from "react-icons/md";
import { GrLocation } from "react-icons/gr";
import { BsCartPlusFill } from "react-icons/bs";

export const icons = {
  person: <IoPersonCircleOutline size={22} />,
  timer: <CiTimer size={22} />,
  calendar: <CiCalendarDate size={22} />,
  scissors: <LuScissors size={22} />,
  category: <TbCategory size={22} />,
  currency: <PiCurrencyEurBold size={21} />,
  home: <MdOutlineHome size={21} />,
  location: <GrLocation size={21} />,
  cart: <BsCartPlusFill size={22} />,
};

// If you want, you can also store static text or other constants here
export const bookingTexts = {
  submitButton: "Submit Booking",
  namePlaceholder: "Enter your name...",
  emailPlaceholder: "Enter your email...",
  phonePlaceholder: "Enter your phone number...",
};
