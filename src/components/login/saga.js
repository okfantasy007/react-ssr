const loginSaga = {};
// 登录
loginSaga.login = {
  type: "post",
  path: "/user/login",
};

loginSaga.logout = {
  type: "post",
  path: "/user/logout",
};

export default loginSaga;
