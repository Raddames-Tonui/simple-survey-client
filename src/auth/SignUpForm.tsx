import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FiMail, FiLock, FiUser } from "react-icons/fi";

const SignUpForm = (): JSX.Element => {
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const { signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await signUp(name, email, password);
    } catch (err) {
      setError("Signup failed. Try again.");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100 p-2 md:p-0">
      <div className="flex flex-col lg:flex-row w-full   bg-white border border-gray-300 shadow-lg rounded-lg overflow-hidden">
        {/* Form Section */}
        <div className="bg-white mx-auto flex flex-col items-center justify-center px-6 max-w-md w-full py-6 rounded-md">
          <div className="my-2">
            <NavLink to="/">
              <img
                src="/survey-icon.webp"
                alt="JazaForm Logo"
                className="mx-auto h-12 w-auto"
              />
            </NavLink>
            <h1 className="text-2xl font-bold pt-2 text-[#0190B0]">JazaForm</h1>
          </div>
          <h2 className="text-center text-xl font-bold text-gray-900">
            Create your account
          </h2>

          <form className="space-y-6 mt-8 w-full" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium leading-4 text-gray-900"
              >
                Full Name
              </label>
              <div className="mt-2 relative">
                <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="block w-full rounded-md border-0 py-2 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
                  placeholder="Full Name"
                />
              </div>
            </div>

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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="block w-full rounded-md border-0 py-2 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-4 text-gray-900"
              >
                Password
              </label>
              <div className="mt-2 relative">
                <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="block w-full rounded-md border-0 py-2 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
                  placeholder="Password"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="confirm-password"
                className="block text-sm font-medium leading-4 text-gray-900"
              >
                Confirm Password
              </label>
              <div className="mt-2 relative">
                <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="block w-full rounded-md border-0 py-2 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
                  placeholder="Confirm Password"
                />
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center mt-2">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                className="relative w-full h-10 rounded-md text-white text-md font-bold border-none overflow-hidden z-10 bg-gradient-to-r from-[#0190B0] to-[#24C8ED] hover:bg-gradient-to-r hover:from-[#4A8A98] hover:to-[#18a3c2] hover:ring-[#173B3F] ring-1 ring-gray-600 transition-all duration-500"
              >
                Sign Up
              </button>
            </div>
          </form>

          <p className="text-center mt-6 text-gray-600 text-md">
            Already a member?{" "}
            <Link
              to="/auth/login"
              className="text-[#24C8ED] hover:text-[#4A8A98] transition duration-300"
            >
              Sign in
            </Link>
          </p>
        </div>

        {/* Image Section */}
        <div className="relative hidden lg:block lg:w-1/2 maxh-[80vh]">
          <img
            src="/images/survey1.png"
            alt="Signup visual"
            className="w-full h-full object-cover absolute inset-0 z-0"
          />

          <div className="relative z-10 h-full flex flex-col justify-center bg-black/10 items-center p-8 text-center">
            <h3 className="text-3xl font-bold text-white">Join JazaForm</h3>
            <p className="mt-4 text-lg text-white">
              Create an account to start building smart surveys.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;
