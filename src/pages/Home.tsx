import React from "react";
import HeroSection from "../components/HeroSection";
import ActiveSurveyList from "./ActiveSurveyList";

const Home = (): JSX.Element => {
  return (
    <div className="min-h-screen ">
      <HeroSection />
      <ActiveSurveyList />
    </div>
  );
};

export default Home;
