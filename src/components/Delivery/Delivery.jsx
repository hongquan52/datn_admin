import React from "react";
import TableDelivery from "../Table/TableDelivery";
import "./Delivery.css";
const Delivery = () => {
  return (
    <div className="MainDash">
      <h1>Đơn hàng trễ hẹn</h1>
      <TableDelivery />
    </div>
  );
};

export default Delivery;
