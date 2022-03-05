import { ADD_POSTS, DELETE_POST, GET_POSTS } from "../actions/post.action";

const initialState = {};

//traitement des donnée de post.action
//proviens de post.action /envoi ver index.js/reducer
export default function postReducer(state = initialState, action) {
  switch (action.type) {
    case GET_POSTS:
      return action.payload;
    case ADD_POSTS:
      return action.payload;
    case DELETE_POST:
      return [action.payload, ...state];
    default:
      return state;
  }
}