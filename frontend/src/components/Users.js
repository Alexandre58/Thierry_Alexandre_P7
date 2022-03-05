//design card users
import { useSelector } from "react-redux";
import { isEmpty, findUser } from "./Utils";

import "../style/users.scss";

const Users = ({ user }) => {
  var str = window.location.href;
  var url = new URL(str);
  var userProfileId = parseInt(url.searchParams.get("nn"));
  const users = useSelector((state) => state.allUsersReducer);
  const userProfile = findUser(userProfileId, users);

  return (
    <div className="user-container">
      <img
        src={!userProfile ? user.avatar : userProfile.avatar}
        className="img_profil"
        alt="image profil"
      />
      <p>
        {!isEmpty(user) && user.firstname} {!isEmpty(user) && user.lastname}
      </p>
    </div>
  );
};

export default Users;
