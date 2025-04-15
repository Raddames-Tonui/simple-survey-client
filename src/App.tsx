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
import CreateSurvey from "./pages/CreateSurvey";
import SurveyList from "./pages/SurveyList";
import UserSurveyList from "./pages/UserSurveyList";
import SurveyForm from "./pages/SurveyForm";

const App = (): JSX.Element => {
  return (
    <CookiesProvider>
      <Router>
        <AuthProvider>
          <SurveyProvider>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/survey/demo" element={<Survey />} />
                <Route path="/survey/list" element={<SurveyList />} />
                <Route path="/survey/:id/questions" element={<SurveyForm/>} />
                <Route path="*" element={<NoPage />} />
                <Route element={<PrivateRoute />}>
                  <Route path="/survey/create" element={<CreateSurvey />} />
                  <Route path="/survey/user-surveys" element={<UserSurveyList/>}/>
                  <Route
                    path="/survey/response"
                    element={<SurveyResponses />}
                  />
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
