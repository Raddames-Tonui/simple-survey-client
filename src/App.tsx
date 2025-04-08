import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Survey from "./pages/Survey";

const App = (): JSX.Element => {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/survey" element={<Survey />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
