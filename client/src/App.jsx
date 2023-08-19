import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/Landing-Page/LandingPage";
import CreateUser from "./pages/User/CreateUser";
import UserList from "./pages/User/UserList";
import Question from "./pages/Question/Questions";
import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import MyActivities from "./pages/MyActivities/MyActivities";
import NavScroll from "./components/Nav";
import Footer from "./components/Footer";
import Profile from "./pages/Profile/Profile";
import Admin from "./pages/admin-moderator/Admin";
import Ask from "./pages/Ask/Ask";
import { useAuthContext } from "./hooks/useAuthContext";
import PageNotFound from "./components/NotFoundedPage";

const App = () => {
  const { auth, userRole } = useAuthContext();
  return (
    <>
      <NavScroll />
      <div className="container">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/user" element={<UserList />} />
          <Route path="/landing-page" element={<LandingPage />} />
          <Route path="/user/create" element={<CreateUser />} />
          <Route path="/question" element={<Question />} />
          <Route
            path="/login"
            element={!auth ? <Login /> : <Navigate to="/landing-page" />}
          />
          <Route
            path="/register"
            element={!auth ? <Register /> : <Navigate to="/landing-page" />}
          />
          <Route
            path="/my-activities"
            element={auth ? <MyActivities /> : <Navigate to="/login" />}
          />
          <Route
            path="/profile"
            element={auth ? <Profile /> : <Navigate to="/login" />}
          />
          <Route path="/question/:id" element={<Question />} />
          <Route
            path="/admin"
            element={
              userRole === "admin" ? <Admin /> : <Navigate to="/landing-page" />
            }
          />
          <Route
            path="/ask"
            element={auth ? <Ask /> : <Navigate to="/login" />}
          />

          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
};

export default App;
