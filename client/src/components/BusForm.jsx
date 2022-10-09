import React, { useState } from "react";
import { Col, Form, message, Modal, Row } from "antd";
import { axiosInstance } from "../helpers/axiosInstance";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";
//import moment from "moment";

function BusForm({
  showBusForm,
  setShowBusForm,
  type,
  getData,
  selectedBus,
  setSelectedBus,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const InitialState = {
    name: "",
    number: "",
    capacity: "",
    from: "",
    to: "",
    journeyDate: "",
    departure: "",
    arrival: "",
    type: "AC",
    fare: "",
    status: "Yet To Start",
  };
  const [busDetails, setBusDetails] = useState(type === 'add'? InitialState : selectedBus);
  function handleBusDetails(key, value) {
    setBusDetails((prev) => {
      return {
        ...prev,
        [key]: value,
      };
    });
  }
  const onFinish = async () => {
    try {
      dispatch(ShowLoading());
      let response=null;
      if (type === "add") {
        response = await axiosInstance.post("/api/buses/add-bus", busDetails);
      } else {
        response = await axiosInstance.post("/api/buses/update-bus", {
          ...busDetails,
          _id: selectedBus._id,
        });
      }
      dispatch(HideLoading());
      if (response.data.success) {
        message.success(response.data.message);
        navigate("/admin/buses");
      } else {
        message.error(response.data.message);
      }
      getData();
      setShowBusForm(false);
      setSelectedBus(null)
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };
  return (
    <Modal
      width={800}
      title={type === "add" ? "Add Bus" : "Update Bus"}
      visible={showBusForm}
      onCancel={() => {
        setSelectedBus(null)
        setShowBusForm(false);
      }}
      footer={false}
    >
      <Form layout="vertical" onFinish={onFinish} initialValues={selectedBus}>
        <Row gutter={[10, 10]}>
          <Col lg={24} xs={24}>
            <Form.Item label="Bus Name" name="name">
              <input
                type="text"
                onChange={(e) => handleBusDetails("name", e.target.value)}
                required={true}
              />
            </Form.Item>
          </Col>
          <Col lg={12} xs={24}>
            <Form.Item label="Bus Number" name="number">
              <input
                type="text"
                onChange={(e) => handleBusDetails("number", e.target.value)}
                required={true}
              />
            </Form.Item>
          </Col>
          <Col lg={12} xs={24}>
            <Form.Item label="Capacity" name="capacity">
              <input
                type="text"
                onChange={(e) => handleBusDetails("capacity", e.target.value)}
                required={true}
              />
            </Form.Item>
          </Col>

          <Col lg={12} xs={24}>
            <Form.Item label="From" name="from">
              <input
                type="text"
                onChange={(e) => handleBusDetails("from", e.target.value)}
                required={true}
              />
            </Form.Item>
          </Col>
          <Col lg={12} xs={24}>
            <Form.Item label="To" name="to">
              <input
                type="text"
                onChange={(e) => handleBusDetails("to", e.target.value)}
                required={true}
              />
            </Form.Item>
          </Col>

          <Col lg={8} xs={24}>
            <Form.Item label="Journey Date" name="journeyDate">
              <input
                type="date"
                onChange={(e) =>
                  handleBusDetails("journeyDate", e.target.value)
                }
                required={true}
              />
            </Form.Item>
          </Col>
          <Col lg={8} xs={24}>
            <Form.Item label="Departure" name="departure">
              <input
                type="time"
                onChange={(e) => handleBusDetails("departure", e.target.value)}
                required={true}
              />
            </Form.Item>
          </Col>
          <Col lg={8} xs={24}>
            <Form.Item label="Arrival" name="arrival">
              <input
                type="time"
                onChange={(e) => {
                  handleBusDetails("arrival", e.target.value);
                }}
                required={true}
              />
            </Form.Item>
          </Col>

          <Col lg={12} xs={24}>
            <Form.Item label="Type" name="type">
              <select
                name=""
                id=""
                onChange={(e) => {
                  handleBusDetails("type", e.target.value);
                }}
                required={true}
              >
                <option value="AC">AC</option>
                <option value="Non-AC">Non-AC</option>
              </select>
            </Form.Item>
          </Col>
          <Col lg={12} xs={24}>
            <Form.Item label="Fare" name="fare">
              <input
                type="text"
                onChange={(e) => handleBusDetails("fare", e.target.value)}
                required={true}
              />
            </Form.Item>
          </Col>

          <Col lg={12} xs={24}>
            <Form.Item label="Status" name="status">
              <select
                name=""
                id=""
                onChange={(e) => handleBusDetails("status", e.target.value)}
                required={true}
              >
                <option value="Yet To Start">Yet To Start</option>
                <option value="Running">Running</option>
                <option value="Completed">Completed</option>
              </select>
            </Form.Item>
          </Col>
        </Row>

        <div className="d-flex justify-content-end">
          <button className="primary-btn" type="submit">
            Save
          </button>
        </div>
      </Form>
    </Modal>
  );
}

export default BusForm;
