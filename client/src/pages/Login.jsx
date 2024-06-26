import React, { useState } from "react";
import { Form, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { ShowLoading, HideLoading } from "../redux/alertsSlice";
import "../resources/auth.css";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [user, setUser] = useState({
    email: "GuestUser@gmail.com",
    password: "GuestUser",
  });

  const login = async (req, res) => {
    try {
      if (user.email !== "" && user.password !== "") {
        dispatch(ShowLoading());
        const response = await axios.post(
          `/api/users/login`,
          user
        );
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
        <Form layout="vertical" onFinish={login}>
          <Form.Item label="Email">
            <input
              type="email"
              placeholder="Email"
              value={user.email ? user.email : "GuestUser@gmail.com"}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              required
            />
          </Form.Item>
          <Form.Item label="Password">
            <input
              type="password"
              placeholder="Password"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              required
            />
          </Form.Item>
          <div className="d-flex justify-content-between align-items-center my-3">
            <Link to="/register">Click Here To Register</Link>
            <Link to="/forgot-password">forgot Password?</Link>
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

export default Login;
