import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { server_url } from "../../config.json";

const SignUpForm = (): JSX.Element => {
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [role, setRole] = useState<string>("viewer");
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`${server_url}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          name,
          password,
          role,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Sign up successful!");
        navigate("/auth/signup");
        toast.error(result.message || "Signup failed. Please try again.");
      }
    } catch (err) {
      toast.error("An error occurred. Please try again.");
      setError("Signup failed. Please try again.");
    }
  };

  return (
    <div className="h-[90vh] flex items-center justify-center py-12 px-6 lg:px-12">
      <div className="bg-white mx-auto flex flex-col items-center justify-center px-6 max-w-md w-full py-6 rounded-md border border-gray-300">
        <NavLink to="/">
          <img
            src="/survey-icon.webp"
            alt="JazaForm Logo"
            className="mx-auto h-12 w-auto"
          />
        </NavLink>
        <h1 className="text-2xl font-bold pb-2 pt-2 text-[#0190B0]">
          JazaForm
        </h1>
        <h2 className=" text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
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
            <div className="mt-2">
              <input
                id="name"
                name="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="block w-full rounded-md border-0 py-2 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
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
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="block w-full rounded-md border-0 py-2 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
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
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="block w-full rounded-md border-0 py-2 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
                placeholder="Password"
              />
            </div>
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium leading-4 text-gray-900">
              Select Role
            </label>
            <div className="mt-2 flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="role"
                  value="admin"
                  checked={role === "admin"}
                  onChange={() => setRole("admin")}
                  className="mr-2"
                />
                Admin
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="role"
                  value="viewer"
                  checked={role === "viewer"}
                  onChange={() => setRole("viewer")}
                  className="mr-2"
                />
                Viewer
              </label>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="relative w-full h-10 rounded-md text-white text-md font-bold border-none overflow-hidden z-10 bg-gradient-to-r from-[#0190B0] to-[#24C8ED] hover:bg-gradient-to-r hover:from-[#4A8A98]hover:ring-[#173B3F] ring-1 ring-gray-600 transition-all duration-500"
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
    </div>
  );
};

export default SignUpForm;
