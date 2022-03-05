//verifie si un element n'est pas vide

export const isEmpty = value => {
  return (
    value === undefined ||
    value === null ||
    (typeof value === "object" && Object.keys(value).length === 0) ||
    (typeof value === "string" && value.trim().length === 0)
  );
};

export const findUser = (uid, userList) => {
  if (
    userList == undefined ||
    userList === null ||
    Object.keys(userList).length == 0
  )
    return undefined;
  return userList.filter(user => user.id === uid)[0];
};