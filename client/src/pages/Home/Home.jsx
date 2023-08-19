import React from "react";
import PublicQuestion from "../../components/PublicQuestions";

import TEST_ID from "./Home.testid";

const Home = () => {
  return (
    <div data-testid={TEST_ID.container}>
      <h1>This is the homepage</h1>
      <p>Good luck with the project TEAM B!</p>
      <PublicQuestion />
      <PublicQuestion />
    </div>
  );
};

export default Home;
