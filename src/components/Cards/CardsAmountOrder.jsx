import React, { useEffect, useState } from "react";
import "./Cards.css";

import Card from '../Card/CardAmountOrder'
import axios from "axios";
import { baseURL } from "../../constants/baseURL";
import { UilUsdSquare, UilMoneyWithdrawal, UilClipboardAlt } from "@iconscout/react-unicons";

const CardsAmountOrder = () => {
  // TOTAL AMOUNT ORDER:
  const [amountOrdered, setAmountOrdered] = useState(0);
  const [amountConfirmed, setAmountConfirmed] = useState(0);
  const [amountWait_Delivering, setAmountWait_Delivering] = useState(0);
  const [amountDelivering, setAmountDelivering] = useState(0);
  const [amountDelivered, setAmountDelivered] = useState(0);
  const [amountPaid, setAmountPaid] = useState(0);
  const [amountCanceled, setAmountCanceled] = useState(0);
  const totalAmount = amountCanceled+amountConfirmed+amountOrdered+amountDelivered+amountDelivering+amountWait_Delivering+amountPaid
  useEffect(() => {
    // AMOUNT ORDER:
    axios.get(`${baseURL}/statistic/order-amount-by-status?orderStatus=Delivering`)
      .then((res) => setAmountDelivering(res.data))
      .catch((err) => console.log(err))
    axios.get(`${baseURL}/statistic/order-amount-by-status?orderStatus=Ordered`)
      .then((res) => setAmountOrdered(res.data))
      .catch((err) => console.log(err))
    axios.get(`${baseURL}/statistic/order-amount-by-status?orderStatus=Confirmed`)
      .then((res) => setAmountConfirmed(res.data))
      .catch((err) => console.log(err))
    axios.get(`${baseURL}/statistic/order-amount-by-status?orderStatus=Wait_Delivering`)
      .then((res) => setAmountWait_Delivering(res.data))
      .catch((err) => console.log(err))
    axios.get(`${baseURL}/statistic/order-amount-by-status?orderStatus=Delivered`)
      .then((res) => setAmountDelivered(res.data))
      .catch((err) => console.log(err))
    axios.get(`${baseURL}/statistic/order-amount-by-status?orderStatus=Done`)
      .then((res) => setAmountPaid(res.data))
      .catch((err) => console.log(err))
    axios.get(`${baseURL}/statistic/order-amount-by-status?orderStatus=Cancel`)
      .then((res) => setAmountCanceled(res.data))
      .catch((err) => console.log(err))
  }, [])

  const cardsData = [
    {
      title: "Success",
      color: {
        backGround: "linear-gradient(180deg, #43eb34 0%, #6beb34 100%)",
        boxShadow: "0px 10px 20px 0px #e0c6f5",
      },
      barValue: (amountPaid / totalAmount * 100).toFixed(2),
      value: amountPaid,
      png: UilUsdSquare,
      series: [
        {
          name: "Sales",
          data: [31, 40, 28, 51, 42, 109, 100],
        },
      ],
    },
    {
      title: "Canceled",
      color: {
        backGround: "linear-gradient(180deg, #FF919D 0%, #FC929D 100%)",
        boxShadow: "0px 10px 20px 0px #FDC0C7",
      },
      barValue: (amountCanceled / totalAmount * 100).toFixed(2),
      value: amountCanceled,
      png: UilMoneyWithdrawal,
      series: [
        {
          name: "Revenue",
          data: [10, 100, 50, 70, 80, 30, 40],
        },
      ],
    },
    {
      title: "Delivering",
      color: {
        backGround:
          "linear-gradient(rgb(248, 212, 154) -146.42%, rgb(255 202 113) -46.42%)",
        boxShadow: "0px 10px 20px 0px #F9D59B",
      },
      barValue: (amountDelivering / totalAmount * 100).toFixed(2),
      value: amountDelivering,
      png: UilClipboardAlt,
      series: [
        {
          name: "Expenses",
          data: [10, 25, 15, 30, 12, 15, 20],
        },
      ],
    },
    
  ];
  const cardsData1 = [
    {
      title: "Confirmed",
      color: {
        backGround: "linear-gradient(180deg, #34eb8c 0%, #34eb99 100%)",
        boxShadow: "0px 10px 20px 0px #e0c6f5",
      },
      barValue: (amountConfirmed / totalAmount * 100).toFixed(2),
      value: amountConfirmed,
      png: UilUsdSquare,
      series: [
        {
          name: "Sales",
          data: [31, 40, 28, 51, 42, 109, 100],
        },
      ],
    },
    {
      title: "Delivered",
      color: {
        backGround: "linear-gradient(180deg, #34ebd3 0%, #34ebdf 100%)",
        boxShadow: "0px 10px 20px 0px #FDC0C7",
      },
      barValue: (amountDelivered / totalAmount * 100).toFixed(2),
      value: amountDelivered,
      png: UilMoneyWithdrawal,
      series: [
        {
          name: "Revenue",
          data: [10, 100, 50, 70, 80, 30, 40],
        },
      ],
    },
    {
      title: "Ordered",
      color: {
        backGround: "linear-gradient(180deg, #34b4eb 0%, #34a8eb 100%)",
        boxShadow: "0px 10px 20px 0px #F9D59B",
      },
      barValue: (amountOrdered / totalAmount * 100).toFixed(2),
      value: amountOrdered,
      png: UilClipboardAlt,
      series: [
        {
          name: "Expenses",
          data: [10, 25, 15, 30, 12, 15, 20],
        },
      ],
    },
  ]
  console.log('amount order==========================: ', amountCanceled, amountConfirmed, amountDelivered, amountDelivering, amountOrdered, amountPaid, amountWait_Delivering)
  return (
    <div>
      <div className="Cards">
        {cardsData.map((card, id) => {
          return (
            <div className="parentContainer" key={id}>
              <Card
                title={card.title}
                color={card.color}
                barValue={card.barValue}
                value={card.value}
                png={card.png}
                series={card.series}
              />
            </div>
          );
        })}
      </div>
      <div className="Cards" style={{marginTop: 20}}>
        {cardsData1.map((card, id) => {
          return (
            <div className="parentContainer" key={id}>
              <Card
                title={card.title}
                color={card.color}
                barValue={card.barValue}
                value={card.value}
                png={card.png}
                series={card.series}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CardsAmountOrder;
