import React from "react";
import DeleteIcon from "@material-ui/icons/Delete";
import { useDispatch } from "react-redux";
import { deletePost, getComments, deleteComment } from "../actions/post.action";
import axios from "axios";
import { deleteUser } from "../actions/user.actions";

const BtnDelete = ({ action, data, uid }) => {
  const dispatch = useDispatch();

  const deleteIt = e => {
    e.preventDefault();
    if (action == "DELETE_COMMENT") {
      dispatch(deleteComment(data)).then(res => {
        dispatch(getComments(data.post));
      });
    } else if (action === "DELETE_POST") {
      dispatch(deletePost(data));
    } else if (action == "DELETE_USER") {
      dispatch(deleteUser(data, uid)).then(res => {
        if (uid === data) {
          dispatch({ type: "GET_USER_TOKEN", payload: {} });
          dispatch({ type: "GET_POSTS", payload: {} });
          dispatch({ type: "ADD_COMMENT", payload: {} });
          dispatch({ type: "GET_USERS", payload: [] });
        }
        window.location = "/";
      });
    }
  };

  return (
    <>
      <button
        onClick={e => deleteIt(e)}
        aria-label="delete"
        className="btn_btnModifiedPost"
      >
        <DeleteIcon />
      </button>
    </>
  );
};

export default BtnDelete;