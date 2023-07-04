import React, { useEffect, useState } from "react";
import "./Cards.css";

import Card from "../Card/Card";
import axios from "axios";
import { baseURL } from "../../constants/baseURL";
import { UilUsdSquare, UilMoneyWithdrawal, UilClipboardAlt } from "@iconscout/react-unicons";

const Cards = () => {
  const [totalRevenue, setTotalRevenue] = useState();
  const [totalRevenueSuccess, setTotalRevenueSuccess] = useState();
  const [totalRevenueProcess, setTotalRevenueProcess] = useState();
  const [totalRevenueCanceled, setTotalRevenueCanceled] = useState();
  useEffect(() => {
    // Total
    axios.get(`${baseURL}/statistic/total-revenue?sinceDay=2023/01/01&toDay=2023/12/12`)
      .then((res) => setTotalRevenue(res.data))
      .catch((err) => console.log(err))
    // Success
    axios.get(`${baseURL}/statistic/total-success-revenue?sinceDay=2023/01/01&toDay=2023/12/12`)
      .then((res) => setTotalRevenueSuccess(res.data))
      .catch((err) => console.log(err))
    // Processing
    axios.get(`${baseURL}/statistic/total-progress-revenue?sinceDay=2023/01/01&toDay=2023/12/12`)
      .then((res) => setTotalRevenueProcess(res.data))
      .catch((err) => console.log(err))
    // Canceled
    axios.get(`${baseURL}/statistic/total-cancel-revenue?sinceDay=2023/01/01&toDay=2023/12/12`)
      .then((res) => setTotalRevenueCanceled(res.data))
      .catch((err) => console.log(err))
  }, [])
  const cardsData = [
    {
      title: "Success",
      color: {
        backGround: "linear-gradient(180deg, #43eb34 0%, #6beb34 100%)",
        boxShadow: "0px 10px 20px 0px #e0c6f5",
      },
      barValue: (totalRevenueSuccess / totalRevenue * 100).toFixed(2),
      value: totalRevenueSuccess,
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
      barValue: (totalRevenueCanceled / totalRevenue * 100).toFixed(2),
      value: totalRevenueCanceled,
      png: UilMoneyWithdrawal,
      series: [
        {
          name: "Revenue",
          data: [10, 100, 50, 70, 80, 30, 40],
        },
      ],
    },
    {
      title: "Processing",
      color: {
        backGround:
          "linear-gradient(rgb(248, 212, 154) -146.42%, rgb(255 202 113) -46.42%)",
        boxShadow: "0px 10px 20px 0px #F9D59B",
      },
      barValue: (totalRevenueProcess / totalRevenue * 100).toFixed(2),
      value: totalRevenueProcess,
      png: UilClipboardAlt,
      series: [
        {
          name: "Expenses",
          data: [10, 25, 15, 30, 12, 15, 20],
        },
      ],
    },
  ];
  return (
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
  );
};

export default Cards;
