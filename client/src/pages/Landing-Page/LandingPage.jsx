import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import PublicQuestion from "../../components/PublicQuestions";
import IntroImage from "../../components/IntroImage";
import useFetch from "../../hooks/useFetch";

function LandingPage() {
  const [questions, setQuestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(() => {
    const storedPage = parseInt(localStorage.getItem("currentPage"), 10);
    return isNaN(storedPage) ? 1 : storedPage;
  });
  const API = `/question/paginated-questions?page=${currentPage}&limit=5`;
  const [pageCount, setPageCount] = useState(1);
  const { isLoading, error, performFetch } = useFetch(API, (data) => {
    getQuestions(data);
  });

  const getQuestions = (data) => {
    setQuestions([]);
    setQuestions(data.result.result);
    setPageCount(data.result.pageCount);
  };

  const handlePageClick = (selectedPage) => {
    setCurrentPage(selectedPage.selected + 1);
  };

  useEffect(() => {
    localStorage.setItem("currentPage", currentPage.toString());
    performFetch();
  }, [currentPage]);

  const currentPageInRange = Math.min(Math.max(1, currentPage), pageCount);

  let content = null;

  if (isLoading) {
    content = <div>loading...</div>;
  } else if (error != null) {
    content = <div>Error: {error.toString()}</div>;
  } else {
    content = (
      <>
        <IntroImage />

        <div className="h3 mt-5 mb-3 text-center">All Questions</div>

        {questions.map((question) => (
          <PublicQuestion key={question._id} question={question} />
        ))}
        <ReactPaginate
          previousLabel={"<<"}
          nextLabel={">>"}
          breakLabel={"..."}
          pageCount={pageCount}
          marginPagesDisplayed={3}
          onPageChange={handlePageClick}
          containerClassName={"pagination justify-content-center"}
          pageClassName={"page-item"}
          pageLinkClassName={"page-link"}
          previousClassName={"page-item"}
          previousLinkClassName={"page-link"}
          nextClassName={"page-item"}
          nextLinkClassName={"page-link"}
          breakClassName={"page-item"}
          breakLinkClassName={"page-link"}
          activeClassName={"active"}
          forcePage={currentPageInRange - 1}
        />
      </>
    );
  }

  return <div>{content}</div>;
}

export default LandingPage;
