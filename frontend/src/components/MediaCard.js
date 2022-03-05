
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

//import { isEmpty } from "../components/Utils";
//css blog.scss

import "../style/blog.scss";

//import file.js
import Comment from "./Comment";
import BtnDelete from "./BtnDelete";
import BtnModified from "./BtnModified";

//material ui
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import CardHeader from "@material-ui/core/CardHeader";
import Avatar from "@material-ui/core/Avatar";

import Divider from "@material-ui/core/Divider";
import { makeStyles } from "@material-ui/core/styles";
import { findUser } from "./Utils";
import { getUsers } from "../actions/allUsers.actions";
import allUsersReducer from "../reducer/allUsers.reducer";

export const useStyles = makeStyles({
  root: {
  // maxWidth: 750,
    margin: 0,
    //  minWidth: 280,
  },
  media: {
    height: 140,
  },
});

export default function MediaCard({ post, uid, user }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const allUsers = useSelector(state => state.allUsersReducer);

  useEffect(() => {
    if (allUsers.length === 0) dispatch(getUsers());
  }, [allUsers, dispatch]);
  const postOwner = findUser(post.UserId, allUsers);

  const openProfile = () => {
    window.location = `/profil?nn=${postOwner.id}`;
  };

  return (
    <>
      <Card className={classes.root}>
        <div className="btnDeleteAndMofified_mediaCard_container">
          {user && (post.UserId === uid || user.isadmin) && (
            <>
              <BtnDelete action={"DELETE_POST"} data={post} />
            {/**   <BtnModified />*/}
            </>
          )}
        </div>
        <CardActionArea>
          <CardHeader
            onClick={e => openProfile(e)}
            avatar={
              <Avatar aria-label="recipe" className={classes.avatar}>
                {postOwner && (
                  <img
                    src={postOwner.avatar}
                    className="img_profil"
                    alt="image profil"
                  />
                )}
              </Avatar>
            }
            title={postOwner ? postOwner.firstname : ""}
            subheader={postOwner ? postOwner.lastname : ""}
          ></CardHeader>
          {post.attachment && (
            <img className={classes.media} src={post.attachment} alt="" />
          )}
          <div className="CartContent_title_content ">
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                {post.title}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                {post.content}
              </Typography>
            </CardContent>
          </div>
        </CardActionArea>

        {/**     <List component="nav" className={classes.root} aria-label="mailbox folders">
              <Divider />
              <Divider light />    
          </List>*/}

        <Divider />
        <Divider light />
        <Comment post={post} uid={uid} allUsers={allUsers} user={user} />
      </Card>
    </>
  );
}