const loginReducer = {
  login_result: (state = {
                   user_name: "", id: "", msg: "", admin_flag: false, success: "void",
                 },
                 action,) => {
    switch (action.type) {
      case "login_success":
        return {
          user_name: action.payload.data.user_name,
          id: action.payload.data.id,
          msg: "",
          admin_flag: action.payload.data.admin_flag,
          success: true,
        };
      case "login_fail":
        return {
          user_name: "",
          id: "",
          msg: action.payload.msg,
          admin_flag: false,
          success: false,
        };
      case "init_login_result":
        return {
          user_name: "",
          id: "",
          msg: "",
          admin_flag: false,
          success: "void",
        };
      default:
        return state;
    }
  },
  logout_result: (state = {logout_success: false},
                  action,) => {
    switch (action.type) {
      case "logout_success":
        return {
          logout_success: true,
        };
      case "logout_fail":
        return {
          logout_success: false,
        };
      default:
        return state;
    }
  },
};

export default loginReducer;
