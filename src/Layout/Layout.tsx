import { Toaster } from "react-hot-toast";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";

const Layout = (): React.JSX.Element => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      <div className="fixed top-0 left-0 w-full h-[10vh] bg-white z-50 shadow-sm">
        <Navbar />
      </div>

      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          // Global default toast style
          style: {
            zIndex: 100,
            top: "0vh",
            borderRadius: "0",
          },
          success: {
            style: {
              backgroundColor: "#28a745",
              color: "white",
              borderRadius: "0",
            },
          },
          error: {
            // Error toast custom style
            style: {
              backgroundColor: "#dc3545",
              color: "white",
              borderRadius: "0",
            },
          },
        }}
        containerClassName="mt-[10vh]"
      />

      <main className="flex-grow pt-[10vh] mx-auto min-h-screen min-w-full md:min-w-[80vw] lg:min-w-[70vw]">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
