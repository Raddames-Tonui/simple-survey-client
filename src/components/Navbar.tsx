import React from "react";
import { Link } from "react-router-dom";

const Navbar = (): JSX.Element => {
  return (
    <nav className="flex justify-between bg-blue-500 p-4 text-white">
      <div className="flex items-center ">
        <img src="/survey-icon.webp" alt="" className="h-10 w-10" />
        <p>TumaForm</p>
      </div>
      <ul className="flex space-x-4">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
        <li>
          <Link to="/survey">Survey</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
