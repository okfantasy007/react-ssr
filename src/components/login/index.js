import React, {Component} from "react";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {Button, Form, Icon, Input, Layout, message, notification} from "antd";
import request from "@/utils/request";

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
    // this.refreshVerifyCode();
  }

  componentDidMount() {

  }

  componentWillReceiveProps() {
    console.log("componentWillReceiveProps");
  }

  componentDidUpdate() {

  }

  componentWillUnmount() {
  }

	// refreshVerifyCode = () => {
  //   this.setState({
  //     verifyUrl: `/user/fetch_verify_code?r=${ Math.random() }`,
  //   });
  // };

  /*toPath = path => {
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
  };*/

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
