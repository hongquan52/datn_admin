import React , {useState, useEffect} from "react";
import Chart from "react-apexcharts";
import axios from "axios";
import { baseURL } from "../../constants/baseURL";

const CustomerReview = () => {
  // REVENUE LAST 7 DAYS:
  const [revenue7Days, setRevenue7Days] = useState([]);
  useEffect(() => {
      axios.get(`${baseURL}/statistic/total-revenue-in-7days`)
          .then((res) => {
              let x = res.data.map((item) => {
                  return item/1000000
              })
              setRevenue7Days(x)
          })
          .catch((err) => console.log(err))
  }, [])
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
        name: "Review",
        data: revenue7Days,
      },
    ],
    options: {
      chart: {
        type: "area",
        height: "auto",
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
        <Chart options={data.options} series={data.series} type="area" />
  </div>;
};

export default CustomerReview;
