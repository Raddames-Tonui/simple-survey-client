import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Layout from "./Layout/Layout";
import AuthLayout from "./Layout/AuthLayout";

import { AuthProvider } from "./context/AuthContext";
import { SurveyProvider } from "./context/SurveyContext";

import { CookiesProvider } from "react-cookie";

import Login from "./auth/Login";
import SignUpForm from "./auth/SignUpForm";

import PrivateRoute from "./components/PrivateRoute";

import Home from "./pages/Home";
import Survey from "./pages/Survey";
import SurveyResponses from "./pages/SurveyResponses";
import NoPage from "./pages/NoPage";

const App = (): JSX.Element => {
  return (
    <CookiesProvider>
      <Router>
        <AuthProvider>
          <SurveyProvider>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/survey" element={<Survey />} />
                <Route path="*" element={<NoPage />} />
                <Route element={<PrivateRoute />}>
                  <Route path="/response" element={<SurveyResponses />} />
                </Route>
              </Route>

              <Route path="/auth" element={<AuthLayout />}>
                <Route path="login" element={<Login />} />
                <Route path="signup" element={<SignUpForm />} />
              </Route>
            </Routes>
          </SurveyProvider>
        </AuthProvider>
      </Router>
    </CookiesProvider>
  );
};

export default App;
