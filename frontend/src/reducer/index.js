import { combineReducers } from "redux";
import userReducer from "./user.reducer";
import postReducer from "./post.reducer";
import commentsReducer from "./comments.reducer";
import allUsersReducer from "./allUsers.reducer";
//

//stock tout les reducer et envoi a l'index.js

const initialState = {};
const rootReducer = (state = initialState, action) => {
  return state;
};

//va   vers index src et proviens de post et user reducer
export default combineReducers({
  rootReducer,
  userReducer,
  allUsersReducer,
  postReducer,
  commentsReducer,
});