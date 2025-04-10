import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import Home from "./pages/Home";
// import About from "./pages/About";
import Survey from "./pages/Survey";
import SurveyResponses from "./pages/SurveyResponses";
import NoPage from "./pages/NoPage";

const App = (): JSX.Element => {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/response" element={<SurveyResponses/>} />
          <Route path="/survey" element={<Survey />} />
          <Route path="*" element={<NoPage/>}/>
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
