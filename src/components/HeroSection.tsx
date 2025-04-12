import React from "react";
import { Link } from "react-router-dom";

const HeroSection = (): JSX.Element => {
  return (
    <section className="relative h-[60vh] mt-[2vh] flex items-center justify-start bg-black/90 lg:rounded-xl">
      <img
        src="/images/survey1.png"
        alt="Survey background"
        className="absolute inset-0 object-cover w-full h-full z-0 opacity-60 rounded-xl"
      />
      <div className="relative z-10 max-w-3xl px-6 lg:px-12">
        <h1 className="text-white text-4xl lg:text-6xl font-bold leading-tight mb-4">
          From Questions to Insights
        </h1>
        <p className="text-white text-lg mb-6">
          Collect, Analyze, and Act on Real Opinions — Instantly.
        </p>
        <Link to="/auth/login" className="bg-[#0190B0] text-white text-md rounded hover:bg-[#017a95] transition font-semibold px-6 py-3  ">
          Create Your First Survey
        </Link>
      </div>
    </section>
  );
};

export default HeroSection;
