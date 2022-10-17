import React, { useState } from "react";
import { Col, Form, message, Modal, Row } from "antd";
// import { axiosInstance } from "../helpers/axiosInstance";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";
import uuid from "react-uuid";
import axios from "axios";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

function PaymentFormModel({
  showPaymentForm,
  setShowPaymentForm,
  amount,
  bookNow,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  const onFinish = async (e) => {
    console.log("e = ", e);
    try {
      dispatch(ShowLoading());
      const response = await axios.post(
        "/api/bookings/make-payment",
        {
          amount,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(HideLoading());
      console.log("response in paymentformmodel = ", response);
      if (response.data.success) {
        console.log("response.data.success = ", response.data.success);
        const confirmPayment = await stripe.confirmCardPayment(
          response.data.client_secret,
          {
            payment_method: {
              card: elements.getElement(CardNumberElement),
            },
          }
        );
        console.log(
          "confirmPayment.paymentIntent.status = ",
          confirmPayment.paymentIntent.status
        );
        if (confirmPayment.paymentIntent.status === "succeeded") {
          console.log("payment confirmed");
          message.success(response.data.message);
          bookNow(response.data.id);
        }
      } else {
        message.error(response.data.message);
        console.log("response in else part = ", response.data);
      }
    } catch (error) {
      dispatch(HideLoading());
      console.log("error = ", error);
      message.success("Payment successfull Temparary!!");
      const randomNumber = uuid();
      console.log("random number = ", randomNumber);
      bookNow(randomNumber);
    }
  };
  return (
    <Modal
      width={800}
      title="Payment Form"
      visible={showPaymentForm}
      onCancel={() => {
        setShowPaymentForm(false);
      }}
      footer={false}
    >
      <Form layout="vertical" onFinish={onFinish}>
        <Row gutter={[10, 10]}>
          <Col lg={24} xs={24}>
            <Form.Item label="Card No" name="Card No">
              <CardNumberElement />
            </Form.Item>
          </Col>
          <Col lg={12} xs={24}>
            <Form.Item label="CardExpiryDate" name="CardExpiryDate">
              <CardExpiryElement />
            </Form.Item>
          </Col>
          <Col lg={12} xs={24}>
            <Form.Item label="CVC Number" name="CvcNumber">
              <CardCvcElement />
            </Form.Item>
          </Col>
        </Row>

        <div className="d-flex justify-content-end">
          <button className="primary-btn" type="submit">
            Pay {amount / 100}
          </button>
        </div>
      </Form>
    </Modal>
  );
}

export default PaymentFormModel;
