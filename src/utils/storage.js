export const getUsers = () => {
  return JSON.parse(localStorage.getItem("users")) || [];
};

export const saveUsers = (users) => {
  localStorage.setItem("users", JSON.stringify(users));
};

export const addUser = (user) => {
  const users = getUsers();
  users.push(user);
  saveUsers(users);
};