import {
  Elements,
  CardElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { axiosInstance } from "../helpers/axiosInstance";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";
import { Col, Form, message, Modal, Row } from "antd";

const PUBLIC_KEY =
  "pk_test_51LqVW6SHl7KO3iEFsqzAe6SpIwAKPCh5a3bGMwSFwTuuDR5nMX1wftZvY7Kxhoj1iM6KjdSxAR6vq20tEmXtjkI900oFGuMfOy";

const stripeTestPromise = loadStripe(PUBLIC_KEY);
console.log("stripeTestPromise = ", stripeTestPromise);

const CARD_OPTIONS = {
  iconStyle: "solid",
  style: {
    base: {
      iconColor: "orange",
      color: "black",
      fontWeight: 500,
      fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
      fontSize: "16px",
      fontSmoothing: "antialiased",
      ":-webkit-autofill": { color: "#fce883" },
      "::placeholder": { color: "#87bbfd" },
    },
    invalid: {
      iconColor: "#ffc7ee",
      color: "black",
    },
  },
};

function PaymentForm() {
  const navigate = useNavigate();
  const params = useParams();
  const stripe = useStripe();
  const elements = useElements();
  //   const onToken = async (token) => {
  //     console.log("token = ", token);
  //     try {
  //       dispatch(ShowLoading());
  //       const response = await axiosInstance.post("/api/bookings/make-payment", {
  //         token,
  //         amount: selectedSeats.length * bus.fare * 100,
  //       });
  //       dispatch(HideLoading());
  //       if (response.data.success) {
  //         message.success(response.data.message);
  //         bookNow(response.data.data.transactionId);
  //       } else {
  //         message.error(response.data.message);
  //       }
  //     } catch (error) {
  //       dispatch(HideLoading());
  //       message.error(error.message);
  //     }
  //   };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
    });
    if (!error) {
      try {
        const { id } = paymentMethod;
        console.log("id = ", id);
        const response = await axiosInstance.post(
          "/api/bookings/make-payment",
          {
            amount: 10000,
            id,
          }
        );
        if (response.data.success) {
          message.success(response.data.message);
          navigate(`/book-now/${params.id}`);
        } else {
          message.error(response.data.message);
          navigate(`/book-now/${params.id}`);
        }
      } catch (error) {
        message.error(error.message);
        navigate(`/book-now/${params.id}`);
      }
    } else {
      message.error(error);
      navigate(`/book-now/${params.id}`);
    }
  };
  return (
    <Elements stripe={stripeTestPromise}>
      <form onSubmit={handleSubmit}>
        <fieldset className="FormGroup">
          <div className="FormRow">
            <CardElement options={CARD_OPTIONS} />
          </div>
        </fieldset>
        <button>Pay</button>
      </form>
    </Elements>
  );
}

export default PaymentForm;
