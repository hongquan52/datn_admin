import React from "react";
import Chart from "react-apexcharts";
import './CustomerReview.css'

const CustomerReview2 = ({revenue7Days}) => {
  const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 
              'FRIDAY', 'SATERDAY', 'SUNDAY'];
  var goBackDays = 7;

  var today = new Date();
  var daysSorted = [];

  for(var i = 0; i < goBackDays; i++) {
    var newDate = new Date(today.setDate(today.getDate() - 1));
    daysSorted.push(days[newDate.getDay()]);
  }
  const data = {
    series: [
      {
        name: "Customer",
        data: revenue7Days,
      },
    ],
    options: {
      chart: {
        type: 'area',
        height: '100px',
      },

      fill: {
        colors: ["#fff"],
        type: "gradient",
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
        colors: ["#ff929f"],
      },
      tooltip: {
        x: {
          format: "dd/MM/yy HH:mm",
        },
      },
      grid: {
        show: false,
      },
      xaxis: {
        type: 'String',
        categories: daysSorted,
      },
      yaxis: {
        show: false
      },
      toolbar:{
        show: false
      }
    },
  };
  return <div className="CustomerReview">
        <Chart height={400} width={400}  options={data.options} series={data.series} type="area" />
  </div>;
};

export default CustomerReview2;
