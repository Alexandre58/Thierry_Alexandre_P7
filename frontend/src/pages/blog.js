import { useSelector, useDispatch } from "react-redux";
import React, { useContext, useEffect } from "react";
import { UidContext } from "../App";
//import { BlogNotConnect  } from "../components/BlogNotConnect";
//material ui
import { Typography } from "@material-ui/core";
import Container from "@material-ui/core/Container";
//import file.js
import { Footer } from "../components/Footer";
import { isEmpty } from "../components/Utils";
import Users from "../components/Users";
import { NavBar } from "../components/NavBar";
import MediaCard from "../components/MediaCard";
import FormPost from "../components/FormPost";
//import { Home } from './home';
import { getComments, getPosts } from "../actions/post.action";
import { findUser } from "../components/Utils";
import { Home } from "./home";
//scss
import "../style/blog.scss";

export const Blog = () => {
  const dispatch = useDispatch();
  const uid = useContext(UidContext);
  const posts = useSelector(state => state.postReducer);
  //USER
  useEffect(() => {
    dispatch(getPosts());
    console.log(posts);
  }, []);
  const user = useSelector(state => state.userReducer);
  return (
    <>
      {uid && <NavBar uid={uid} user={user} />}
      {!uid ? (
        <Home />
      ) : (
        <section className="section_blog">
          <Users uid={uid} user={user} />
          <div className="blog_container">
            <Typography variant="h1" className="h1blog">
              Bienvenu sur Groupomania publications
            </Typography>
          </div>
          <Container>
            <FormPost uid={uid} user={user} />
            <div className="container_blog_mediaCard">
              {!isEmpty(posts) &&
                posts.map((post, index) => {
                  return (
                    <MediaCard
                      post={post}
                      key={post.id}
                      uid={uid}
                      user={user}
                    />
                  );
                })}
            </div>
          </Container>
        </section>
      )}

      <Footer />
    </>
  );
};