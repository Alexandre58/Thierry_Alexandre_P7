import {
  ADD_COMMENT,
  GET_COMMENTS,
  DELETE_COMMENT,
} from "../actions/post.action";

const initialState = {};

//traitement des donnée de post.action
//proviens de post.action /envoi ver index.js/reducer
export default function commentsReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_COMMENT:
      return action.payload;
    case GET_COMMENTS:
      return action.payload;
    case DELETE_COMMENT:
      return action.payload;
    default:
      return state;
  }
}