
import axios from "axios";

export const GET_USER_ERROR = "GET_USER_ERROR";
export const GET_USER_TOKEN = "GET_USER_TOKEN";
export const UPLOAD_PICTURE = "UPLOAD_PICTURE";
export const UPDATE_BIO = "UPDATE_BIO";

//envoi ver post.reducer avec dispatch(dispatch envoi vers le reducer)

//token recup
export const getUserToken = () => {
  return dispatch => {
    return axios({
      method: "get",
      url: `${process.env.REACT_APP_API_URL}/tokenRecup`,
      withCredentials: true,
    }).then(res => {
      dispatch({ type: GET_USER_TOKEN, payload: res.data });
    });
  };
};
//images
export const uploadPicture = (data, id) => {
  console.log(data);
  return dispatch => {
    return axios({
      method: "put",
      url: `${process.env.REACT_APP_API_URL}/api/users/profil/`,
      data: data,
      withCredentials: true,
    }).then(res => {
      return axios({
        method: "get",
        url: `${process.env.REACT_APP_API_URL}/api/users/profil/`,
        withCredentials: true,
      })
        .then(res => {
          dispatch({ type: UPLOAD_PICTURE, payload: res.data.avatar });
          //window.location = "/profil";
        })
        .catch(err => {
          console.log(err);
        });
    });
  };
};

//update bio profil.js

export const updateBio = (userId, bio) => {
  return dispatch => {
    return axios({
      method: "put",
      url: `${process.env.REACT_APP_API_URL}/api/users/profil/`,
      data: { bio },
      withCredentials: true,
    })
      .then(res => {
        dispatch({ type: UPDATE_BIO, payload: bio });
        //window.location = "/profil";
      })
      .catch(err => {
        console.log(err);
      });
  };
};

export const deleteUser = (userId, loggedId) => {
  console.log(userId);
  return dispatch => {
    return axios({
      method: "delete",
      url: `${process.env.REACT_APP_API_URL}/api/user/${userId}`,

      withCredentials: true,
    })
      .then(() => {
        if (userId === loggedId) {
          console.log("deconnection");
          axios({
            method: "get",
            url: `${process.env.REACT_APP_API_URL}/api/user/deconnect`,
            withCredentials: true,
          })
            .then(res => {
              console.log(res);
              dispatch({ type: "DELETE_USER", payload: res });
            })
            .catch(err => console.log(err));
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  };
};