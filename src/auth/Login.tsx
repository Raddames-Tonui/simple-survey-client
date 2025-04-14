import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FiMail, FiLock } from "react-icons/fi";

const Login = (): JSX.Element => {
  const { login } = useAuth();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await login(email, password);
    } catch (err) {
      setError("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100 p-2 md:p-0">
      <div className="flex flex-col  md:flex-row w-full max-w-4xl bg-white border border-gray-300 shadow-lg rounded-lg overflow-hidden">
        {/* Form Section */}
        <div className="bg-white mx-auto flex flex-col items-center justify-center px-6 max-w-md w-full py-6 rounded-md ">
          <div className="my-4">
            <NavLink to="/">
              <img
                src="/survey-icon.webp"
                alt="JazaForm Logo"
                className="mx-auto h-12 w-auto"
              />
            </NavLink>
            <h1 className="text-2xl font-bold  pt-2 text-[#0190B0]">
              JazaForm
            </h1>
          </div>

          <form className="space-y-6 mt-8 w-full" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-4 text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2 relative">
                <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="block w-full rounded-md border-0 py-2 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-4 text-gray-900"
                >
                  Password
                </label>
              </div>
              <div className="mt-2 relative">
                <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="block w-full rounded-md border-0 py-2 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
                  placeholder="Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="relative w-full h-10 rounded-md text-white text-md font-bold border-none overflow-hidden z-10 bg-gradient-to-r from-[#0190B0] to-[#24C8ED] hover:bg-gradient-to-r hover:from-[#4A8A98] hover:to-[#18a3c2] hover:ring-[#173B3F] ring-1 ring-gray-600 transition-all duration-500"
              >
                Sign In
              </button>
            </div>
          </form>
          <p className="text-center mt-6 text-gray-600 text-md">
            Not a member?{" "}
            <Link
              to="/auth/signup"
              className="text-[#24C8ED] hover:text-[#4A8A98] transition duration-300"
            >
              Create Account
            </Link>
          </p>
        </div>

        {/* Image Section with direct <img> like HeroSection */}
        <div className="relative hidden md:block md:w-1/2 h-auto">
          <img
            src="/images/survey1.png"
            alt="Login visual"
            className="absolute inset-0 object-cover w-full h-full opacity-100 z-0"
          />
          <div className="relative z-10 h-full flex flex-col justify-center bg-black/10 items-center  p-8 text-center">
            <h3 className="text-3xl font-bold text-white">Welcome Back!</h3>
            <p className="mt-4 text-lg text-white">
              Login to access your account and continue your journey with
              JazaForm.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
