
import React, { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { getUser } from "../actions/user.actions";

//impo files.js
import { isEmpty } from "../components/Utils";
import BtnValid from "./BtnValid";
import BtnDelete from "./BtnDelete";
import BtnModified from "./BtnModified";

//css
import "../style/comment.scss";

//matrial ui
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import { UidContext } from "../App";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: "33.33%",
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
}));

export default function Comment({ post, uid, allUsers, user }) {
  const [comments, setComments] = React.useState([]);
  const [content, setComment] = React.useState("");
  const users = allUsers;
  const com = useSelector(state => state.commentsReducer);

  const classes = useStyles();
  // const [expanded, setExpanded] = React.useState(false);
  React.useEffect(() => {
    axios({
      method: "get",
      url: `${process.env.REACT_APP_API_URL}/api/comments/${post.id}`,
      withCredentials: true,
    })
      .then(res => {
        setComments(res.data);
      })
      .catch(err => console.log(err));
  }, [com]);

  React.useEffect(() => {
    console.log(content);
  }, [content]);

  return (
    <>
      {comments ? (
        comments.map((com, index) => {
          return (
            <div key={com.id}>
              {users.map(us => {
                return us.id === com.userId ? (
                  <div key={us.id}>
                    {us.firstname} {us.firstname}
                  </div>
                ) : (
                  ""
                );
              })}
              <strong>{com.content}</strong> <em>{com.createdAt}</em>
              {user && (com.userId === uid || user.isadmin) && (
                <>
                  <BtnDelete
                    action={"DELETE_COMMENT"}
                    data={{ postId: post.id, commentId: com.id, post: post }}
                  />
                  <BtnModified onClick={e => setComment(com.content)} />
                </>
              )}
              <Divider light />
            </div>
          );
        })
      ) : (
        <></>
      )}
      <div>
        <form className="container_comment">
          <Typography className={classes.heading}>
            {!isEmpty(user) && user.firstname} {!isEmpty(user) && user.lastname}
          </Typography>
          <textarea
            className="comment_textArea"
            value={content}
            onChange={e => setComment(e.target.value)}
            placeholder="Vous desirez mettre un  commentaire..."
          ></textarea>
          {/*   <input type="submit" value="Validez votre commentaire" />*/}
          <BtnValid action={"SAVE_COMMENT"} post={post} content={content} />
        </form>
      </div>
    </>
  );
}