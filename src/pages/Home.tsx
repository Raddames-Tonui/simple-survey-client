import HeroSection from "../components/HeroSection";
import ActiveSurveyList from "./ActiveSurveyList";

const Home = (): JSX.Element => {
  return (
    <div className="min-h-screen ">
      <HeroSection />
      <div className="">
        <ActiveSurveyList />
      </div>
    </div>
  );
};

export default Home;
