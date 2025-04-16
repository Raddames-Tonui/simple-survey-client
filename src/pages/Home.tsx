import HeroSection from "../components/HeroSection";
import ActiveSurveyList from "./ActiveSurveyList";

const Home = (): React.JSX.Element => {
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
