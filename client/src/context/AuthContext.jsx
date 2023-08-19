import React, { createContext, useState, useEffect } from "react";
import { PropTypes } from "prop-types";
import useFetch from "../hooks/useFetch";
export const AuthContext = createContext();
export const AuthContextProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const checkAuth = useFetch("/auth/", (res) => {
    if (res?.authUser) {
      setAuth(res.authUser);
      setUserId(res.authUser._id);
      setUserRole(res.authUser.role);
    } else {
      setAuth(null);
      setUserId(null);
      setUserRole(null);
    }
  });
  useEffect(() => {
    checkAuth.performFetch();
  }, []);
  const login = (userData) => {
    setAuth(userData);
    setUserId(userData._id);
    setUserRole(userData.role);
  };
  useEffect(() => {
    if (auth) {
      setAuth(auth);
    }
  }, [auth]);
  const logout = () => {
    setAuth(null);
    setUserId(null);
    setUserRole(null);
  };
  return (
    <AuthContext.Provider value={{ auth, userId, userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
AuthContextProvider.propTypes = {
  children: PropTypes.element.isRequired,
};
