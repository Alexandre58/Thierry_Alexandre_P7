import React from "react";

import {} from "../actions/post.action";
import { useDispatch, useSelector } from "react-redux";
import { addComment, getComments } from "../actions/post.action";
import axios from "axios";
import SaveAltIcon from "@material-ui/icons/SaveAlt";
import { updateBio } from "../actions/user.actions";

//css
import "../style/btnDeleteandMody.scss";


const BtnValid = ({ action, post, content, user }) => {
  const dispatch = useDispatch();

  const saveComment = e => {
    e.preventDefault();
    if (action == "SAVE_COMMENT") {
      dispatch(addComment(post, { content: content, messageId: post.id })).then(
        res => {
          axios({
            method: "get",
            url: `${process.env.REACT_APP_API_URL}/api/comments/${post.id}`,
            withCredentials: true,
          })
            .then(res => {
              console.log(res);
              dispatch(getComments(post));
            })
            .catch(err => console.log(err));
        }
      );
    } else if (action === "SAVE_BIO") {
      dispatch(updateBio(user, content)).then(() => {
        //window.location = "/profil";
      });
    }
  };

  return (
    <button onClick={e => saveComment(e)} className="btn_btnModifiedPost">
      <SaveAltIcon />
    </button>
  );
};

export default BtnValid;