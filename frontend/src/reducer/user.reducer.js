import {
  GET_USER_TOKEN,
  UPDATE_BIO,
  UPLOAD_PICTURE,
  // GET_USER_ERROR,
} from "../actions/user.actions";

const initialState = {};

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case GET_USER_TOKEN:
      return action.payload;
    case UPLOAD_PICTURE:
      return {
        ...state,
        avatar: action.payload,
      };
    case UPDATE_BIO:
      return {...state, bio: action.payload}
    case "DELETE_USER":
      return state;

    default:
      return state;
  }
}