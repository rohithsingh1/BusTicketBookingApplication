import React, { useState } from "react";
import { Form, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { ShowLoading, HideLoading } from "../redux/alertsSlice";
import "../resources/auth.css";

function ForgotPassword() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [user, setUser] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const forgot_password = async (req, res) => {
    try {
      if (
        user.email !== "" &&
        user.password !== "" &&
        user.confirmPassword !== ""
      ) {
        dispatch(ShowLoading());
        const response = await axios.post("/api/users/forgot-password", user);
        dispatch(HideLoading());
        if (response.data.success) {
          message.success(response.data.message);
          localStorage.setItem("token", response.data.token);
          navigate("/");
        } else {
          message.error(response.data.message);
        }
      } else {
        message.error("enter the email and password");
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error);
      console.log("error in login = ", error);
    }
  };
  return (
    <div className="h-screen d-flex justify-content-center align-items-center auth">
      <div className="w-400 card p-3">
        <h1 className="text-lg">Login</h1>
        <hr />
        <Form layout="vertical" onFinish={forgot_password}>
          <Form.Item label="Email" name="email">
            <input
              type="email"
              placeholder="Email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              required
            />
          </Form.Item>
          <Form.Item label="Password" name="password">
            <input
              type="password"
              placeholder="Password"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              required
            />
          </Form.Item>
          <Form.Item label="ConfirmPassword" name="Confirmpassword">
            <input
              type="password"
              placeholder="Confirm Password"
              value={user.confirmPassword}
              onChange={(e) =>
                setUser({ ...user, confirmPassword: e.target.value })
              }
              required
            />
          </Form.Item>
          <div className="d-flex justify-content-between align-items-end p-1 my-3">
            <Link className="p-0 m-0 linkForgotPassword" to="/register">
              Click Here To Register
            </Link>
            <Link className="p-0 m-0 linkForgotPassword" to="/login">
              Remember Credentials?
            </Link>
          </div>
          <div className="d-flex justify-content-between align-items-center my-3">
            <button className="secondary-btn" type="submit">
              Login
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default ForgotPassword;
