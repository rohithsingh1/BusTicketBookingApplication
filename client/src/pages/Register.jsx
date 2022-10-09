import React, { useState } from "react";
import { Form, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { ShowLoading, HideLoading } from "../redux/alertsSlice";
import "../resources/auth.css";

function Register() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [password, setPassword] = useState("");
  const onFinish=async () => {
    try {
      const newUser = {
        name,
        email,
        password,
      };
      dispatch(ShowLoading())
      const response=await axios.post('/api/users/register',newUser)
      dispatch(HideLoading())
      if(response.data.success) {
        message.success(response.data.message)
        navigate('/login')
      } else {
        message.error(response.data.message)
      }
    } catch(error) {
      dispatch(HideLoading())
      message.error(error.message)
    }
  };
  return (
    <div className="h-screen d-flex justify-content-center align-items-center auth">
      <div className="w-400 card p-3">
        <h1 className="text-lg">Register</h1>
        <hr />
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item label="Name" name="name">
            <input
              type="text"
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Item>
          <Form.Item label="Email" name="email">
            <input
              type="text"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Item>
          <Form.Item label="Password" name="password">
            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              required
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
