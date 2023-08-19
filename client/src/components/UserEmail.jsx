import React, { useEffect, useState } from "react";
import useFetch from "../hooks/useFetch";
import PropTypes from "prop-types";

function UserEmail({ userID }) {
  const [userEmail, setUserEmail] = useState("");

  const fetchUserEmail = useFetch(`/user/${userID}`, (data) => {
    setUserEmail(data.user.email);
  });

  useEffect(() => {
    fetchUserEmail.performFetch();
  }, [userID]);

  return <span>{userEmail}</span>;
}

UserEmail.propTypes = {
  userID: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default UserEmail;
