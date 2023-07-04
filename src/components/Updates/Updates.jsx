import React, { useEffect, useState } from "react";
import "./Updates.css";
import { UpdatesData } from "../../Data/Data";
import axios from "axios";
import { baseURL } from "../../constants/baseURL";
import avatar from '../../imgs/profile.png'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
const Updates = () => {
  const [shipperList, setShipperList] = useState([]);
  const [shipperListOriginal, setShipperListOriginal] = useState([]);
  const [summaryHeight, setSummaryHeight] = useState(false);
  const [topShipper, setTopShipper] = useState([]);
  useEffect(() => {
    axios.get(`${baseURL}/api/v1/user`) //statistic/top5-shipper-by-order
      .then((res) => {
        let x = res.data.filter(
          (item) => item.role.id === 3
        )
        setShipperList(x);
        setShipperListOriginal(x);
        
      })
      .catch((err) => console.log(err))
    // TOP SHIPPER AMOUNT ORDER SUCCESS
    axios.get(`${baseURL}/statistic/top5-shipper-by-order`)
      .then((res) => setTopShipper(res.data))
      .catch((err) => console.log(err))
  }, [])
  useEffect(() => {
    if(summaryHeight) {
      setShipperList(shipperListOriginal.slice(0,1))
    }
    else {
      setShipperList(shipperListOriginal);
    }
  }, [summaryHeight])
  return (
    <div className="Updates" style={ {height: 200, overflowY: 'scroll'}}>
      {/* <div style={{display: 'flex', justifyContent: 'flex-end'}} onClick={() => setSummaryHeight(!summaryHeight)}>
      <KeyboardArrowDownIcon/>
      </div> */}
      <div style={{display: 'flex', justifyContent: 'space-between'}}>
        <p style={{fontWeight: 'bold'}}>Name</p>
        <p style={{fontWeight: 'bold'}}>Order</p>
      </div>
      {
        
        shipperList.map((update) => {
          let x = {}
          topShipper.map((shipper) => {
            if(update.name === shipper.shipperName) {
              x = {...update, amountOrder: shipper.orderAmount}
            }
          })
          return (
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
              <div className="update">
                <img src={avatar} alt="profile" />
                <div className="noti">
                  <div  style={{marginBottom: '0.5rem'}}>
                    <span>{x.name}</span>
                  </div>
                    <span> {x.phone}</span>
                    <span style={{width: 50}}>{x.email}</span>
                </div>
              </div>
              <div style={{}}>
                <p className="amountOrderShipper">{x.amountOrder}</p>
              </div>
            </div>
          );
        })
      }
    </div>
  );
};

export default Updates;
