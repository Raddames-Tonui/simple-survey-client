import React from "react";
import SurveyList from "./SurveyList";
import HeroSection from "../components/HeroSection";

const Home = (): JSX.Element => {
  return (
    <div className="min-h-screen ">
      <HeroSection />
      <SurveyList />
    </div>
  );
};

export default Home;
