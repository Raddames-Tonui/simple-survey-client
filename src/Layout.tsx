import React from "react";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Outlet } from "react-router-dom";

const Layout = (): JSX.Element => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      <Navbar />
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          style: {
            zIndex: 100,
            top: "12vh",
          },
        }}
      />

      <main className="flex-grow mx-auto min-w-full md:min-w-[80vw]  lg:min-w-[70vw]">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
