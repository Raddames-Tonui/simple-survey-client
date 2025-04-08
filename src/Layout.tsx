import React from "react";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Outlet } from "react-router-dom";

const Layout = (): JSX.Element => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Toaster
        position="top-right"
        reverseOrder={true}
        toastOptions={{
          style: {
            zIndex: 100,
            top: "10vh",
          },
        }}
      />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
