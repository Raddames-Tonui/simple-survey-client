import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FiMenu, FiX } from "react-icons/fi";

const Navbar = (): JSX.Element => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? "text-[#0190B0] border-b-2 border-[#0190B0]" : "text-gray-700";

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const Links = () => (
    <>
      <li>
        <NavLink to={user ? "/survey/create" : "/"} className={linkClass}>
          {user ? "Create" : "Home"}
        </NavLink>
      </li>
      <li>
        <NavLink to="/survey/user-surveys" className={linkClass}>
          Survey
        </NavLink>
      </li>
      {user && (
        <li>
          <NavLink to="/survey/response" className={linkClass}>
            Response
          </NavLink>
        </li>
      )}
      <li>
        {user ? (
          <button onClick={logout} className="text-gray-700">
            Logout
          </button>
        ) : (
          <NavLink to="/auth/login" className="text-gray-700">
            Sign In
          </NavLink>
        )}
      </li>
    </>
  );

  return (
    <>
      {/* Overlay Blur Behind Navbar */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 top-[10vh] bg-black/5  z-10 "
          onClick={toggleMenu}
        />
      )}

      {/* Navbar */}
      <nav className="bg-white h-[10vh] w-full shadow-sm fixed top-0 left-0 right-0 z-30">
        <div className="flex justify-between items-center w-full md:max-w-[80vw] lg:max-w-[70vw] mx-auto h-full px-4 md:px-0">
          {/* Logo */}
          <NavLink to={user ? "/survey/user-surveys" : "/"}>
            <img src="/survey-icon.webp" alt="Home" className="h-10 w-10" />
          </NavLink>

          {/* Desktop Links */}
          <ul className="hidden md:flex items-center space-x-6 font-semibold text-md">
            <Links />
          </ul>

          {/* Mobile Toggle Button */}
          <button onClick={toggleMenu} className="md:hidden z-40 ">
            {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed top-[10vh] right-0 h-[40vh] w-2/4 bg-white shadow-md z-20">
          <ul className="flex flex-col gap-y-10 h-full  items-center px-6 py-8 text-md font-semibold">
            <Links />
          </ul>
        </div>
      )}
    </>
  );
};

export default Navbar;
