
import axios from "axios";

export const GET_POSTS = "GET_POSTS";
export const ADD_POSTS = "ADD_POSTS";
export const ADD_COMMENT = "ADD_COMMENT";
export const GET_COMMENTS = "GET_COMMENTS";
export const DELETE_COMMENT = "DELETE_COMMENT";
export const DELETE_POST = "DELETE_POST";

//envoi vers post.reducer (dispatch envoi vers le reducer api/posts)
export const getPosts = () => {
  return dispatch => {
    return axios({
      method: "get",
      url: `${process.env.REACT_APP_API_URL}/api/posts/`,
      withCredentials: true,
    })
      .then(res => {
        dispatch({ type: GET_POSTS, payload: res.data });
      })
      .catch(err => console.log(err));
  };
};
//?_sort=id&_order=desc

//add post
export const addPost = data => {
  return dispatch => {
    return axios({
      method: "post",
      url: `${process.env.REACT_APP_API_URL}/api/posts/new`,
      data: data,
      withCredentials: true,
    })
      .then(res => {
        dispatch({ type: ADD_POSTS, payload: res.data });
      })
      .catch(err => console.log(err));
  };
};

export const addPost2 = data => {
  return dispatch => {
    return axios({
      method: "post",
      url: `${process.env.REACT_APP_API_URL}/api/posts/images/new`,
      data: data,
      withCredentials: true,
    })
      .then(res => {
        dispatch({ type: ADD_POSTS, payload: res.data });
      })
      .catch(err => console.log(err));
  };
};

export const addComment = (post, comment) => {
  return dispatch => {
    return axios({
      method: "post",
      url: `${process.env.REACT_APP_API_URL}/api/comment/new/${post.id}`,
      data: comment,
      withCredentials: true,
    })
      .then(res => {
        dispatch(getPosts());
      })
      .catch(err => console.log(err));
  };
};

export const getComments = post => {
  return dispatch => {
    return axios({
      method: "get",
      url: `${process.env.REACT_APP_API_URL}/api/comments/${post.id}`,
      withCredentials: true,
    })
      .then(res => {
        dispatch({ type: GET_COMMENTS, payload: res.data });
      })
      .catch(err => console.log(err));
  };
};

export const deleteComment = data => {
  return dispatch => {
    return axios({
      method: "delete",
      url: `${process.env.REACT_APP_API_URL}/api/user/${data.postId}/${data.commentId}`,
      withCredentials: true,
    })
      .then(res => {
        dispatch({ type: DELETE_COMMENT, payload: res.data });
      })
      .catch(err => console.log(err));
  };
};

export const deletePost = post => {
  return dispatch => {
    return axios({
      method: "delete",
      url: `${process.env.REACT_APP_API_URL}/api/posts/${post.id}`,
      withCredentials: true,
    })
      .then(res => {
        console.log(res);
        dispatch(getPosts());
      })
      .catch(err => console.log(err));
  };
};