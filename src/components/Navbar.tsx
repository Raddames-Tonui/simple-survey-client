import React from "react";
import { Link } from "react-router-dom";

const Navbar = (): JSX.Element => {
  return (
    <nav className="bg-white h-[10vh] w-full">
      <div className="flex justify-between items-center w-full max-w-screen-xl mx-auto h-full px-4">
        <div className="flex items-center">
          <img src="/survey-icon.webp" alt="" className="h-10 w-10" />
          <p className="text-lg font-bold text-xl">TumaForm</p>
        </div>
        <ul className="flex space-x-4 font-semibold text-lg">
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
      </div>
    </nav>
  );
};

export default Navbar;
