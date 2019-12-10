import React, {Component} from "react";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {Button, Form, Icon, Input, Layout, message, notification} from "antd";
import io from "socket.io-client";
import wsUrl from "@/config";
import request from "@/utils/request";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import "./index.less";

const FormItem = Form.Item;
const {Content} = Layout;

class LoginForm extends Component {
  constructor() {
    super();
    this.state = {
      submitLoading: false,
      verifyUrl: "/user/fetch_verify_code",
      throwErr: false,
    };
  }

  componentWillMount() {
    this.refreshVerifyCode();
  }

  componentDidMount() {
    this.connectSocketJs();
    console.log("测试缓存");
  }

  componentWillReceiveProps() {
    console.log("componentWillReceiveProps");
  }

  componentDidUpdate() {

  }

  componentWillUnmount() {
  }

  connectSocketJs = () => {
    // 本例搭配 websocket-spring-demo
    // 可以实现正确连接
    // let socket = new SockJS('http://127.0.0.1:8082/webSocket/webSocketEndPoint');
    const socket = new SockJS("http://39.108.85.75:15674");
    const stompClient = Stomp.over(socket);
    const headers = {
      username: "admin",
      password: "admin",
    };
    stompClient.connect(headers, function (frame) {
      console.log(`Connected: ${ frame }`);
      stompClient.subscribe("/topic/demo1/greetings", function (greeting) {

      });
      stompClient.subscribe("/topic/demo1/twoWays", function (greeting) {

      });
    });
  };

  refreshVerifyCode = () => {
    this.setState({
      verifyUrl: `/user/fetch_verify_code?r=${ Math.random() }`,
    });
  };

  openNotification = (msg) => {
    notification.config({
      placement: "topRight",
      top: 64,
      duration: 6,
    });

    // 只有在非登录页面，才显示通知消息
    if (window.location.href.indexOf("/login") < 0) {
      notification.info({
        message: "温馨提示",
        description: msg,
        onClick: () => {
          console.log("Notification Clicked!");
        },
      });
    }
  };

  connectMsgCenter = (userId) => {
    if (window.socketConnected) {
      window.socketConnected = null;
    }
    window.socketConnected = io.connect(wsUrl);
    const t = new Date();
    window.socketConnected && window.socketConnected.emit("login", userId);
    console.log(`User ${ userId } login at time: %s~`, t);

    // 后端推送来消息时
    const _this = this;
    window.socketConnected && window.socketConnected.on("message", function (msg) {
      console.log("window.socketConnected(receive msg)", window.socketConnected);
      console.log(`receive msg:${ msg }`);
      _this.openNotification(msg);
    });

    // websocket服务端推送登录成功，此时需要将当前的socketId放入请求会话中
    // 通过向后端发送请求的方式实现
    window.socketConnected && window.socketConnected.on("login_success", function (data) {
      console.log("window.socketConnected(login_success)", window.socketConnected, data);
      request
        .post(
          "/user/set_socket_id_to_user_session",
          {
            socketId: window.socketConnected.id,
          },
          {},
        )
        .then(function (res) {
          console.log("set_socket_id_to_user_session res", res);
          if (res.code === "0000") {
            console.log("set_socket_id_to_user_session success");
          } else {
            console.log("set_socket_id_to_user_session failure");
          }
        });
    });

    window.socketConnected && window.socketConnected.on("redirect_to_login", function () {
      console.log("window.socketConnected(redirect_to_login)", window.socketConnected);
      // _this.openNotification('redirect_to_login');
      _this.toPath("/login");
    });
  };

  toPath = path => {
    this.props.history.push(path);
  };

  handleLogin = (params) => {
    console.log("我点击了登录按钮啊！！！！！！");

    this.setState({
      submitLoading: true,
    });
    request
      .post(
        "/user/login",
        params,
      )
      .then((res) => {
        if (res.code === "0000") {
          message.success("登录成功");
          this.connectMsgCenter(res.data.id);
          sessionStorage.setItem("userInfo", JSON.stringify(res.data));
          this.props.history.push("/home");
          this.setState({
            submitLoading: false,
          });
        } else {
          this.setState({
            submitLoading: false,
          });
          this.refreshVerifyCode();
          message.error(res.msg);
          sessionStorage.clear();
        }
      });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      this.setState({
        throwErr: true,
      });
      if (!err) {
        this.handleLogin({
          userName: values.userName,
          password: values.password,
          verifyCode: values.verifyCode,
        });
      }
    });
  };

  render() {
    const {getFieldDecorator} = this.props.form;
    const {submitLoading, verifyUrl} = this.state;

    return (
      <Layout>
        <Content className="login">
          <div className="login-title">
            <span className="large-title">TODOLIST</span>
            <span className="normal-title">V1.0.0</span>
          </div>
          <div className="login-form-wrapper">
            <Form onSubmit={this.handleSubmit} className="login-form">
              <FormItem>
                {getFieldDecorator("userName", {
                  rules: [{required: true, message: "请输入用户名"}],
                })(<Input
                  className="login-input"
                  prefix={
                    <Icon type="user" style={{color: "rgba(0,0,0,.25)"}}/>
                  }
                  placeholder="用户名"
                />)}
              </FormItem>
              <FormItem>
                {getFieldDecorator("password", {
                  rules: [{required: true, message: "请输入密码"}],
                })(<Input
                  className="login-input"
                  prefix={
                    <Icon type="lock" style={{color: "rgba(0,0,0,.25)"}}/>
                  }
                  type="password"
                  placeholder="密码"
                />)}
              </FormItem>
              <FormItem style={{display: "inline-block"}} className="password-len">
                {getFieldDecorator("verifyCode", {
                  rules: [{required: true, message: "请输入验证码"}],
                })(<Input
                  className="login-input"
                  prefix={
                    <i
                      style={{fontSize: 14, fontWeight: 900, color: "rgba(0,0,0,.25)"}}
                      className="iconfont icon-yanzhengma2"
                    />
                    // <Icon type="lock" style={{color: "rgba(0,0,0,.25)"}}/>
                  }
                  placeholder="验证码"
                />)}
              </FormItem>
              <FormItem style={{display: "inline-block"}}>
                <img
                  src={verifyUrl} height={40} style={{cursor: "pointer"}} alt="captcha"
                  onClick={this.refreshVerifyCode}
                />
              </FormItem>
              <FormItem>
                <Button
                  type="primary"
                  className="login-form-button"
                  htmlType="submit"
                  loading={submitLoading}
                >
                  登录
                </Button>
                <Button
                  type="primary"
                  className="register-button"
                  onClick={() => this.toPath("/register")}
                >
                  去注册
                </Button>
              </FormItem>
            </Form>
          </div>
        </Content>
      </Layout>
    );
  }
}

// 映射state到容器组件props
const mapStateToProps = state => ( {
  login_result: state.login_result,
} );

// 映射dispatch到容器组件props
const mapDispatchToProps = dispatch => ( {
  login: param => {
    dispatch({
      type: "login",
      payload: param,
    });
  },
} );

const Login = Form.create()(LoginForm);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(Login));
