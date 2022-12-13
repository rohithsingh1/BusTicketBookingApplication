import React, { useState } from "react";
import { Form, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { ShowLoading, HideLoading } from "../redux/alertsSlice";
import "../resources/auth.css";

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    adminAccessCode: "",
  });

  const register = async () => {
    try {
      if (
        user.name !== "" &&
        user.email !== "" &&
        user.password !== "" &&
        user.confirmPassword !== ""
      ) {
        if (user.password !== user.confirmPassword) {
          message.error("password doesnot match");
        } else {
          dispatch(ShowLoading());
          const response = await axios.post(`/api/users/register`, user);
          dispatch(HideLoading());
          if (response.data.success) {
            message.success(response.data.message);
            navigate("/login");
          } else {
            message.error(response.data.message);
          }
        }
      } else {
        message.error("please enter the all feilds");
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error);
      console.log("error in register form = ", error);
    }
  };

  return (
    <div className="h-screen d-flex justify-content-center align-items-center auth">
      <div className="w-400 card p-3">
        <h1 className="text-lg">Register</h1>
        <hr />
        <Form layout="vertical" onFinish={register}>
          <Form.Item label="Name" name="name">
            <input
              type="text"
              placeholder="Name"
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
              required
            />
          </Form.Item>
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
          <Form.Item label="Confirm Password" name="Confirm password">
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
          <Form.Item label="Admin Access code" name="Admin Access code">
            <input
              type="password"
              placeholder="Admin Access code"
              value={user.adminAccessCode}
              onChange={(e) =>
                setUser({ ...user, adminAccessCode: e.target.value })
              }
            />
          </Form.Item>
          <div className="d-flex justify-content-between align-items-center my-3">
            <Link to="/login">Click Here To Login</Link>
            <button className="secondary-btn" type="submit">
              Register
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default Register;
