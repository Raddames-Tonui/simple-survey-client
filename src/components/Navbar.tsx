import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FiMenu, FiX } from "react-icons/fi";

const Navbar = (): JSX.Element => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? "text-[#0190B0] border-b-2 border-[#0190B0]" : "text-gray-700";

  const Links = () => (
    <>
      {user ? (
        <>
          <li>
            <NavLink to="/survey/create" className={linkClass}>
              Create
            </NavLink>
          </li>
          <li>
            <NavLink to="/survey/user-surveys" className={linkClass}>
              Survey
            </NavLink>
          </li>
          <li>
            <NavLink to="/survey/response" className={linkClass}>
              Response
            </NavLink>
          </li>
          <li>
            <button
              onClick={() => logout()}
              className="relative w-24 h-10 rounded-3xl text-sm font-inherit border-none overflow-hidden z-10 bg-gradient-to-r from-[#0190B0] to-[#24C8ED] hover:from-[#4A8A98] transition-all duration-500 ring-slate-900 hover:ring-2 hover:ring-[#173B3F] font-semibold text-white"
            >
              Logout
            </button>
          </li>
        </>
      ) : (
        <>
          <li>
            <NavLink to="/" className={linkClass}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/survey/list" className={linkClass}>
              Survey
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/auth/login"
              className="relative w-24 h-10 flex items-center justify-center rounded-3xl text-sm font-inherit border-none overflow-hidden z-10 bg-gradient-to-r from-[#0190B0] to-[#24C8ED] hover:from-[#4A8A98] transition-all duration-500 ring-slate-900 hover:ring-2 hover:ring-[#173B3F] font-semibold text-white"
            >
              Sign In
            </NavLink>
          </li>
        </>
      )}
    </>
  );

  return (
    <>
      {/* Overlay Blur Behind Navbar */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 top-[10vh] bg-black/10 z-10"
          onClick={toggleMenu}
        />
      )}

      {/* Navbar */}
      <nav className="bg-white h-[10vh] w-full shadow-sm fixed top-0 left-0 right-0 z-30">
        <div className="flex justify-between items-center w-full md:max-w-[80vw] lg:max-w-[70vw] mx-auto h-full px-4 md:px-0">
          {/* Logo */}
          <NavLink
            to={user ? "/survey/user-surveys" : "/"}
            className="flex flex-row items-center justify-center space-y-1 gap-2 pl-5 md:pl-0"
          >
            <img src="/survey-icon.webp" alt="Home" className="h-10 w-10" />
            <span className="text-[#0190B0] text-lg font-bold tracking-wide">
              JazaForm
            </span>
          </NavLink>

          {/* Desktop Links */}
          <ul className="hidden md:flex items-center space-x-6 font-semibold text-md">
            <Links />
          </ul>

          {/* Mobile Toggle Button */}
          <button onClick={toggleMenu} className="md:hidden z-40">
            {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed top-[10vh] right-0 h-[50vh] w-3/4 bg-white shadow-md z-20">
          <ul className="flex flex-col items-center justify-evenly h-full px-4 py-6 text-md font-semibold">
            <Links />
          </ul>
        </div>
      )}
    </>
  );
};

export default Navbar;
