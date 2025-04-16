import { Toaster } from "react-hot-toast";
import { Outlet } from "react-router-dom";

const AuthLayout = (): React.JSX.Element => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          style: {
            zIndex: 100,
            top: "2vh",
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
            style: {
              backgroundColor: "#dc3545",
              color: "white",
              borderRadius: "0",
            },
          },
        }}
        containerClassName="mt-[10vh]"
      />

      <main className="flex-grow mx-auto max-h-screen min-w-full md:min-w-[80vw] lg:min-w-[70vw]">
        <Outlet />
      </main>
    </div>
  );
};

export default AuthLayout;
