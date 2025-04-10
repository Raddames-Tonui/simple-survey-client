import React from "react";
import { Toaster } from "react-hot-toast";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";

const AuthLayout = (): JSX.Element => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
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

      <main className="flex-grow  mx-auto max-h-screen min-w-full md:min-w-[80vw] lg:min-w-[70vw]">
        <Outlet />
      </main>
    </div>
  );
};

export default AuthLayout;
