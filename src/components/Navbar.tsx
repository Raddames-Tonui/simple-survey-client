import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = (): JSX.Element => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white h-[10vh] w-full">
      <div className="flex justify-between items-center w-full md:max-w-[80vw] lg:max-w-[70vw] mx-auto h-full px-4 md:px-0">
        <div className="flex items-center">
          <img src="/survey-icon.webp" alt="" className="h-10 w-10" />
          <p className="text-lg font-bold ">JazaForm</p>
        </div>
        <div className="flex items-center justify-center space-x-4">
          {user ? (
            <>
              <ul className="flex space-x-4 font-semibold text-md">
                <li>
                  <Link to="/create">Create</Link>
                </li>
                <li>
                  <Link to="/survey">Survey</Link>
                </li>
                <li>
                  <Link to="/response">Response</Link>
                </li>
              </ul>
              <button
                onClick={logout}
                className="relative w-24 h-10 rounded-3xl text-sm font-inherit border-none overflow-hidden z-10 bg-gradient-to-r from-[#0190B0] to-[#24C8ED] hover:from-[#4A8A98] transition-all duration-500 ring-slate-900 hover:ring-2 hover:ring-[#173B3F] font-semibold text-white"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <ul className="flex space-x-4 font-semibold text-md">
                <li>
                  <Link to="/">Home</Link>
                </li>

                <li>
                  <Link to="/survey">Survey</Link>
                </li>
              </ul>
              <NavLink
                to="/auth/login"
                className="relative w-24 h-10 flex items-center justify-center rounded-3xl text-sm font-inherit border-none overflow-hidden z-10 bg-gradient-to-r from-[#0190B0] to-[#24C8ED] hover:from-[#4A8A98] transition-all duration-500 ring-slate-900 hover:ring-2 hover:ring-[#173B3F] font-semibold text-white"
              >
                Sign In
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
