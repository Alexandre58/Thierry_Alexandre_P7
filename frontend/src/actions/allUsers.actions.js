import axios from "axios";

export const GET_USERS = "GET_USERS";
export const GET_USERS_ERROR = "GET_USERS_ERROR";

export const getUsers = () => {
  return dispatch => {
    return axios({
      method: "get",
      url: `${process.env.REACT_APP_API_URL}/api/users/`,
      withCredentials: true,
    })
      .then(res => {
        dispatch({ type: GET_USERS, payload: res.data });
      })
      .catch(err => {
        dispatch({ type: GET_USERS_ERROR, payload: err });
      });
  };
};