import React, { createContext, useState, useEffect } from "react";
import { PropTypes } from "prop-types";

export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState("");

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("user")));
  }, []);

  const removeUser = () => {
    localStorage.removeItem("user");
    setUser("");
  };

  return (
    <UserContext.Provider value={{ user, setUser, removeUser }}>
      {children}
    </UserContext.Provider>
  );
};

UserContextProvider.propTypes = {
  children: PropTypes.element.isRequired,
};
