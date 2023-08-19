import React, { useState } from "react";
import useFetch from "../../hooks/useFetch";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const Ask = () => {
  const [title, setTitle] = useState("");
  const [questionSent, setQuestionSent] = useState(false);
  const navigate = useNavigate();
  const [editorContent, setEditorContent] = useState("");

  const { performFetch } = useFetch("/question/create", (res) => {
    if (res.success == true) {
      navigate("/");
    }
  });

  const handleSendQuestion = () => {
    performFetch({
      method: "POST",
      body: JSON.stringify({
        question: {
          question_title: title,
          question_body: editorContent,
        },
      }),
    });
    setTitle("");
    setEditorContent("");
    setQuestionSent(true);
  };
  const styles = {
    height: "30vh",
  };

  return (
    <div>
      <p>You can ask your question here:</p>
      <div className="form-outline mb-4">
        <input
          type="text"
          className="form-control mb-2"
          id="textAreaExample6"
          rows="5"
          placeholder="Question title..."
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        ></input>
        <ReactQuill
          theme="snow"
          value={editorContent}
          onChange={setEditorContent}
          placeholder="Question body..."
          className="mb-5"
          style={styles}
        />
        <Button
          variant={questionSent ? "success" : "info"}
          className="float-end mt-1"
          size="sm"
          onClick={() => {
            handleSendQuestion();
          }}
          disabled={questionSent}
        >
          {questionSent ? "Question Sent" : "Ask Question"}
        </Button>
      </div>
    </div>
  );
};

export default Ask;
