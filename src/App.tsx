import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Layout from "./Layout/Layout";
import AuthLayout from "./Layout/AuthLayout";


import { AuthProvider } from "./context/AuthContext"; 

import { CookiesProvider } from "react-cookie"; 

import Home from "./pages/Home";
import Survey from "./pages/Survey";
import SurveyResponses from "./pages/SurveyResponses";
import NoPage from "./pages/NoPage";
import Login from "./auth/Login";

const App = (): JSX.Element => {
  return (
    <CookiesProvider>
      <Router>
        <AuthProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/response" element={<SurveyResponses />} />
              <Route path="/survey" element={<Survey />} />
              <Route path="*" element={<NoPage />} />
            </Route>

            {/* Authentication Routes */}
            <Route path="/auth" element={<AuthLayout />}>
              <Route path="login" element={<Login />} />
            </Route>
          </Routes>
        </AuthProvider>
      </Router>
    </CookiesProvider>
  );
};

export default App;
