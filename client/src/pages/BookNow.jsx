import { Col, message, Row } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import SeatSelection from "../components/SeatSelection";
import axios from "axios";
//import { axiosInstance } from "../helpers/axiosInstance";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";
import StripeCheckout from "react-stripe-checkout";
import uuid from "react-uuid";
import PaymentFormModel from "../components/PaymentFormModel";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
const PUBLIC_KEY =
  "pk_test_51LqVW6SHl7KO3iEFsqzAe6SpIwAKPCh5a3bGMwSFwTuuDR5nMX1wftZvY7Kxhoj1iM6KjdSxAR6vq20tEmXtjkI900oFGuMfOy";
const stripePromise = loadStripe(PUBLIC_KEY);

function BookNow() {
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bus, setBus] = useState(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const getBus = async () => {
    try {
      dispatch(ShowLoading());
      const response = await axios.post(
        `/api/buses/get-bus-by-id`,
        {
          _id: params.id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(HideLoading());
      if (response.data.success) {
        setBus(response.data.data);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const bookNow = async (transactionId) => {
    try {
      dispatch(ShowLoading());
      const response = await axios.post(
        `/api/bookings/book-seat`,
        {
          bus: bus._id,
          seats: selectedSeats,
          transactionId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(HideLoading());
      if (response.data.success) {
        message.success(response.data.message);
        navigate("/bookings");
      } else {
        message.error(response.data.success);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  useEffect(() => {
    getBus();
  }, []);
  return (
    <div>
      {
        bus&&(
        <Row className="mt-3" gutter={[30, 30]}>
          <Col lg={12} xs={24} sm={24}>
            <h1 className="text-2xl primary-text">{bus.name}</h1>
            <h1 className="text-md">
              {bus.from} - {bus.to}
            </h1>
            <hr />

            <div className="flex flex-col gap-2">
              <p className="text-md">Jourey Date : {bus.journeyDate}</p>
              <p className="text-md">Fare : $ {bus.fare} /-</p>
              <p className="text-md">Departure Time : {bus.departure}</p>
              <p className="text-md">Arrival Time : {bus.arrival}</p>
              <p className="text-md">Capacity : {bus.capacity}</p>
              <p className="text-md">
                Seats Left : {bus.capacity - bus.seatsBooked.length}
              </p>
            </div>
            <hr />

            <div className="flex flex-col gap-2">
              <h1 className="text-2xl">
                Selected Seats : {selectedSeats.join(", ")}
              </h1>
              <h1 className="text-2xl mt-2">
                Fare : {bus.fare * selectedSeats.length} /-
              </h1>
              <hr />
              {selectedSeats.length === 0 ? (
                <button
                  className={`primary-btn ${
                    selectedSeats.length === 0 && "disabled-btn"
                  }`}
                  disabled={selectedSeats.length === 0}
                >
                  Book Now
                </button>
              ) : (
                <button
                  className={"primary-btn"}
                  onClick={() => setShowPaymentForm(true)}
                >
                  Book Now
                </button>
              )}
            </div>
            {showPaymentForm && (
              <Elements stripe={stripePromise}>
                <PaymentFormModel
                  showPaymentForm={showPaymentForm}
                  setShowPaymentForm={setShowPaymentForm}
                  amount={selectedSeats.length * bus.fare * 100}
                  bookNow={bookNow}
                />
              </Elements>
            )}
          </Col>
          <Col lg={12} xs={24} sm={24}>
            <SeatSelection
              selectedSeats={selectedSeats}
              setSelectedSeats={setSelectedSeats}
              bus={bus}
            />
          </Col>
        </Row>
      )}
    </div>
  );
}

export default BookNow;
