import { GET_USERS } from "../actions/allUsers.actions";

const initialState = [];

export default function allUsersReducer(state = initialState, action) {
  switch (action.type) {
    case GET_USERS:
      return action.payload;
    default:
      return state;
  }
}