export const findUser = (uid, userList) => {
    return userList.filter(user => user.id === uid)[0];
  };