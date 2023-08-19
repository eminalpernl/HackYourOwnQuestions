import React from "react";
import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <div>
      <div className="text-center">
        <h1>404</h1>
        <p>Page not found. Check the path.</p>
        <Link to="/">To the homepage</Link>
      </div>
    </div>
  );
};

export default PageNotFound;
